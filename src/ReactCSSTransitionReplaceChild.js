/**
 * Adapted from ReactCSSTransitionGroupChild.js by Facebook
 *
 * @providesModule ReactCSSTransitionReplaceChild
 */

import React from 'react';
import ReactDOM from 'react-dom';

import CSSCore from 'react/node_modules/fbjs/lib/CSSCore';
import ReactTransitionEvents from 'react/lib/ReactTransitionEvents';

// We don't remove the element from the DOM until we receive an animationend or
// transitionend event. If the user screws up and forgets to add an animation
// their node will be stuck in the DOM forever, so we detect if an animation
// does not start and if it doesn't, we just call the end listener immediately.
const TICK = 17;

export default class ReactCSSTransitionReplaceChild extends React.Component {

  static propTypes = {
    name: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.shape({
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

    // Once we require timeouts to be specified, we can remove the
    // boolean flags (appear etc.) and just accept a number
    // or a bool for the timeout flags (appearTimeout etc.)
    appear: React.PropTypes.bool,
    enter: React.PropTypes.bool,
    leave: React.PropTypes.bool,
    appearTimeout: React.PropTypes.number,
    enterTimeout: React.PropTypes.number,
    leaveTimeout: React.PropTypes.number
  };

  transition(animationType, finishCallback, userSpecifiedDelay) {
    const node = ReactDOM.findDOMNode(this);

    if (!node) {
      if (finishCallback) {
        finishCallback();
      }
      return;
    }

    const className = this.props.name[animationType] || this.props.name + '-' + animationType;
    const activeClassName = this.props.name[animationType + 'Active'] || className + '-active';
    let timeout = null;

    const endListener = function(e) {
      if (e && e.target !== node) {
        return;
      }

      clearTimeout(timeout);

      CSSCore.removeClass(node, className);
      CSSCore.removeClass(node, activeClassName);

      ReactTransitionEvents.removeEndEventListener(node, endListener);

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      if (finishCallback) {
        finishCallback();
      }
    };

    CSSCore.addClass(node, className);

    // Need to do this to actually trigger a transition.
    this.queueClass(activeClassName);

    // If the user specified a timeout delay.
    if (userSpecifiedDelay) {
      // Clean-up the animation after the specified delay
      timeout = setTimeout(endListener, userSpecifiedDelay);
    }
    else {
      // DEPRECATED: this listener will be removed in a future version of react
      ReactTransitionEvents.addEndEventListener(node, endListener);
    }
  }

  queueClass(className) {
    this.classNameQueue.push(className);

    if (!this.timeout) {
      this.timeout = setTimeout(this.flushClassNameQueue, TICK);
    }
  }

  flushClassNameQueue = () => {
    if (this._mounted) {
      this.classNameQueue.forEach(className => CSSCore.addClass(ReactDOM.findDOMNode(this), className));
    }
    this.classNameQueue.length = 0;
    this.timeout = null;
  }

  componentWillMount() {
    this.classNameQueue = [];
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    delete this._mounted;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentWillAppear(done) {
    if (this.props.appear) {
      this.transition('appear', done, this.props.appearTimeout);
    }
    else {
      done();
    }
  }

  componentWillEnter(done) {
    if (this.props.enter) {
      this.transition('enter', done, this.props.enterTimeout);
    }
    else {
      done();
    }
  }

  componentWillLeave(done) {
    if (this.props.leave) {
      this.transition('leave', done, this.props.leaveTimeout);
    }
    else {
      done();
    }
  }

  componentDidEnter() {
    this.props.onEntered();
  }

  componentDidLeave() {
    this.props.onLeft();
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
