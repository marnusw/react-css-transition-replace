/**
 * Adapted from ReactCSSTransitionGroup.js by Facebook
 *
 * @providesModule ReactCSSTransitionReplace
 */

import React from 'react';
import ReactDOM from 'react-dom';

import ReactCSSTransitionGroupChild from 'react/lib/ReactCSSTransitionGroupChild';

const reactCSSTransitionGroupChild = React.createFactory(ReactCSSTransitionGroupChild);

const TICK = 17;


function createTransitionTimeoutPropValidator(transitionType) {
  const timeoutPropName = 'transition' + transitionType + 'Timeout';
  const enabledPropName = 'transition' + transitionType;

  return function(props) {
    // If the transition is enabled
    if (props[enabledPropName]) {
      // If no timeout duration is provided
      if (!props[timeoutPropName]) {
        return new Error(timeoutPropName + ' wasn\'t supplied to ReactCSSTransitionReplace: '
          + 'this can cause unreliable animations and won\'t be supported in '
          + 'a future version of React. See '
          + 'https://fb.me/react-animation-transition-group-timeout for more ' + 'information.');

        // If the duration isn't a number
      }
      else if (typeof props[timeoutPropName] != 'number') {
        return new Error(timeoutPropName + ' must be a number (in milliseconds)');
      }
    }
  };
}

export default class ReactCSSTransitionReplace extends React.Component {

  static displayName = 'ReactCSSTransitionReplace';

