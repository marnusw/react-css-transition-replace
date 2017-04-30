/**
 * Uses react-transition-group/CSSTransitionGroupChild with the exception that
 * the first animation frame is skipped when starting new transitions since
 * entering absolutely positioned elements in Chrome does not animate otherwise.
 */
import ReactCSSTransitionReplaceChild from 'react-transition-group/CSSTransitionGroupChild'
import raf from 'dom-helpers/util/requestAnimationFrame'


ReactCSSTransitionReplaceChild.prototype.queueClassAndNode = function queueClassAndNode(className, node) {
  const _this2 = this

  this.classNameAndNodeQueue.push({
    className: className,
    node: node,
  })

  if (!this.rafHandle) {
    this.rafHandle = raf(function() {
      return _this2.flushClassNameAndNodeQueueOnNextFrame()
    })
  }
}

// In Chrome the absolutely positioned children would not animate on enter
// if the immediate animation frame is used so this skips to the next one.
ReactCSSTransitionReplaceChild.prototype.flushClassNameAndNodeQueueOnNextFrame = function flushClassNameAndNodeQueueOnNextFrame() {
  const _this2 = this

  this.rafHandle = raf(function() {
    return _this2.flushClassNameAndNodeQueue()
  })
}

export default ReactCSSTransitionReplaceChild
