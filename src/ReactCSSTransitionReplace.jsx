/**
 * Adapted from ReactCSSTransitionGroup.js by Facebook
 *
 * @providesModule ReactReactCSSTransitionReplace
 */

import React from 'react';
import ReactDOM from 'react-dom';
import objectAssign from 'react/lib/Object.assign';
import ReactTransitionGroup from 'react-addons-transition-group';

import ReplaceChildComponent from './ReactCSSTransitionReplaceChild';

const reactCSSTransitionReplaceChild = React.createFactory(ReplaceChildComponent);

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

  static propTypes = {
    transitionName: React.PropTypes.string.isRequired,
    transitionAppear: React.PropTypes.bool,
    transitionEnter: React.PropTypes.bool,
    transitionLeave: React.PropTypes.bool,
    transitionHeight: React.PropTypes.bool,
    transitionAppearTimeout: createTransitionTimeoutPropValidator('Appear'),
    transitionEnterTimeout: createTransitionTimeoutPropValidator('Enter'),
    transitionLeaveTimeout: createTransitionTimeoutPropValidator('Leave')
  };

  static defaultProps = {
    transitionAppear: false,
    transitionEnter: true,
    transitionLeave: true,
    transitionHeight: true
  };

  state = {
    currentChild: React.Children.only(this.props.children),
    nextChild: null,
    height: 'auto'
  };

  componentWillReceiveProps(nextProps) {
    const nextChild = nextProps.children ? React.Children.only(nextProps.children) : null;
    const currentChild = this.state.currentChild;

    if (currentChild && nextChild && nextChild.key === currentChild.key) {
      // Nothing changed, but we are re-rendering so update the currentChild.
      return this.setState({
        currentChild: nextChild
      });
    }

    const transitionHeight = nextProps.transitionHeight;
    const currentHeight = transitionHeight ? ReactDOM.findDOMNode(this.refs.container).offsetHeight : 'auto';

    // The child was removed, so animate out.
    if (!nextChild) {
      return this.setState({
        height: currentHeight,
        currentChild: null
      }, () => transitionHeight && this.setState({height: 0}));
    }

    // The child was replaced or added, setting a nextChild will eventually animate it in.
    this.setState({
      height: currentHeight,
      currentChild: null,
      nextChild
    });
  }

  componentDidUpdate() {
    const nextChild = this.refs.nextChild;

    // If there is a next child we'll be animating it in soon, so change to its height.
    if (nextChild && nextChild.offsetHeight !== this.state.height) {
      this.setState({
        height: nextChild.offsetHeight
      });
    }
  }

  _childLeft = () => {
    // Swap the children after the current child left.
    this.setState({
      currentChild: this.state.nextChild,
      nextChild: null
    });
  }

  _childEntered = () => {
    // The height animation would have finished, so switch back to auto.
    if (this.props.transitionHeight) {
      this.setState({
        height: 'auto'
      });
    }
  }

  _wrapChild = (child) => {
    // We need to provide this childFactory so that
    // ReactCSSTransitionReplaceChild can receive updates to name,
    // enter, and leave while it is leaving.
    return reactCSSTransitionReplaceChild({
      name: this.props.transitionName,
      appear: this.props.transitionAppear,
      enter: this.props.transitionEnter,
      leave: this.props.transitionLeave,
      appearTimeout: this.props.transitionAppearTimeout,
      enterTimeout: this.props.transitionEnterTimeout,
      leaveTimeout: this.props.transitionLeaveTimeout,
      onEntered: this._childEntered,
      onLeft: this._childLeft
    }, child);
  }

  render() {
    let { style, className = '' } = this.props;
    let nextChildShadow;

    if (this.props.transitionHeight) {
      if (this.state.nextChild) {
        nextChildShadow = (
          <div ref="nextChild" style={{position: 'absolute', visibility: 'hidden'}}>
            {this.state.nextChild}
          </div>
        );
      }

      const animatingHeight = this.state.height !== 'auto';

      if (animatingHeight) {
        className = `${className} ${this.props.transitionName}-height`;
      }

      style = objectAssign(style || {}, {
        overflow: animatingHeight ? 'hidden' : 'visible',
        height: this.state.height,
        display: 'block'
      });
    }

    return (
      <span>
        {nextChildShadow}
        <ReactTransitionGroup ref="container" {...this.props} childFactory={this._wrapChild}
                              style={style} className={className}>
          {this.state.currentChild}
        </ReactTransitionGroup>
      </span>
    );
  }
}
