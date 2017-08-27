import React from 'react'
import ReactCSSTransitionReplace from '../../src/ReactCSSTransitionReplace.jsx'


class ContentAddRemove extends React.Component {

  state = {added: false}

  handleClick = () => {
    this.setState({added: !this.state.added})
  }

  render() {
    const {style = {}} = this.props

    style.cursor = 'pointer'

    return (
      <div style={style} onClick={this.handleClick}>
        <a>Click to {this.state.added ? 'remove' : 'add'} content</a><br/>
        <br/>
        <ReactCSSTransitionReplace {...this.props}>
          {this.state.added ? this.props.children : null}
        </ReactCSSTransitionReplace>
      </div>
    )
  }
}

export default ContentAddRemove
