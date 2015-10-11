import React from 'react';
import { Navbar, NavBrand, Nav, NavItem, Grid } from 'react-bootstrap';

import ContentSwapper from './ContentSwapper.jsx';


function Demo() {
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
        <ContentSwapper {...transitionProps} transitionName="cross-fade"/>

        <h2>Fade out, then fade in transition</h2>
        <ContentSwapper {...transitionProps} transitionName="wait-fade"/>

        <h2>Carousel-like transition</h2>
        <ContentSwapper {...transitionProps} transitionName="carousel"/>

      </Grid>
    </div>
  );
}

export default Demo;
