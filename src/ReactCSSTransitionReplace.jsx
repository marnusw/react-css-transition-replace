/**
 * Adapted from ReactCSSTransitionGroup.js by Facebook
 *
 * @providesModule ReactCSSTransitionReplace
 */

import React from 'react'
import ReactDOM from 'react-dom'

import ReactCSSTransitionGroupChild from 'react/lib/ReactCSSTransitionGroupChild'

const reactCSSTransitionGroupChild = React.createFactory(ReactCSSTransitionGroupChild)

const TICK = 17


function createTransitionTimeoutPropValidator(transitionType) {
  const timeoutPropName = 'transition' + transitionType + 'Timeout'
  const enabledPropName = 'transition' + transitionType

  return function(props) {
    // If the transition is enabled
    if (props[enabledPropName]) {
      // If no timeout duration is provided
      if (!props[timeoutPropName]) {
        return new Error(timeoutPropName + ' wasn\'t supplied to ReactCSSTransitionReplace: '
          + 'this can cause unreliable animations and won\'t be supported in '
          + 'a future version of React. See '
          + 'https://fb.me/react-animation-transition-group-timeout for more ' + 'information.')

        // If the duration isn't a number
      } else if (typeof props[timeoutPropName] != 'number') {
        return new Error(timeoutPropName + ' must be a number (in milliseconds)')
      }
    }
  }
}

export default class ReactCSSTransitionReplace extends React.Component {

  static displayName = 'ReactCSSTransitionReplace'

  static propTypes = {
    transitionName: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.shape({
      enter: React.PropTypes.string,
      leave: React.PropTypes.string,
      active: React.PropTypes.string,
      height: React.PropTypes.string,
    }), React.PropTypes.shape({
      enter: React.PropTypes.string,
      enterActive: React.PropTypes.string,
      leave: React.PropTypes.string,
      leaveActive: React.PropTypes.string,
      appear: React.PropTypes.string,
      appearActive: React.PropTypes.string,
      height: React.PropTypes.string,
    })]).isRequired,

    transitionAppear: React.PropTypes.bool,
    transitionEnter: React.PropTypes.bool,
    transitionLeave: React.PropTypes.bool,
    transitionAppearTimeout: createTransitionTimeoutPropValidator('Appear'),
    transitionEnterTimeout: createTransitionTimeoutPropValidator('Enter'),
    transitionLeaveTimeout: createTransitionTimeoutPropValidator('Leave'),
    overflowHidden: React.PropTypes.bool,
  }

  static defaultProps = {
    transitionAppear: false,
    transitionEnter: true,
    transitionLeave: true,
    overflowHidden: true,
    component: 'span',
    childComponent: 'span',
  }

  state = {
    currentKey: '1',
    currentChild: this.props.children ? React.Children.only(this.props.children) : undefined,
    prevChildren: {},
    height: null,
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
    const nextChild = nextProps.children ? React.Children.only(nextProps.children) : null
    const {currentChild} = this.state

    if ((!currentChild && !nextChild) || (currentChild && nextChild && currentChild.key === nextChild.key)) {
      return
    }

    const {state} = this
    const {currentKey} = state

    const nextState = {
      currentKey: String(Number(currentKey) + 1),
      currentChild: nextChild,
      height: 0,
    }

    if (nextChild) {
      this.shouldEnterCurrent = true
    }

    if (currentChild) {
      nextState.height = ReactDOM.findDOMNode(this.refs[currentKey]).offsetHeight
      nextState.prevChildren = {
        ...state.prevChildren,
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
    this.refs[key].componentWillAppear(this.handleDoneAppearing.bind(this, key))
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
    this.refs[key].componentWillEnter(this.handleDoneEntering.bind(this, key))
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
    this.refs[key].componentWillLeave(this.handleDoneLeaving.bind(this, key))
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
      this.setState({height: ReactDOM.findDOMNode(this.refs[state.currentKey]).offsetHeight})
    }, TICK)
  }

  wrapChild(child, moreProps) {
    let transitionName = this.props.transitionName

    if (typeof transitionName == 'object' && transitionName !== null) {
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
      overflowHidden, transitionName, component, childComponent,
      transitionAppear, transitionEnter, transitionLeave,
      transitionAppearTimeout, transitionEnterTimeout, transitionLeaveTimeout,
      ...containerProps
    } = this.props

    if (height !== null) {
      const heightClassName = (typeof transitionName == 'object' && transitionName !== null)
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
            typeof prevChildren[key].type == 'string'
              ? prevChildren[key]
              : React.cloneElement(prevChildren[key], {isLeaving: true}),
            {ref: key})
        )
      )
    })

    if (currentChild) {
      childrenToRender.push(
        React.createElement(childComponent,
          {key: currentKey},
          this.wrapChild(currentChild, {ref: currentKey})
        )
      )
    }

    return React.createElement(component, containerProps, childrenToRender)
  }
}
