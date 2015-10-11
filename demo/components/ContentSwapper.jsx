import React from 'react';
import ReactCSSTransitionReplace from '../../src/ReactCSSTransitionReplace.jsx';

import ContentLong from './ContentLong.jsx';
import ContentShort from './ContentShort.jsx';


class ContentSwapper extends React.Component {

  static propTypes = {
    longContent: React.PropTypes.bool
  };

  state = {longContent: this.props.longContent};

  handleClick = () => {
    this.setState({longContent: !this.state.longContent});
  }

  render() {
    return (
      <div onClick={this.handleClick} style={{cursor: 'pointer'}}>
        <ReactCSSTransitionReplace {...this.props}>
          {this.state.longContent ? <ContentLong key="long" /> : <ContentShort key="short" />}
        </ReactCSSTransitionReplace>
      </div>
    );
  }
}

export default ContentSwapper;
