import React from 'react';
import { Navbar, NavBrand, Nav, NavItem, Grid } from 'react-bootstrap';

import ContentSwapper from './ContentSwapper.jsx';

import ContentLong from './ContentLong.jsx';
import ContentShort from './ContentShort.jsx';

class Demo extends React.Component {

  componentDidMount() {
    [
      '/img/vista1.jpg',
      '/img/vista2.jpg',
      '/img/vista3.jpg',
      '/img/vista4.jpg'
    ].forEach(src => {
        const img = new window.Image();
        img.src = src;
      });
  }

  render() {
    const transitionProps = {
      transitionEnterTimeout: 500,
      transitionLeaveTimeout: 300,
      transitionHeight: false
    };

    return (
      <div>
        <Navbar>
          <NavBrand>ReactCSSTransitionReplace</NavBrand>
          <Nav right>
            <NavItem href="https://github.com/marnusw/react-css-transition-replace" target="_blank">GitHub</NavItem>
          </Nav>
        </Navbar>

        <Grid>
          <br/>
          <p className="text-danger"><em>Click any content to trigger the transition.</em></p>

          <h2>Cross-fade transition</h2>
          <ContentSwapper transitionName="cross-fade" transitionHeight={false}
                          transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
            <img key="img1" src="/img/vista1.jpg"/>
            <img key="img2" src="/img/vista2.jpg"/>
          </ContentSwapper>

          <h2>Fade out, then fade in transition</h2>
          <ContentSwapper transitionName="cross-fade" transitionHeight={false}
                          transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
            <ContentLong key="long"/>
            <ContentShort key="short"/>
          </ContentSwapper>

          <h2>Carousel-like transition</h2>

          <div style={{width: 600}}>
            <ContentSwapper {...transitionProps} transitionName="carousel-swap" className="carousel">
              <img key="img3" src="/img/vista3.jpg"/>
              <img key="img4" src="/img/vista4.jpg"/>
            </ContentSwapper>
          </div>

        </Grid>
      </div>
    );
  }
}

export default Demo;
