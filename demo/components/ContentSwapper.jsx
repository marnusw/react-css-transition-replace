import React from 'react';
import ReactCSSTransitionReplace from '../../src/ReactCSSTransitionReplace.jsx';


class ContentSwapper extends React.Component {

  state = {swapped: false};

  handleClick = () => {
    this.setState({swapped: !this.state.swapped});
  }

  render() {
    const content = React.Children.toArray(this.props.children);
    const { style = {} } = this.props;

    style.cursor = 'pointer';

    return (
      <ReactCSSTransitionReplace {...this.props} style={style} onClick={this.handleClick}>
        {this.state.swapped ? content[1] : content[0]}
      </ReactCSSTransitionReplace>
    );
  }
}

export default ContentSwapper;
