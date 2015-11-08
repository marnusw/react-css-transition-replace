import React from 'react';
import { Navbar, NavBrand, Nav, NavItem, Grid } from 'react-bootstrap';

import ContentSwapper from './ContentSwapper.jsx';

import ContentLong from './ContentLong.jsx';
import ContentShort from './ContentShort.jsx';

class Demo extends React.Component {

  componentDidMount() {
    const images = [
      '/img/vista1.jpg',
      '/img/vista2.jpg',
      '/img/vista3.jpg',
      '/img/vista4.jpg'
    ];

    images.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }

  render() {
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
          <ContentSwapper transitionName="cross-fade" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
            <img key="img1" src="/img/vista1.jpg" width="600" height="235"/>
            <img key="img2" src="/img/vista2.jpg" width="600" height="280"/>
          </ContentSwapper>

          <h2>Fade out, then fade in transition</h2>
          <ContentSwapper transitionName="fade-wait" transitionEnterTimeout={1000} transitionLeaveTimeout={400}>
            <ContentLong key="long"/>
            <ContentShort key="short"/>
          </ContentSwapper>

          <h2>Carousel transition</h2>
          <ContentSwapper transitionName="carousel-swap" transitionEnterTimeout={500} transitionLeaveTimeout={500}
                          style={{width: 600}}>
            <img key="img3" src="/img/vista3.jpg" width="600" height="255"/>
            <img key="img4" src="/img/vista4.jpg" width="600" height="280"/>
          </ContentSwapper>

        </Grid>
      </div>
    );
  }
}

export default Demo;
