'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2; /**
                     * Adapted from ReactCSSTransitionGroup.js by Facebook
                     *
                     * @providesModule ReactCSSTransitionReplace
                     */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ReactCSSTransitionGroupChild = require('react/lib/ReactCSSTransitionGroupChild');

var _ReactCSSTransitionGroupChild2 = _interopRequireDefault(_ReactCSSTransitionGroupChild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? _defaults(subClass, superClass) : _defaults(subClass, superClass); }

var reactCSSTransitionGroupChild = _react2.default.createFactory(_ReactCSSTransitionGroupChild2.default);

var TICK = 17;

function createTransitionTimeoutPropValidator(transitionType) {
  var timeoutPropName = 'transition' + transitionType + 'Timeout';
  var enabledPropName = 'transition' + transitionType;

  return function (props) {
    // If the transition is enabled
    if (props[enabledPropName]) {
      // If no timeout duration is provided
      if (!props[timeoutPropName]) {
        return new Error(timeoutPropName + ' wasn\'t supplied to ReactCSSTransitionReplace: ' + 'this can cause unreliable animations and won\'t be supported in ' + 'a future version of React. See ' + 'https://fb.me/react-animation-transition-group-timeout for more ' + 'information.');

        // If the duration isn't a number
      } else if (typeof props[timeoutPropName] != 'number') {
        return new Error(timeoutPropName + ' must be a number (in milliseconds)');
      }
    }
  };
}

