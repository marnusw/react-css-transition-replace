/**
 * Adapted from ReactCSSTransitionGroup.js by Facebook
 *
 * @providesModule ReactCSSTransitionReplace
 */

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import chain from 'chain-function'
import warning from 'warning'

import ReactCSSTransitionGroupChild from 'react-transition-group/CSSTransitionGroupChild'
import { nameShape, transitionTimeout } from 'react-transition-group/utils/PropTypes'


const reactCSSTransitionGroupChild = React.createFactory(ReactCSSTransitionGroupChild)

const TICK = 17


// Filter out nulls before looking for an only child
function getChildMapping(children) {
  if (!Array.isArray(children)) {
    return children
  }
  const childArray = React.Children.toArray(children).filter(c => c)
  return childArray.length === 1 ? childArray[0] : React.Children.only(childArray)
}


export default class ReactCSSTransitionReplace extends React.Component {

  static displayName = 'ReactCSSTransitionReplace'

  static propTypes = {
    transitionName: nameShape.isRequired,

    transitionAppear: PropTypes.bool,
    transitionEnter: PropTypes.bool,
    transitionLeave: PropTypes.bool,
    transitionAppearTimeout: transitionTimeout('Appear'),
    transitionEnterTimeout: transitionTimeout('Enter'),
    transitionLeaveTimeout: transitionTimeout('Leave'),
    overflowHidden: PropTypes.bool,
    notifyLeaving: PropTypes.bool,
  }

  static defaultProps = {
    transitionAppear: false,
    transitionEnter: true,
    transitionLeave: true,
    overflowHidden: true,
    notifyLeaving: false,
    component: 'span',
    childComponent: 'span',
  }

  constructor(props, context) {
    super(props, context)

    this.childRefs = Object.create(null)

    this.state = {
      currentKey: '1',
      currentChild: getChildMapping(this.props.children),
      prevChildren: {},
      height: null,
    }
  }

  componentWillMount() {
    this.shouldEnterCurrent = false
    this.keysToLeave = []
    this.transitioningKeys = {}
  }

