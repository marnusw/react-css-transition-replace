import React from 'react';
import ReactCSSTransitionReplace from '../../src/ReactCSSTransitionReplace.jsx';


class ContentSwapper extends React.Component {

  static propTypes = {
    swapped: React.PropTypes.bool
  };

  state = {swapped: this.props.swapped};

  handleClick = () => {
    this.setState({swapped: !this.state.swapped});
  }

  render() {
    const content = React.Children.toArray(this.props.children);

    return (
      <div onClick={this.handleClick} style={{cursor: 'pointer'}}>
        <ReactCSSTransitionReplace {...this.props}>
          {this.state.swapped ? content[1] : content[0]}
        </ReactCSSTransitionReplace>
      </div>
    );
  }
}

export default ContentSwapper;
