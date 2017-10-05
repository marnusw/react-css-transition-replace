/**
 * Adapted from ReactCSSTransitionGroup.js by Facebook
 *
 * @providesModule ReactCSSTransitionReplace
 */

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import ReactCSSTransitionGroupChild from 'react-transition-group/CSSTransitionGroupChild'

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
      }
      else if (typeof props[timeoutPropName] != 'number') {
        return new Error(timeoutPropName + ' must be a number (in milliseconds)')
      }
    }
  }
}

export default class ReactCSSTransitionReplace extends React.Component {

  static displayName = 'ReactCSSTransitionReplace'

  static propTypes = {
    transitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
      enter: PropTypes.string,
      leave: PropTypes.string,
      active: PropTypes.string,
      height: PropTypes.string,
    }), PropTypes.shape({
      enter: PropTypes.string,
      enterActive: PropTypes.string,
      leave: PropTypes.string,
      leaveActive: PropTypes.string,
      appear: PropTypes.string,
      appearActive: PropTypes.string,
      height: PropTypes.string,
    })]).isRequired,

    transitionAppear: PropTypes.bool,
    transitionEnter: PropTypes.bool,
    transitionLeave: PropTypes.bool,
    transitionAppearTimeout: createTransitionTimeoutPropValidator('Appear'),
    transitionEnterTimeout: createTransitionTimeoutPropValidator('Enter'),
    transitionLeaveTimeout: createTransitionTimeoutPropValidator('Leave'),
    overflowHidden: PropTypes.bool,
    changeWidth: PropTypes.bool,
  }

  static defaultProps = {
    transitionAppear: false,
    transitionEnter: true,
    transitionLeave: true,
    overflowHidden: true,
    component: 'span',
    changeWidth: false,
  }

  state = {
    currentChild: this.props.children ? React.Children.only(this.props.children) : undefined,
    currentChildKey: this.props.children ? '1' : '',
    nextChild: undefined,
    activeHeightTransition: false,
    nextChildKey: '',
    height: null,
    width: null,
    isLeaving: false,
  }

  componentDidMount() {
    if (this.props.transitionAppear && this.state.currentChild) {
      this.appearCurrent()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  componentWillReceiveProps(nextProps) {
    // Setting false indicates that the child has changed, but it is a removal so there is no next child.
    const nextChild = nextProps.children ? React.Children.only(nextProps.children) : false
    const currentChild = this.state.currentChild

    // Avoid silencing the transition when this.state.nextChild exists because it means that there’s
    // already a transition ongoing that has to be replaced.
    if (currentChild && nextChild && nextChild.key === currentChild.key && !this.state.nextChild) {
      // Nothing changed, but we are re-rendering so update the currentChild.
      return this.setState({
        currentChild: nextChild,
      })
    }

    if (!currentChild && !nextChild && this.state.nextChild) {
      // The container was empty before and the entering element is being removed again while
      // transitioning in. Since a CSS transition can't be reversed cleanly midway the height
      // is just forced back to zero immediately and the child removed.
      return this.cancelTransition()
    }

    const {state} = this

    // When transitionLeave is set to false, refs.curr does not exist when refs.next is being
    // transitioned into existence. When another child is set for this component at the point
    // where only refs.next exists, we want to use the width/height of refs.next instead of
    // refs.curr.
    const ref = this.curr || this.next

    // Set the next child to start the transition, and set the current height.
    this.setState({
      nextChild,
      activeHeightTransition: false,
      nextChildKey: state.currentChildKey ? String(Number(state.currentChildKey) + 1) : '1',
      height: state.currentChild ? ReactDOM.findDOMNode(ref).offsetHeight : 0,
      width: state.currentChild && this.props.changeWidth ? ReactDOM.findDOMNode(ref).offsetWidth : null,
    })

    // Enqueue setting the next height to trigger the height transition.
    this.enqueueHeightTransition(nextChild)
  }

  componentDidUpdate() {
    if (!this.isTransitioning && !this.state.isLeaving) {
      const {currentChild, nextChild} = this.state

      if (currentChild && (nextChild || nextChild === false || nextChild === null) && this.props.transitionLeave) {
        this.leaveCurrent()
      }
      if (nextChild) {
        this.enterNext()
      }
    }
  }

  enqueueHeightTransition(nextChild, tickCount = 0) {
    this.timeout = setTimeout(() => {
      if (!nextChild) {
        return this.setState({
          activeHeightTransition: true,
          height: 0,
          width: this.props.changeWidth ? 0 : null,
        })
      }

      const nextNode = ReactDOM.findDOMNode(this.next)
      if (nextNode) {
        this.setState({
          activeHeightTransition: true,
          height: nextNode.offsetHeight,
          width: this.props.changeWidth ? nextNode.offsetWidth : null,
        })
      }
      else {
        // The DOM hasn't rendered the entering element yet, so wait another tick.
        // Getting stuck in a loop shouldn't happen, but it's better to be safe.
        if (tickCount < 10) {
          this.enqueueHeightTransition(nextChild, tickCount + 1)
        }
      }
    }, TICK)
  }

  appearCurrent() {
    this.curr.componentWillAppear(this._handleDoneAppearing)
    this.isTransitioning = true
  }

  _handleDoneAppearing = () => {
    this.isTransitioning = false
  }

  enterNext() {
    this.next.componentWillEnter(this._handleDoneEntering)
    this.isTransitioning = true
  }

  _handleDoneEntering = () => {
    const {state} = this

    this.isTransitioning = false
    this.setState({
      currentChild: state.nextChild,
      currentChildKey: state.nextChildKey,
      activeHeightTransition: false,
      nextChild: undefined,
      nextChildKey: '',
      height: null,
      width: null,
    })
  }

  leaveCurrent() {
    this.curr.componentWillLeave(this._handleDoneLeaving)
    this.isTransitioning = true
    this.setState({isLeaving: true})
  }

  // When the leave transition time-out expires the animation classes are removed, so the
  // element must be removed from the DOM if the enter transition is still in progress.
  _handleDoneLeaving = () => {
    if (this.isTransitioning) {
      const state = {currentChild: undefined, isLeaving: false}

      if (!this.state.nextChild) {
        this.isTransitioning = false
        state.height = null
        state.width = null
      }

      this.setState(state)
    }
  }

  cancelTransition() {
    this.isTransitioning = false
    clearTimeout(this.timeout)
    return this.setState({
      nextChild: undefined,
      activeHeightTransition: false,
      nextChildKey: '',
      height: null,
      width: null,
    })
  }

  _wrapChild(child, moreProps) {
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

  setCurrRef = (ref) => {
    this.curr = ref
  }

  setNextRef = (ref) => {
    this.next = ref
  }

  render() {
    const {currentChild, currentChildKey, nextChild, nextChildKey, height, width, isLeaving, activeHeightTransition} = this.state
    const childrenToRender = []

    const {
      overflowHidden, transitionName, changeWidth, component,
      transitionAppear, transitionEnter, transitionLeave,
      transitionAppearTimeout, transitionEnterTimeout, transitionLeaveTimeout,
      ...containerProps
    } = this.props

    if (currentChild && !nextChild && !transitionLeave || currentChild && transitionLeave) {
      childrenToRender.push(
        React.createElement(
          'span',
          {key: currentChildKey},
          this._wrapChild(
            typeof currentChild.type == 'string' ? currentChild : React.cloneElement(currentChild, {isLeaving}),
            {ref: this.setCurrRef})
        )
      )
    }


    if (height !== null) {
      const heightClassName = (typeof transitionName == 'object' && transitionName !== null)
        ? transitionName.height || ''
        : `${transitionName}-height`

      // Similarly to ReactCSSTransitionGroup, adding `-height-active` suffix to the
      // container when we are transitioning height.
      const activeHeightClassName = (nextChild && activeHeightTransition && heightClassName)
        ? `${heightClassName}-active`
        : ''

      containerProps.className = `${containerProps.className || ''} ${heightClassName} ${activeHeightClassName}`

      containerProps.style = {
        ...containerProps.style,
        position: 'relative',
        display: 'block',
        height,
      }

      if (overflowHidden) {
        containerProps.style.overflow = 'hidden'
      }

      if (changeWidth) {
        containerProps.style.width = width
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
              bottom: 0,
            },
            key: nextChildKey,
          },
          this._wrapChild(nextChild, {ref: this.setNextRef})
        )
      )
    }

    return React.createElement(component, containerProps, childrenToRender)
  }
}
