import React from 'react'
import ReactCSSTransitionReplace from '../../src/ReactCSSTransitionReplace.jsx'


class ContentSwapper extends React.Component {

  state = {index: 0}

  handleClick = () => {
    const index = this.state.index + 1
    this.setState({index: index >= React.Children.count(this.props.children) ? 0 : index})
  }

  render() {
    const content = React.Children.toArray(this.props.children)
    const {style = {}} = this.props

    style.cursor = 'pointer'

    return (
      <ReactCSSTransitionReplace {...this.props} style={style} onClick={this.handleClick}>
        {content[this.state.index]}
      </ReactCSSTransitionReplace>
    )
  }
}

export default ContentSwapper
