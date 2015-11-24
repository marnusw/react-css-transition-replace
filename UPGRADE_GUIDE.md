# Upgrade Guide

## 1.0.x -> 1.1.0

The entering component use to be positioned on top of the leaving component with 
`position: absolute`, `top:0` and `left:0` styles. If this component has narrow content
and depends on its outer element to fill its parent's width this will no longer happen
one it is absolutely positioned and thus the content will be narrow while animating and
then jump to the proper width when the animation completes. By also specifying `right:0` 
and `bottom:0` styles the entering component now remains stretched to its parent's width.

This change should go unnoticed in most use cases, but it is conceivable that it might
be a breaking change and thus the minor version bump. If there is a use case that 
absolutely requires not setting `right` and `bottom` styles open an issue or PR and we 
can look at adding a prop to disable this.


## 0.2.x -> 1.0.0

#### Specify the transition delay

With the upgrade of React.js from `0.13.x` to `0.14.0` the API has been updated to match
that of `ReactCSSTransitionGroup` in that it requires specifying the transition duration
in JS with the timeout props: `transitionEnterTimeout`, `transitionLeaveTimeout` and 
`transitionAppearTimeout`.

#### Waiting for `leave` before starting `enter`

If you were using this component to expressly wait for the leaving child to transition
out completely before the entering child transitions in you simply need to add a delay
to the enter animation style, matching the duration of the leave animation style. 

If you would prefer a cross fade (or similar simultaneous in place transition, which was 
not possible with `v0.2.x`) then the same styles will now have that effect. The entering 
and leaving children will transition simultaneously with the change in height managed as 
before.

```css
.fade-leave.fade-leave-active {
  opacity: 0.01;
  transition: opacity .1s ease-in;
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity .2s ease-in .1s;
}
```

Note the `.fade-enter-active` transition being delayed by `.1s`, the same as the duration
of the `.fade-leave-active` transition.
