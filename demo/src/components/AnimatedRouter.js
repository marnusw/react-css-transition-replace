/* eslint-disable react/no-multi-comp */
import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import ReactCSSTransitionReplace from '../../../src/ReactCSSTransitionReplace.jsx'

const Home = () => (
  <div>
    <h2>Home</h2>
    <img src="img/vista3.jpg" width="600" height="255"/>
  </div>
)

const One = () => (
  <div>
    <h2>One</h2>
    <img src="img/vista4.jpg" width="600" height="280"/>
  </div>
)

const Two = () => (
  <div>
    <h2>Two</h2>
    <img src="img/vista2.jpg" width="600" height="290"/>
  </div>
)

const AnimatedRouter = () => (
  <Router>
    <div className="router-example">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/one">One</Link></li>
        <li><Link to="/two">Two</Link></li>
        <li><Link to="/three">Three (no match)</Link></li>
      </ul>

      <hr/>

      <Route render={({location}) => (
        <ReactCSSTransitionReplace
          transitionName="fade-fast"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <div key={location.pathname}>
            <Switch location={location}>
              <Route path="/" exact component={Home}/>
              <Route path="/one" component={One}/>
              <Route path="/two" component={Two}/>
            </Switch>
          </div>
        </ReactCSSTransitionReplace>
      )}/>

      <hr/>
    </div>
  </Router>
)

export default AnimatedRouter
