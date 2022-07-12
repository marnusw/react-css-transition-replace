/**
 * From react-transition-group v1.2.1
 *
 * In addition, the first animation frame is skipped when starting new transitions since
 * entering absolutely positioned elements in Chrome does not animate otherwise.
 */
import addClass from 'dom-helpers/addClass'
import removeClass from 'dom-helpers/removeClass'
import transitionEnd from 'dom-helpers/transitionEnd'
import { request as raf } from 'dom-helpers/animationFrame'
import React from 'react'
import PropTypes from 'prop-types'

import { nameShape } from './utils/PropTypes'

const events = []
if (transitionEnd) {
  events.push(transitionEnd)
}

function addEndListener(node, listener) {
  if (events.length) {
    events.forEach((e) => node.addEventListener(e, listener, false))
  } else {
    setTimeout(listener, 0)
  }

  return () => {
    if (!events.length) {
      return
    }
    events.forEach((e) => node.removeEventListener(e, listener, false))
  }
}

const propTypes = {
  children: PropTypes.node,
  name: nameShape.isRequired,

  // Once we require timeouts to be specified, we can remove the
  // boolean flags (appear etc.) and just accept a number
  // or a bool for the timeout flags (appearTimeout etc.)
  appear: PropTypes.bool,
  enter: PropTypes.bool,
  leave: PropTypes.bool,
  appearTimeout: PropTypes.number,
  enterTimeout: PropTypes.number,
  leaveTimeout: PropTypes.number,
}

class CSSTransitionGroupChild extends React.Component {
  static displayName = 'CSSTransitionGroupChild'
  refNode = React.createRef()

  constructor(props) {
    super(props)
    this.classNameAndNodeQueue = []
    this.transitionTimeouts = []
  }

  componentWillUnmount() {
    this.unmounted = true

    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.transitionTimeouts.forEach((timeout) => {
      clearTimeout(timeout)
    })

    this.classNameAndNodeQueue.length = 0
  }

  getNode() {
    return this.refNode.current
  }

  transition(animationType, finishCallback, timeout) {
    const node = this.getNode()

    if (!node) {
      if (finishCallback) {
        finishCallback()
      }
      return
    }

    const className = this.props.name[animationType] || this.props.name + '-' + animationType
    const activeClassName = this.props.name[animationType + 'Active'] || className + '-active'
    let timer = null
    let removeListeners

    addClass(node, className)

    // Need to do this to actually trigger a transition.
    this.queueClassAndNode(activeClassName, node)

    // Clean-up the animation after the specified delay
    const finish = (e) => {
      if (e && e.target !== node) {
        return
      }

      clearTimeout(timer)
      if (removeListeners) {
        removeListeners()
      }

      removeClass(node, className)
      removeClass(node, activeClassName)

      if (removeListeners) {
        removeListeners()
      }

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      if (finishCallback) {
        finishCallback()
      }
    }

    if (timeout) {
      timer = setTimeout(finish, timeout)
      this.transitionTimeouts.push(timer)
    } else if (transitionEnd) {
      removeListeners = addEndListener(node, finish)
    }
  }

  queueClassAndNode(className, node) {
    this.classNameAndNodeQueue.push({
      className,
      node,
    })

    if (!this.rafHandle) {
      // The first animation frame is skipped when starting new transitions since
      // entering absolutely positioned elements in Chrome does not animate otherwise.
      this.rafHandle = raf(() => this.flushClassNameAndNodeQueueOnNextFrame())
    }
  }

  flushClassNameAndNodeQueueOnNextFrame() {
    this.rafHandle = raf(() => this.flushClassNameAndNodeQueue())
  }

  flushClassNameAndNodeQueue() {
    if (!this.unmounted) {
      this.classNameAndNodeQueue.forEach((obj) => {
        // This is for to force a repaint,
        // which is necessary in order to transition styles when adding a class name.
        /* eslint-disable no-unused-expressions */
        obj.node.scrollTop
        /* eslint-enable no-unused-expressions */
        addClass(obj.node, obj.className)
      })
    }
    this.classNameAndNodeQueue.length = 0
    this.rafHandle = null
  }

  componentWillAppear = (done) => {
    if (this.props.appear) {
      this.transition('appear', done, this.props.appearTimeout)
    } else {
      done()
    }
  }

  componentWillEnter = (done) => {
    if (this.props.enter) {
      this.transition('enter', done, this.props.enterTimeout)
    } else {
      done()
    }
  }

  componentWillLeave = (done) => {
    if (this.props.leave) {
      this.transition('leave', done, this.props.leaveTimeout)
    } else {
      done()
    }
  }

  render() {
    const props = { ...this.props, ref: this.refNode }
    delete props.name
    delete props.appear
    delete props.enter
    delete props.leave
    delete props.appearTimeout
    delete props.enterTimeout
    delete props.leaveTimeout
    delete props.children
    return React.cloneElement(React.Children.only(this.props.children), props)
  }
}

CSSTransitionGroupChild.propTypes = propTypes

export default CSSTransitionGroupChild
