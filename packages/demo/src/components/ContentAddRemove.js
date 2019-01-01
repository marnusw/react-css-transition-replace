import React from 'react'
import Button from 'react-bootstrap/es/Button'
import ReactCSSTransitionReplace from 'react-css-transition-replace'

class ContentAddRemove extends React.Component {
  state = { added: false }

  handleClick = () => {
    this.setState({ added: !this.state.added })
  }

  render() {
    const { style = {} } = this.props

    const newStyle = {
      ...style,
      cursor: 'pointer',
    }

    return (
      <div style={newStyle} onClick={this.handleClick}>
        <Button bsStyle="link" style={{ outline: 'none', paddingLeft: 0 }}>
          Click to {this.state.added ? 'remove' : 'add'} content
        </Button>
        <br />
        <br />
        <ReactCSSTransitionReplace {...this.props}>
          {this.state.added ? this.props.children : null}
        </ReactCSSTransitionReplace>
      </div>
    )
  }
}

export default ContentAddRemove
