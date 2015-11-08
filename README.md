# React CSS Transition Replace

A [React](http://facebook.github.io/react/) component to animate replacing one element with another.

While [`ReactCSSTransitionGroup`](https://facebook.github.io/react/docs/animation.html) does a great job
of animating changes to a list of components and can even be used to animate the replacement of one item
with another, proper handling of the container height in the latter case is not built in. This component 
is designed to do exactly that with an API closely following that of `ReactCSSTransitionGroup`.

Using `react-css-transition-replace` provides two distinct benefits:

 - It automatically handles the positioning of the animated components internally, and
 - *allows changes in the height of container to be handled and animated with ease when 
   various content heights differ, even when absolute positioning is used.*

Animations are fully configurable with CSS, including having the entering component wait to enter until 
the leaving component's animation completes. Following suit with the 
[React.js API](https://facebook.github.io/react/docs/animation.html#getting-started) the one caveat is 
that the transition duration must be specified in JavaScript as well as CSS.


## Installation

Install via `npm`:

```
npm install --save react-css-transition-replace
```


## Usage

A `ReactCSSTransitionReplace` component can only have a single child. Other than that, the basic usage 
follows the exact same API as `ReactCSSTransitionGroup`. When the `key` of the child component changes, the 
previous component is animated out and the new component animated in. During this process:

 - The leaving component continues to be rendered as usual with `static` positioning.
 - The entering component is positioned on top of the leaving component with `absolute` positioning.
 - The height of the container is set to that of the leaving component, and then immediately to that of the 
   entering component, and the `{animation-name}-height` class is applied to it.

This provides many possibilities for animating the replacement as illustrated in the following examples.

### Cross-fading two components

The `ReactCSSTransitionReplace` component is used exactly like its `ReactCSSTransitionGroup` counterpart:

```javascript
import ReactCSSTransitionReplace from 'react-css-transition-replace';

render() {
  return (
    <ReactCSSTransitionReplace transitionName="cross-fade" 
                               transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
      <SomeComponent key="uniqueValue"/>
    </ReactCSSTransitionReplace>
  );
}
```

To realize cross-fading of two components all that remains is to define the enter and leave opacity 
transitions in the associated CSS classes:

```css
.cross-fade-leave {
  opacity: 1;
}
.cross-fade-leave.cross-fade-leave-active {
  opacity: 0;
  transition: opacity 1s ease-in;
}

.cross-fade-enter {
  opacity: 0;
}
.cross-fade-enter.cross-fade-enter-active {
  opacity: 1;
  transition: opacity 1s ease-in;
}

.cross-fade-height {
  transition: height 1s ease-in-out;
}
```

Note the additional `.cross-fade-height` class. This indicates how the container height is to be
animated if the heights of the entering and leaving components are not the same. 

### Fade out, then fade in

To fade a component out and wait for its transition to complete before fading in the next, simply
add a delay to the `enter` transition.

```css
.fade-wait-leave {
  opacity: 1;
}
.fade-wait-leave.fade-wait-leave-active {
  opacity: 0;
  transition: opacity .4s ease-in;
}

.fade-wait-enter {
  opacity: 0;
}
.fade-wait-enter.fade-wait-enter-active {
  opacity: 1;
  /* Delay the enter animation until the leave completes */
  transition: opacity .4s ease-in .6s;
}

.fade-wait-height {
  transition: height .6s ease-in-out;
}
```

*Note:* The `transitionEnterTimeout` specified in the JS must be long enough to allow for the delay and 
the duration of the transition. In this case:

```javascript
<ReactCSSTransitionReplace transitionName="fade-wait" transitionEnterTimeout={1000} transitionLeaveTimeout={400}>
```


#### Disabling the height transition

If the `.*-height` class is not specified the change in container height will not be animated but rather 
jump to the height of the entering component instantaneously. While this is probably not a very useful 
scenario in practice, doing so does not break anything and still avoids absolute positioning related 
height issues.


## Tips

 - In general animating `block` or `inline-block` level elements is more stable that `inline` elements. If the
   height changes in random ways ensure that there isn't a `span` or other inline element used as the outer 
   element of the components being animated.
 - The `overflow` of the container is set to `'hidden'` automatically, which changes the behaviour of 
   [collapsing margins](https://css-tricks.com/what-you-should-know-about-collapsing-margins/) from the default 
   `'visible'`. This may cause a glitch in the height at the start or end of animations. To avoid this you can:
     - Keep the overflow hidden permanently with custom styles/classes if there won't be adverse side-effects.
     - Only use 
       [Single-direction margin declarations](http://csswizardry.com/2012/06/single-direction-margin-declarations/)
       to avoid any collapsing margins.
     - Turn this feature off by setting the `overflowHidden={false}` prop when hidden overflow is not needed,
       for example when transitions are in place and content is of the same height.


## Contributing

PRs are welcome.


## License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
