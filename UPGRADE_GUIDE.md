Upgrade Guide
=============

0.2.x -> 1.0.0
--------------

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
