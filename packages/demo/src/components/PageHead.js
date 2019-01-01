import React from 'react'

function PageHead() {
  return (
    <div className="page-head">
      <h1>react-css-transition-replace</h1>
      <p>
        A{' '}
        <a href="http://facebook.github.io/react" target="_blank" rel="noopener noreferrer">
          React
        </a>{' '}
        component to animate replacing one element with another.
      </p>

      <p>
        While{' '}
        <a
          href="https://facebook.github.io/react/docs/animation.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <code>ReactCSSTransitionGroup</code>
        </a>{' '}
        does a great job of animating changes to a list of components and can even be used to
        animate the replacement of one item with another, proper handling of the container height in
        the latter case is not built in. This component is designed to do exactly that with an API
        closely following that of <code>ReactCSSTransitionGroup</code>.
      </p>

      <p>
        For a full motivation and usage docs see the{' '}
        <a
          href="https://github.com/marnusw/react-css-transition-replace"
          target="_blank"
          rel="noopener noreferrer"
        >
          README on GitHub
        </a>
        .
      </p>
    </div>
  )
}

export default PageHead
