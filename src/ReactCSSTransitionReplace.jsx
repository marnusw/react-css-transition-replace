/**
 * Adapted from ReactCSSTransitionGroup.js by Facebook
 *
 * @providesModule ReactCSSTransitionReplace
 */

import React from 'react';
import ReactDOM from 'react-dom';
import objectAssign from 'object-assign';

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
      else if (typeof props[timeoutPropName] !== 'number') {
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
      active: React.PropTypes.string
    }), React.PropTypes.shape({
      enter: React.PropTypes.string,
      enterActive: React.PropTypes.string,
      leave: React.PropTypes.string,
      leaveActive: React.PropTypes.string,
      appear: React.PropTypes.string,
      appearActive: React.PropTypes.string
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
    currentChild: this.props.children ? React.Children.only(this.props.children) : null,
    nextChild: null,
    height: null
  };

  componentDidMount() {
    if (this.props.transitionAppear && this.state.currentChild) {
      this.appearCurrent();
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
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

    // Set the next child to start the transition, and set the current height.
    this.setState({
      nextChild,
      height: this.state.currentChild ? ReactDOM.findDOMNode(this.refs.curr).offsetHeight : 0
    });

    // Enqueue setting the next height to trigger the height transition.
    this.timeout = setTimeout(() => {
      this.setState({height: this.state.nextChild ? ReactDOM.findDOMNode(this.refs.next).offsetHeight : 0});
      this.timeout = null;
    }, TICK);
  }

  componentDidUpdate() {
    if (!this.isTransitioning) {
      if (this.state.nextChild) {
        this.enterNext();
      }
      if (this.state.currentChild && (this.state.nextChild || this.state.nextChild === false)) {
        this.leaveCurrent();
      }
    }
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
    this.isTransitioning = false;
    this.setState({
      currentChild: this.state.nextChild,
      nextChild: null,
      height: null
    });
  }

  leaveCurrent() {
    this.refs.curr.componentWillLeave(this._handleDoneLeaving);
    this.isTransitioning = true;
  }

  // When the leave transition time-out expires the animation classes are removed, so the
  // element must be removed from the DOM if the enter transition is still in progress.
  _handleDoneLeaving = () => {
    if (this.isTransitioning) {
      const state = {currentChild: null};

      if (!this.state.nextChild) {
        this.isTransitioning = false;
        state.height = null;
      }

      this.setState(state);
    }
  }

  _wrapChild(child, moreProps) {
    // We need to provide this childFactory so that
    // ReactCSSTransitionReplaceChild can receive updates to name,
    // enter, and leave while it is leaving.
    return reactCSSTransitionGroupChild(objectAssign({
      name: this.props.transitionName,
      appear: this.props.transitionAppear,
      enter: this.props.transitionEnter,
      leave: this.props.transitionLeave,
      appearTimeout: this.props.transitionAppearTimeout,
      enterTimeout: this.props.transitionEnterTimeout,
      leaveTimeout: this.props.transitionLeaveTimeout
    }, moreProps), child);
  }

  render() {
    const { currentChild, nextChild, height } = this.state;
    const childrenToRender = [];

    const {
      overflowHidden,
      transitionName,
      transitionEnterTimeout,
      transitionLeaveTimeout,
      transitionAppear,
      transitionEnter,
      transitionLeave,
      component,
      ...containerProps
    } = this.props;

    if (currentChild) {
      childrenToRender.push(this._wrapChild(currentChild, {
        ref: 'curr', key: 'curr'
      }));
    }

    if (height !== null) {
      containerProps.className = `${containerProps.className || ''} ${containerProps.transitionName}-height`;
      containerProps.style = objectAssign({}, containerProps.style, {
        position: 'relative',
        display: 'block',
        height
      });

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
            key: 'next'
          },
          this._wrapChild(nextChild, {ref: 'next'})
        )
      );
    }

    return React.createElement(this.props.component, containerProps, childrenToRender);
  }
}
