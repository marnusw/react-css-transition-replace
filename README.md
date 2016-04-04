# React CSS Transition Replace

A [React](http://facebook.github.io/react/) component to animate replacing one element with another.

While [`ReactCSSTransitionGroup`](https://facebook.github.io/react/docs/animation.html) does a great job
of animating changes to a list of components and can even be used to animate the replacement of one item
with another, proper handling of the container height in the latter case is not built in. This component 
is designed to do exactly that with an API closely following that of `ReactCSSTransitionGroup`.

Using `react-css-transition-replace` provides two distinct benefits:

 - It automatically handles the positioning of the animated components, and
 - *allows changes in the height of container to be handled and animated with ease when 
   various content heights differ, even when absolute positioning is used.*

Animations are fully configurable with CSS, including having the entering component wait to enter until 
the leaving component's animation completes. Following suit with the 
[React.js API](https://facebook.github.io/react/docs/animation.html#getting-started) the one caveat is 
that the transition duration must be specified in JavaScript as well as CSS.

[Live Examples](http://marnusw.github.io/react-css-transition-replace) | 
[Change Log](/CHANGELOG.md) | 
[Upgrade Guide](/UPGRADE_GUIDE.md) 


## Installation

Install via `npm`:

```
npm install react-css-transition-replace
```


## Usage

A `ReactCSSTransitionReplace` component can only have a single child. Other than that, the basic usage 
follows the exact same API as `ReactCSSTransitionGroup`, with support for `transitionEnter`, `transitionLeave`
and `transitionAppear`. When the `key` of the child component changes, the previous component is animated out 
and the new component animated in. During this process:

 - The leaving component continues to be rendered as usual with `static` positioning.
 - The entering component is positioned on top of the leaving component with `absolute` positioning.
 - The height of the container is set to that of the leaving component, and then immediately to that of the 
   entering component, and the `{animation-name}-height` class is applied to it.

This provides many possibilities for animating the replacement as illustrated in the examples below.

It is also possible to remove the child component (i.e. leave `ReactCSSTransitionReplace` with no children)
which will animate the `height` going to zero along with the `leave` transition. Similarly, a single child 
can be added to an empty `ReactCSSTransitionReplace`, triggering the inverse animation.

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
  transition: height .5s ease-in-out;
}
```

Note the additional `.cross-fade-height` class. This indicates how the container height is to be
animated if the heights of the entering and leaving components are not the same. You can see this
in action [here](http://marnusw.github.io/react-css-transition-replace#cross-fade).

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
<ReactCSSTransitionReplace transitionName="fade-wait" 
                           transitionEnterTimeout={1000} transitionLeaveTimeout={400}>
```

See the live example [here](http://marnusw.github.io/react-css-transition-replace#fade-wait).


### Hardware acceleration for smoother transitions

For smoother transitions hardware acceleration, which is achieved by using translate3d instead of the 2D 
translations, should be used whenever possible. For example, to realize a mobile app transition between 
pages one might use:

```css
.page-enter, .page-leave {
  position: absolute;
  -webkit-transition: transform 250ms ease-in-out, opacity 250ms ease-in-out;
  transition: transform 250ms ease-in-out, opacity 250ms ease-in-out;
}

.page-enter {
  left: 100vw;
}

.page-enter.page-enter-active {
  -webkit-transform: translate3d(-100vw, 0, 0);
  transform: translate3d(-100vw, 0, 0);
}

.page-leave {
  left: 0;
}

.page-leave.page-leave-active {
  -webkit-transform: translate3d(-100vw, 0, 0);
  transform: translate3d(-100vw, 0, 0);
}
```

```javascript
<ReactCSSTransitionReplace transitionName="page" transitionEnterTimeout={250} transitionLeaveTimeout={250} >
  <div key="page01">
    My page 01 content
  </div>
</ReactCSSTransitionReplace>
```


## Tips

 1. In general animating `block` or `inline-block` level elements is more stable that `inline` elements. If the
    height changes in random ways ensure that there isn't a `span` or other inline element used as the outer 
    element of the components being animated.
 2. The `overflow` of the container is set to `'hidden'` automatically, which changes the behaviour of 
    [collapsing margins](https://css-tricks.com/what-you-should-know-about-collapsing-margins/) from the default 
    `'visible'`. This may cause a glitch in the height at the start or end of animations. To avoid this you can:
      - Keep the overflow hidden permanently with custom styles/classes if that will not cause undesired side-effects.
      - Only use 
        [Single-direction margin declarations](http://csswizardry.com/2012/06/single-direction-margin-declarations/)
        to avoid collapsing margins overall.
      - Turn this feature off by setting the `overflowHidden={false}` prop when hidden overflow is not needed,
        for example when transitions are in place and content is of the same height.
 3. If the `.*-height` class is not specified the change in container height will not be animated but instead 
    jump to the height of the entering component instantaneously. It can, therefore, be omitted if all content 
    is known to be of the same height without any adverse side-effects, and absolute positioning related height 
    issues will still be avoided.


## Contributing

PRs are welcome.


## License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
