import React from 'react'
import { Navbar, Nav, NavItem, Grid } from 'react-bootstrap'
const NavbarBrand = Navbar.Brand

import PageHead from './PageHead.jsx'
import ContentSwapper from './ContentSwapper.jsx'
import ContentAddRemove from './ContentAddRemove.jsx'

import ContentLong from './ContentLong.jsx'
import ContentShort from './ContentShort.jsx'

class Demo extends React.Component {

  componentDidMount() {
    const images = [
      'img/vista1.jpg',
      'img/vista2.jpg',
      'img/vista3.jpg',
      'img/vista4.jpg',
    ]

    images.forEach(src => {
      const img = new window.Image()
      img.src = src
    })
  }

  render() {
    return (
      <div>
        <Navbar>
          <NavbarBrand>ReactCSSTransitionReplace</NavbarBrand>
          <Nav pullRight>
            <NavItem href="https://github.com/marnusw/react-css-transition-replace" target="_blank">GitHub</NavItem>
          </Nav>
        </Navbar>

        <Grid>
          <PageHead />

          <div className="examples">
            <h2>Examples</h2>
            <p className="text-danger"><em>Click any content to trigger the transition.</em></p>

            <h3 id="cross-fade">Cross-fade transition</h3>
            <p>The <code>opacity</code> transitions for <code>enter</code> and <code>leave</code> are started
              at the same time. View the <a
                href="https://github.com/marnusw/react-css-transition-replace#cross-fading-two-components"
                target="_blank">CSS</a>.</p>

            <ContentSwapper transitionName="cross-fade" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
              <img key="img1" src="img/vista1.jpg" width="600" height="235"/>
              <img key="img2" src="img/vista2.jpg" width="600" height="280"/>
            </ContentSwapper>

            <h3 id="fade-wait">Fade out, then fade in transition</h3>
            <p>The <code>opacity</code> transition for <code>enter</code> animation is delayed until after
              the <code>leave</code> transition completes. View the <a
                href="https://github.com/marnusw/react-css-transition-replace#fade-out-then-fade-in"
                target="_blank">CSS</a>.</p>

            <ContentSwapper transitionName="fade-wait" transitionEnterTimeout={1000} transitionLeaveTimeout={400}>
              <ContentLong key="long"/>
              <ContentShort key="short"/>
            </ContentSwapper>

            <h3 id="carousel-swap">Carousel transition</h3>
            <p>The slide animation is realised with a 2D CSS <code>transform</code>. View the <a
              href="transitions.css" target="_blank">CSS source</a>. To ensure the entering/leaving
              images are properly hidden the carousel width can be set directly on the container:
              <code>{'<ReactCSSTransitionReplace transitionName="carousel-swap" /*...*/  style={{width: 600}}>'}</code>.
            </p>

            <ContentSwapper transitionName="carousel-swap" transitionEnterTimeout={500} transitionLeaveTimeout={500}
                            style={{width: 600}}>
              <img key="img3" src="img/vista3.jpg" width="600" height="255"/>
              <img key="img4" src="img/vista4.jpg" width="600" height="280"/>
            </ContentSwapper>

            <h3 id="roll-up">Add/Remove Content</h3>
            <p>The child component may be removed (i.e. <code>ReactCSSTransitionReplace</code> left with no children)
              which will animate the <code>height</code> going to zero along with the <code>leave</code> transition.
              A single child can subsequently be added again, triggering the inverse animation.
              View the <a href="transitions.css" target="_blank">CSS source</a> of the `roll-up` transition.
            </p>

            <ContentAddRemove transitionName="roll-up" transitionEnterTimeout={800} transitionLeaveTimeout={800}>
              <img key="img1" src="img/vista1.jpg" width="600" height="235"/>
            </ContentAddRemove>

          </div>
        </Grid>
      </div>
    )
  }
}

export default Demo
