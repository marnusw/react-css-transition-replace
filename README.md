# React CSS Transition Replace

A [React](http://facebook.github.io/react/) component to animate replacing one element with another.

While [`ReactCSSTransitionGroup`](https://facebook.github.io/react/docs/animation.html) does a great job
of animating changes to a list of elements it does not allow removing an element, waiting for its leave
transition to complete, and then adding a new element with its enter transition. This component is 
designed to do exactly that with an API closely following the 
[`ReactCSSTransitionGroup`](https://facebook.github.io/react/docs/animation.html) API.


## Installation

Install via `npm`:

```
npm install --save react-css-transition-replace
```

**Note:** This version requires `React 0.14.0-rc1`, for `React 0.13.x` use version `0.1.4` of this library.


## Usage

A `ReactCSSTransitionReplace` element can only have a single child. Other than that, the basic usage 
follows the exact same API as `ReactCSSTransitionGroup`:

```javascript
import ReactCSSTransitionReplace from 'react-css-transition-replace';

render() {
  return (
    <div>
      <ReactCSSTransitionReplace transitionName="fade">
        <SomeComponent />
      </ReactCSSTransitionReplace>
    </div>
  );
}
```

This will use the CSS styles below to apply transitions to the child elements that leave and enter.
The entering element will only be added to the DOM flow once the leaving element has been removed.

```css
.fade-leave {
  opacity: 1;
}
.fade-leave.fade-leave-active {
  opacity: 0.01;
  transition: opacity .1s ease-in;
}

.fade-enter {
  opacity: 0.01;
}
.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity .2s ease-in;
}

.fade-height {
  transition: height .15s ease-in-out;
}
```

Note the additional `.fade-height` class. This will also animate the change in the container 
height based on the content transitioning out/in. 

It the `.fade-height` class is not specified the change in container height will not be animated.
If this is the desired result the height transition can be disabled entirely by setting the
`transitionHeight` prop to `false`: 

```
<ReactCSSTransitionReplace transitionName="fade" transitionHeight={false}>
```

The `transitionEnter`, `transitionLeave` and `transitionAppear` props are also still available.


## Contributing

PRs are welcome.


## License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
