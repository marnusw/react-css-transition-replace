/**
 * Adapted from ReactCSSTransitionGroup.js by Facebook
 *
 * @providesModule CSSTransitionReplace
 */

import React from 'react/addons';
import classSet from 'classnames';

import ReplaceChildComponent from './CSSTransitionReplaceChild';

const CSSTransitionReplaceChild = React.createFactory(ReplaceChildComponent);
const ReactTransitionGroup = React.addons.TransitionGroup;


class CSSTransitionReplace extends React.Component {

  constructor(props) {
    super(props);

    this._childEntered = this._childEntered.bind(this);
    this._childLeft = this._childLeft.bind(this);
    this._wrapChild = this._wrapChild.bind(this);

    this.state = {
      currentChild: React.Children.only(props.children),
      nextChild: null,
      height: 'auto'
    };
  }

  componentWillReceiveProps(nextProps) {
    let nextChild = nextProps.children ? React.Children.only(nextProps.children) : null;
    let currentChild = this.state.currentChild;

    if (currentChild && nextChild && nextChild.key === currentChild.key) {
      // Nothing changed, but we are re-rendering so update the currentChild.
      return this.setState({
        currentChild: nextChild
      });
    }

    let transitionHeight = nextProps.transitionHeight;
    let currentHeight = transitionHeight ? React.findDOMNode(this.refs.container).offsetHeight : 'auto';

    // The child was removed, so animate out.
    if (!nextChild) {
      return this.setState({
        height: currentHeight,
        currentChild: null
      }, () => transitionHeight && this.setState({height: 0}));
    }

    // The child was replaced or added, setting a nextChild will eventually animate it in.
    this.setState({
      height: currentHeight,
      currentChild: null,
      nextChild
    });
  }

  componentDidUpdate() {
    let nextChild = React.findDOMNode(this.refs.nextChild);

    // If there is a next child we'll be animating it in soon, so change to its height.
    if (nextChild && nextChild.offsetHeight !== this.state.height) {
      this.setState({
        height: nextChild.offsetHeight
      });
    }
  }

  _childLeft() {
    // Swap the children after the current child left.
    this.setState({
      currentChild: this.state.nextChild,
      nextChild: null
    });
  }

  _childEntered() {
    // The height animation would have finished, so switch back to auto.
    if (this.props.transitionHeight) {
      this.setState({
        height: 'auto'
      });
    }
  }

  _wrapChild(child) {
    // We need to provide this childFactory so that
    // CSSTransitionReplaceChild can receive updates to name,
    // enter, and leave while it is leaving.
    return CSSTransitionReplaceChild({
        name: this.props.transitionName,
        appear: this.props.transitionAppear,
        enter: this.props.transitionEnter,
        leave: this.props.transitionLeave,
        onEntered: this._childEntered,
        onLeft: this._childLeft
      },
      child
    );
  }

  render() {
    let style = this.props.style;
    let nextChildShadow;
    let heightClassName;

    if (this.props.transitionHeight) {
      if (this.state.nextChild) {
        nextChildShadow = (
          <div ref="nextChild" style={{position: 'absolute', visibility: 'hidden'}}>
            {this.state.nextChild}
          </div>
        );
      }

      heightClassName = `${this.props.transitionName}-height`;

      style = {
        overflow: this.state.height !== 'auto' ? 'hidden' : 'visible',
        height: this.state.height,
        display: 'block'
      };
    }

    return (
      <span>
        {nextChildShadow}
        <ReactTransitionGroup ref="container" {...this.props} childFactory={this._wrapChild} style={style}
                              className={classSet(this.props.className, heightClassName)}>
          {this.state.currentChild}
        </ReactTransitionGroup>
      </span>
    );
  }
}

CSSTransitionReplace.propTypes = {
  transitionName: React.PropTypes.string.isRequired,
  transitionAppear: React.PropTypes.bool,
  transitionEnter: React.PropTypes.bool,
  transitionLeave: React.PropTypes.bool,
  transitionHeight: React.PropTypes.bool
};

CSSTransitionReplace.defaultProps = {
  transitionAppear: false,
  transitionEnter: true,
  transitionLeave: true,
  transitionHeight: true
};

export default CSSTransitionReplace;