  componentDidMount() {
    if (this.props.transitionAppear && this.state.currentChild) {
      this.performAppear(this.state.currentKey)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  componentWillReceiveProps(nextProps) {
    const nextChild = getChildMapping(nextProps.children)
    const {currentChild} = this.state

    if ((!currentChild && !nextChild) || (currentChild && nextChild && currentChild.key === nextChild.key)) {
      return
    }

    const {currentKey, prevChildren} = this.state

    const nextState = {
      currentKey: String(Number(currentKey) + 1),
      currentChild: nextChild,
      height: 0,
    }

    if (nextChild) {
      this.shouldEnterCurrent = true
    }

    if (currentChild) {
      nextState.height = ReactDOM.findDOMNode(this.childRefs[currentKey]).offsetHeight
      nextState.prevChildren = {
        ...prevChildren,
        [currentKey]: currentChild,
      }
      if (!this.transitioningKeys[currentKey]) {
        this.keysToLeave.push(currentKey)
      }
    }

    this.setState(nextState)
  }

  componentDidUpdate() {
    if (this.shouldEnterCurrent) {
      this.shouldEnterCurrent = false
      this.performEnter(this.state.currentKey)
    }

    const keysToLeave = this.keysToLeave
    this.keysToLeave = []
    keysToLeave.forEach(this.performLeave)
  }

  performAppear(key) {
    this.transitioningKeys[key] = true
    this.childRefs[key].componentWillAppear(this.handleDoneAppearing.bind(this, key))
  }

  handleDoneAppearing = (key) => {
    delete this.transitioningKeys[key]
    if (key !== this.state.currentKey) {
      // This child was removed before it had fully appeared. Remove it.
      this.performLeave(key)
    }
  }

  performEnter(key) {
    this.transitioningKeys[key] = true
    this.childRefs[key].componentWillEnter(this.handleDoneEntering.bind(this, key))
    this.enqueueHeightTransition()
  }

  handleDoneEntering(key) {
    delete this.transitioningKeys[key]
    if (key === this.state.currentKey) {
      // The current child has finished entering so the height transition is also cleared.
      this.setState({height: null})
    } else {
      // This child was removed before it had fully appeared. Remove it.
      this.performLeave(key)
    }
  }

  performLeave = (key) => {
    this.transitioningKeys[key] = true
    this.childRefs[key].componentWillLeave(this.handleDoneLeaving.bind(this, key))
    if (!this.state.currentChild) {
      // The enter transition dominates, but if there is no
      // entering component the height is set to zero.
      this.enqueueHeightTransition()
    }
  }

  handleDoneLeaving(key) {
    delete this.transitioningKeys[key]

    const nextState = {prevChildren: {...this.state.prevChildren}}
    delete nextState.prevChildren[key]
    delete this.childRefs[key]

    if (!this.state.currentChild) {
      nextState.height = null
    }

    this.setState(nextState)
  }

  enqueueHeightTransition() {
    const {state} = this
    this.timeout = setTimeout(() => {
      if (!state.currentChild) {
        return this.setState({height: 0})
      }
      this.setState({height: ReactDOM.findDOMNode(this.childRefs[state.currentKey]).offsetHeight})
    }, TICK)
  }

  wrapChild(child, moreProps) {
    let transitionName = this.props.transitionName

    if (typeof transitionName === 'object' && transitionName !== null) {
      transitionName = {...transitionName}
      delete transitionName.height
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
      ...moreProps,
    }, child)
  }

  render() {
    const {currentKey, currentChild, prevChildren, height} = this.state
    const childrenToRender = []

    const {
      overflowHidden, transitionName, component, childComponent, notifyLeaving,
      transitionAppear, transitionEnter, transitionLeave,
      transitionAppearTimeout, transitionEnterTimeout, transitionLeaveTimeout,
      ...containerProps
    } = this.props

    if (height !== null) {
      const heightClassName = (typeof transitionName === 'object' && transitionName !== null)
        ? transitionName.height || ''
        : `${transitionName}-height`

      containerProps.className = `${containerProps.className || ''} ${heightClassName}`
      containerProps.style = {
        ...containerProps.style,
        position: 'relative',
        display: 'block',
        height,
      }

      if (overflowHidden) {
        containerProps.style.overflow = 'hidden'
      }
    }

    Object.keys(prevChildren).forEach(key => {
      const child = prevChildren[key]
      const isCallbackRef = typeof child.ref !== 'string'
      warning(isCallbackRef,
        'string refs are not supported on children of ReactCSSTransitionReplace and will be ignored. ' +
        'Please use a callback ref instead: https://facebook.github.io/react/docs/refs-and-the-dom.html#the-ref-callback-attribute')

      childrenToRender.push(
        React.createElement(childComponent,
          {
            key,
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
          },
          this.wrapChild(
            notifyLeaving && typeof child.type !== 'string'
              ? React.cloneElement(child, {isLeaving: true})
              : child,
            {
              ref: chain(
                isCallbackRef ? child.ref : null,
                (r) => {this.childRefs[key] = r}
              ),
            }
          )
        )
      )
    })

    if (currentChild) {
      const isCallbackRef = typeof currentChild.ref !== 'string'
      warning(isCallbackRef,
        'string refs are not supported on children of ReactCSSTransitionReplace and will be ignored. ' +
        'Please use a callback ref instead: https://facebook.github.io/react/docs/refs-and-the-dom.html#the-ref-callback-attribute')

      childrenToRender.push(
        React.createElement(childComponent,
          {key: currentKey},
          this.wrapChild(
            currentChild,
            {
              ref: chain(
                isCallbackRef ? currentChild.ref : null,
                (r) => {this.childRefs[currentKey] = r}
              ),
            }
          )
        )
      )
    }

    return React.createElement(component, containerProps, childrenToRender)
  }
}