  static propTypes = {
    transitionName: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.shape({
      enter: React.PropTypes.string,
      leave: React.PropTypes.string,
      active: React.PropTypes.string,
      height: React.PropTypes.string
    }), React.PropTypes.shape({
      enter: React.PropTypes.string,
      enterActive: React.PropTypes.string,
      leave: React.PropTypes.string,
      leaveActive: React.PropTypes.string,
      appear: React.PropTypes.string,
      appearActive: React.PropTypes.string,
      height: React.PropTypes.string
    })]).isRequired,

    transitionAppear: React.PropTypes.bool,
    transitionEnter: React.PropTypes.bool,
    transitionLeave: React.PropTypes.bool,
    transitionAppearTimeout: createTransitionTimeoutPropValidator('Appear'),
    transitionEnterTimeout: createTransitionTimeoutPropValidator('Enter'),
    transitionLeaveTimeout: createTransitionTimeoutPropValidator('Leave'),
    overflowHidden: React.PropTypes.bool
  };

  static defaultProps = {
    transitionAppear: false,
    transitionEnter: true,
    transitionLeave: true,
    overflowHidden: true,
    component: 'span'
  };

  state = {
    currentChild: this.props.children ? React.Children.only(this.props.children) : undefined,
    currentChildKey: this.props.children ? '1' : '',
    nextChild: undefined,
    nextChildKey: '',
    height: null,
    isLeaving: false
  };

  componentDidMount() {
    if (this.props.transitionAppear && this.state.currentChild) {
      this.appearCurrent();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  componentWillReceiveProps(nextProps) {
    // Setting false indicates that the child has changed, but it is a removal so there is no next child.
    const nextChild = nextProps.children ? React.Children.only(nextProps.children) : false;
    const currentChild = this.state.currentChild;

    if (currentChild && nextChild && nextChild.key === currentChild.key) {
      // Nothing changed, but we are re-rendering so update the currentChild.
      return this.setState({
        currentChild: nextChild
      });
    }

    if (!currentChild && !nextChild && this.state.nextChild) {
      // The container was empty before and the entering element is being removed again while
      // transitioning in. Since a CSS transition can't be reversed cleanly midway the height
      // is just forced back to zero immediately and the child removed.
      return this.cancelTransition();
    }

    const { state } = this;

    // Set the next child to start the transition, and set the current height.
    this.setState({
      nextChild,
      nextChildKey: state.currentChildKey ? String(Number(state.currentChildKey) + 1) : '1',
      height: state.currentChild ? ReactDOM.findDOMNode(this.refs.curr).offsetHeight : 0
    });

    // Enqueue setting the next height to trigger the height transition.
    this.enqueueHeightTransition(nextChild);
  }

  componentDidUpdate() {
    if (!this.isTransitioning && !this.state.isLeaving) {
      const { currentChild, nextChild } = this.state;

      if (currentChild && (nextChild || nextChild === false || nextChild === null)) {
        this.leaveCurrent();
      }
      if (nextChild) {
        this.enterNext();
      }
    }
  }

  enqueueHeightTransition(nextChild, tickCount = 0) {
    this.timeout = setTimeout(() => {
      if (!nextChild) {
        return this.setState({height: 0});
      }

      const nextNode = ReactDOM.findDOMNode(this.refs.next);
      if (nextNode) {
        this.setState({height: nextNode.offsetHeight});
      }
      else {
        // The DOM hasn't rendered the entering element yet, so wait another tick.
        // Getting stuck in a loop shouldn't happen, but it's better to be safe.
        if (tickCount < 10) {
          this.enqueueHeightTransition(nextChild, tickCount + 1);
        }
      }
    }, TICK);
  }

  appearCurrent() {
    this.refs.curr.componentWillAppear(this._handleDoneAppearing);
    this.isTransitioning = true;
  }

  _handleDoneAppearing = () => {
    this.isTransitioning = false;
  }

  enterNext() {
    this.refs.next.componentWillEnter(this._handleDoneEntering);
    this.isTransitioning = true;
  }

  _handleDoneEntering = () => {
    const { state } = this;

    this.isTransitioning = false;
    this.setState({
      currentChild: state.nextChild,
      currentChildKey: state.nextChildKey,
      nextChild: undefined,
      nextChildKey: '',
      height: null
    });
  }

  leaveCurrent() {
    this.refs.curr.componentWillLeave(this._handleDoneLeaving);
    this.isTransitioning = true;
    this.setState({ isLeaving: true });
  }

  // When the leave transition time-out expires the animation classes are removed, so the
  // element must be removed from the DOM if the enter transition is still in progress.
  _handleDoneLeaving = () => {
    if (this.isTransitioning) {
      const state = {currentChild: undefined, isLeaving: false};

      if (!this.state.nextChild) {
        this.isTransitioning = false;
        state.height = null;
      }

      this.setState(state);
    }
  }

  cancelTransition() {
    this.isTransitioning = false;
    clearTimeout(this.timeout);
    return this.setState({
      nextChild: undefined,
      nextChildKey: '',
      height: null
    });
  }

  _wrapChild(child, moreProps) {
    let transitionName = this.props.transitionName;

    if (typeof transitionName == 'object' && transitionName !== null) {
      transitionName = { ...transitionName };
      delete transitionName.height;
    }

    // We need to provide this childFactory so that
    // ReactCSSTransitionReplaceChild can receive updates to name,
    // enter, and leave while it is leaving.
    return reactCSSTransitionGroupChild({
      name: transitionName,
      appear: this.props.transitionAppear,
      enter: this.props.transitionEnter,
      leave: this.props.transitionLeave,
      appearTimeout: this.props.transitionAppearTimeout,
      enterTimeout: this.props.transitionEnterTimeout,
      leaveTimeout: this.props.transitionLeaveTimeout,
      ...moreProps
    }, child);
  }

  render() {
    const { currentChild, currentChildKey, nextChild, nextChildKey, height, isLeaving } = this.state;
    const childrenToRender = [];

    const { overflowHidden, transitionName, component,
            transitionAppear, transitionEnter, transitionLeave,
            transitionAppearTimeout, transitionEnterTimeout, transitionLeaveTimeout,
            ...containerProps } = this.props;

    if (currentChild) {
      childrenToRender.push(
        React.createElement(
          'span',
          { key: currentChildKey },
          this._wrapChild(
            typeof currentChild.type == 'string' ? currentChild : React.cloneElement(currentChild, { isLeaving }),
            {ref: 'curr'})
        )
      );
    }


    if (height !== null) {
      const heightClassName = (typeof transitionName == 'object' && transitionName !== null)
        ? transitionName.height || ''
        : `${transitionName}-height`;

      containerProps.className = `${containerProps.className || ''} ${heightClassName}`;
      containerProps.style = {
        ...containerProps.style,
        position: 'relative',
        display: 'block',
        height
      };

      if (overflowHidden) {
        containerProps.style.overflow = 'hidden';
      }
    }

    if (nextChild) {
      childrenToRender.push(
        React.createElement('span',
          {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            },
            key: nextChildKey
          },
          this._wrapChild(nextChild, {ref: 'next' })
        )
      );
    }

    return React.createElement(component, containerProps, childrenToRender);
  }
}
