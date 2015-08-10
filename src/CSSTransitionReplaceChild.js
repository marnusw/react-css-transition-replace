/**
 * Adapted from ReactCSSTransitionGroupChild.js by Facebook
 *
 * @providesModule CSSTransitionReplaceChild
 */

import React from 'react';
import ReactTransitionEvents from 'react/lib/ReactTransitionEvents';

// We don't remove the element from the DOM until we receive an animationend or
// transitionend event. If the user screws up and forgets to add an animation
// their node will be stuck in the DOM forever, so we detect if an animation
// does not start and if it doesn't, we just call the end listener immediately.
const TICK = 17;
const NO_EVENT_TIMEOUT = 5000;

let noEventListener = null;


if ('production' !== process.env.NODE_ENV) {
  noEventListener = function() {
    (process.env.NODE_ENV !== 'production' ? console.warn(
      'transition(): tried to perform an animation without ' +
      'an animationend or transitionend event after timeout (' +
      NO_EVENT_TIMEOUT +
      'ms). You should either disable this ' +
      'transition in JS or add a CSS animation/transition.'
    ) : null);
  };
}

class CSSTransitionReplaceChild extends React.Component {

  constructor(props) {
    super(props);
    this.flushClassNameQueue = this.flushClassNameQueue.bind(this);
  }

  transition(animationType, finishCallback) {
    let node = React.findDOMNode(this);
    let className = this.props.name + '-' + animationType;
    let activeClassName = className + '-active';
    let noEventTimeout = null;

    let endListener = function(e) {
      if (e && e.target !== node) {
        return;
      }
      if ('production' !== process.env.NODE_ENV) {
        clearTimeout(noEventTimeout);
      }

      node.classList.remove(className);
      node.classList.remove(activeClassName);

      ReactTransitionEvents.removeEndEventListener(node, endListener);

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      if (finishCallback) {
        finishCallback();
      }
    };

    ReactTransitionEvents.addEndEventListener(node, endListener);

    node.classList.add(className);

    // Need to do this to actually trigger a transition.
    this.queueClass(activeClassName);

    if ('production' !== process.env.NODE_ENV) {
      noEventTimeout = setTimeout(noEventListener, NO_EVENT_TIMEOUT);
    }
  }

  queueClass(className) {
    this.classNameQueue.push(className);

    if (!this.timeout) {
      this.timeout = setTimeout(this.flushClassNameQueue, TICK);
    }
  }

  flushClassNameQueue() {
    if (this._mounted) {
      this.classNameQueue.forEach(className => React.findDOMNode(this).classList.add(className));
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
    this.props.appear ? this.transition('appear', done) : done();
  }

  componentWillEnter(done) {
    this.props.enter ? this.transition('enter', done) : done();
  }

  componentWillLeave(done) {
    this.props.leave ? this.transition('leave', done) : done();
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

export default CSSTransitionReplaceChild;
