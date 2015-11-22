import React from 'react';
import ReactCSSTransitionReplace from '../../src/ReactCSSTransitionReplace.jsx';


class ContentSwapper extends React.Component {

  state = {
    count: React.Children.count(this.props.children),
    index: 0
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({index: this.state.index + 1 >= this.state.count ? 0 : this.state.index + 1});
    }, 4000);
  }

  render() {
    const content = React.Children.toArray(this.props.children);

    return (
      <ReactCSSTransitionReplace {...this.props}>
        {content[this.state.index]}
      </ReactCSSTransitionReplace>
    );
  }
}

export default ContentSwapper;