var ReactCSSTransitionReplace = (_temp2 = _class = function (_React$Component) {
  _inherits(ReactCSSTransitionReplace, _React$Component);

  function ReactCSSTransitionReplace() {
    var _temp, _this, _ret;

    _classCallCheck(this, ReactCSSTransitionReplace);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      currentKey: '1',
      currentChild: _this.props.children ? _react2.default.Children.only(_this.props.children) : undefined,
      prevChildren: {},
      height: null
    }, _this.handleDoneAppearing = function (key) {
      delete _this.transitioningKeys[key];
      if (key !== _this.state.currentKey) {
        // This child was removed before it had fully appeared. Remove it.
        _this.performLeave(key);
      }
    }, _this.performLeave = function (key) {
      _this.transitioningKeys[key] = true;
      _this.refs[key].componentWillLeave(_this.handleDoneLeaving.bind(_this, key));
      if (!_this.state.currentChild) {
        // The enter transition dominates, but if there is no
        // entering component the height is set to zero.
        _this.enqueueHeightTransition();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  ReactCSSTransitionReplace.prototype.componentWillMount = function componentWillMount() {
    this.shouldEnterCurrent = false;
    this.keysToLeave = [];
    this.transitioningKeys = {};
  };

  ReactCSSTransitionReplace.prototype.componentDidMount = function componentDidMount() {
    if (this.props.transitionAppear && this.state.currentChild) {
      this.performAppear(this.state.currentKey);
    }
  };

  ReactCSSTransitionReplace.prototype.componentWillUnmount = function componentWillUnmount() {
    clearTimeout(this.timeout);
  };

  ReactCSSTransitionReplace.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var nextChild = nextProps.children ? _react2.default.Children.only(nextProps.children) : null;
    var currentChild = this.state.currentChild;


    if (!currentChild && !nextChild || currentChild && nextChild && currentChild.key === nextChild.key) {
      return;
    }

    var state = this.state;
    var currentKey = state.currentKey;


    var nextState = {
      currentKey: String(Number(currentKey) + 1),
      currentChild: nextChild,
      height: 0
    };

    if (nextChild) {
      this.shouldEnterCurrent = true;
    }

    if (currentChild) {
      var _extends2;

      nextState.height = _reactDom2.default.findDOMNode(this.refs[currentKey]).offsetHeight;
      nextState.prevChildren = _extends({}, state.prevChildren, (_extends2 = {}, _extends2[currentKey] = currentChild, _extends2));
      if (!this.transitioningKeys[currentKey]) {
        this.keysToLeave.push(currentKey);
      }
    }

    this.setState(nextState);
  };

  ReactCSSTransitionReplace.prototype.componentDidUpdate = function componentDidUpdate() {
    if (this.shouldEnterCurrent) {
      this.shouldEnterCurrent = false;
      this.performEnter(this.state.currentKey);
    }

    var keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  };

  ReactCSSTransitionReplace.prototype.performAppear = function performAppear(key) {
    this.transitioningKeys[key] = true;
    this.refs[key].componentWillAppear(this.handleDoneAppearing.bind(this, key));
  };

  ReactCSSTransitionReplace.prototype.performEnter = function performEnter(key) {
    this.transitioningKeys[key] = true;
    this.refs[key].componentWillEnter(this.handleDoneEntering.bind(this, key));
    this.enqueueHeightTransition();
  };

  ReactCSSTransitionReplace.prototype.handleDoneEntering = function handleDoneEntering(key) {
    delete this.transitioningKeys[key];
    if (key === this.state.currentKey) {
      // The current child has finished entering so the height transition is also cleared.
      this.setState({ height: null });
    } else {
      // This child was removed before it had fully appeared. Remove it.
      this.performLeave(key);
    }
  };

  ReactCSSTransitionReplace.prototype.handleDoneLeaving = function handleDoneLeaving(key) {
    delete this.transitioningKeys[key];

    var nextState = { prevChildren: _extends({}, this.state.prevChildren) };
    delete nextState.prevChildren[key];

    if (!this.state.currentChild) {
      nextState.height = null;
    }

    this.setState(nextState);
  };

  ReactCSSTransitionReplace.prototype.enqueueHeightTransition = function enqueueHeightTransition() {
    var _this2 = this;

    var state = this.state;

    this.timeout = setTimeout(function () {
      if (!state.currentChild) {
        return _this2.setState({ height: 0 });
      }
      _this2.setState({ height: _reactDom2.default.findDOMNode(_this2.refs[state.currentKey]).offsetHeight });
    }, TICK);
  };

  ReactCSSTransitionReplace.prototype.wrapChild = function wrapChild(child, moreProps) {
    var transitionName = this.props.transitionName;

    if ((typeof transitionName === 'undefined' ? 'undefined' : _typeof(transitionName)) == 'object' && transitionName !== null) {
      transitionName = _extends({}, transitionName);
      delete transitionName.height;
    }

    // We need to provide this childFactory so that
    // ReactCSSTransitionReplaceChild can receive updates to name,
    // enter, and leave while it is leaving.
    return reactCSSTransitionGroupChild(_extends({
      name: transitionName,
      appear: this.props.transitionAppear,
      enter: this.props.transitionEnter,
      leave: this.props.transitionLeave,
      appearTimeout: this.props.transitionAppearTimeout,
      enterTimeout: this.props.transitionEnterTimeout,
      leaveTimeout: this.props.transitionLeaveTimeout
    }, moreProps), child);
  };

  ReactCSSTransitionReplace.prototype.render = function render() {
    var _this3 = this;

    var _state = this.state,
        currentKey = _state.currentKey,
        currentChild = _state.currentChild,
        prevChildren = _state.prevChildren,
        height = _state.height;

    var childrenToRender = [];

    var _props = this.props,
        overflowHidden = _props.overflowHidden,
        transitionName = _props.transitionName,
        component = _props.component,
        transitionAppear = _props.transitionAppear,
        transitionEnter = _props.transitionEnter,
        transitionLeave = _props.transitionLeave,
        transitionAppearTimeout = _props.transitionAppearTimeout,
        transitionEnterTimeout = _props.transitionEnterTimeout,
        transitionLeaveTimeout = _props.transitionLeaveTimeout,
        containerProps = _objectWithoutProperties(_props, ['overflowHidden', 'transitionName', 'component', 'transitionAppear', 'transitionEnter', 'transitionLeave', 'transitionAppearTimeout', 'transitionEnterTimeout', 'transitionLeaveTimeout']);

    if (height !== null) {
      var heightClassName = (typeof transitionName === 'undefined' ? 'undefined' : _typeof(transitionName)) == 'object' && transitionName !== null ? transitionName.height || '' : String(transitionName) + '-height';

      containerProps.className = String(containerProps.className || '') + ' ' + String(heightClassName);
      containerProps.style = _extends({}, containerProps.style, {
        position: 'relative',
        display: 'block',
        height: height
      });

      if (overflowHidden) {
        containerProps.style.overflow = 'hidden';
      }
    }

    Object.keys(prevChildren).forEach(function (key) {
      childrenToRender.push(_react2.default.createElement('span', {
        key: key,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }
      }, _this3.wrapChild(typeof prevChildren[key].type == 'string' ? prevChildren[key] : _react2.default.cloneElement(prevChildren[key], { isLeaving: true }), { ref: key })));
    });

    if (currentChild) {
      childrenToRender.push(_react2.default.createElement('span', { key: currentKey }, this.wrapChild(currentChild, { ref: currentKey })));
    }

    return _react2.default.createElement(component, containerProps, childrenToRender);
  };

  return ReactCSSTransitionReplace;
}(_react2.default.Component), _class.displayName = 'ReactCSSTransitionReplace', _class.defaultProps = {
  transitionAppear: false,
  transitionEnter: true,
  transitionLeave: true,
  overflowHidden: true,
  component: 'span'
}, _temp2);
exports.default = ReactCSSTransitionReplace;
module.exports = exports['default'];