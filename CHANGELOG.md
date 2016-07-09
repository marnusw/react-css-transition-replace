### v1.3.0 (9 July 2016)

* [ENHANCEMENT] When removing an element just added to an empty container transitions are reset to avoid getting stuck.
* [ENHANCEMENT] When starting a height transition and the entering element hasn't rendered wait another tick. (#6,#10)
* [ENHANCEMENT] Don't pass non-standard DOM props to the component as required by `react 15.2.0`. (#17)
* [UPGRADE] Use `react@15.2.0` and upgraded dev dependencies. (Should still work with `react@0.14` with `npm` warnings)
* [ENHANCEMENT] Use the spread operator rather than `object-assign`. (#16)

### v1.2.0-beta (18 April 2016)

* [UPGRADE] Add peer dependency `react@15.0.1`.
* [ENHANCEMENT] Add a `displayName` field.

### v1.1.2 (9 April 2016)

* [UPGRADE] Use the `object-assign` lib, as [React 15 does](https://github.com/facebook/react/pull/6376), rather
            than `react/lib/Object.assign` which has been removed. (#14)

### v1.1.1 (4 April 2016)

* [BUGFIX] Corrected the file name in the `main` field of package.json. (#13)
* [BUGFIX] Allow prop `transitionName` to be of type `object`. (#9,#12)
* [DOCUMENTATION] Added a Hardware Acceleration example to the README. (#8)
* [DOCUMENTATION] Add a note that `transitionAppear` is also supported. (#7)

### v1.1.0 (24 November 2015)

* [ENHANCEMENT] The entering component, which is absolutely positioned, is not only positioned with `top:0` and `left:0`
                styles, but also `right:0` and `bottom:0` so smaller content fills the entire container.

### v1.0.1 (24 November 2015)

* [ENHANCEMENT] Support no children so the child component can be removed / added. (#4)
* [ENHANCEMENT] Added an add/remove content section to the demo and docs.

### v1.0.0 (8 November 2015)

* [ENHANCEMENT] Publish the demo page on [`gh-pages`](http://marnusw.github.io/react-css-transition-replace/).
* [ENHANCEMENT] Added a demo page; to view run `npm install` and `gulp demo`.
* [ENHANCEMENT] Allow in place transitions fully configurable in CSS.
* [ENHANCEMENT] Use `ReactCSSTransitionGroupChild` rather than defining yet another child wrapper.
* [ENHANCEMENT] More stable implementation which does not call `setState` in `componentDidUpdate` among other improvements.
 
### v0.2.1 (26 October 2015)

* [UPGRADE] Upgrade React.js to v0.14.0.
 
### v0.2.0 (28 September 2015)

* [DEPENDENCY] Removed the `classnames` dependency. 
* [ENHANCEMENT] The `${transitionName}-height` class is only added while the height transition is active.
* [ENHANCEMENT] The `ReactCSSTransitionReplace` component require `transitionEnterTimeout` etc. props like `ReactCSSTransitionGroup`.
* [UPGRADE] Upgrade React.js to v0.14.0-rc1.

### v0.1.4 (9 September 2015)

* [BUGFIX] Using React's `object.assign` method to be ES5 compatible which was the intent. (#2)

### v0.1.3 (12 August 2015)

* [BUGFIX] Added the `classnames` dependency to `package.json`. (#1)
* [ENHANCEMENT] The `style` prop rules are maintained while animating, only overriding the necessary style rules.
* [ENHANCEMENT] Stricter and fully configured linting rules.
* [DOCUMENTATION] Fixed a typo.

### v0.1.2 (10 August 2015)

Initial release.
