import React from 'react'
import ReactCSSTransitionReplace from 'react-css-transition-replace'

class ChangeChildProps extends React.Component {
  state = {
    text: 'one',
    key: 1,
  }

  handleToggleText = () => {
    this.setState(state => ({
      text: this.getToggledText(state),
    }))
  }

  handleAnimate = () => {
    this.setState(state => ({
      text: this.getToggledText(state),
      key: state.key + 1,
    }))
  }

  getToggledText(state) {
    return state.text === 'one' ? 'two' : 'one'
  }

  render() {
    return (
      <div style={{ cursor: 'pointer' }}>
        <a onClick={this.handleAnimate}>Click to animate</a>
        {' | '}
        <a onClick={this.handleToggleText}>Change child props</a>
        <br />
        <br />
        <ReactCSSTransitionReplace {...this.props}>
          <p key={this.state.key}>{this.state.text}</p>
        </ReactCSSTransitionReplace>
      </div>
    )
  }
}

export default ChangeChildProps
