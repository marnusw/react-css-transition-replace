# Upgrade Guide

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
