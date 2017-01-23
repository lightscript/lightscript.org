import React from 'react'
import { Link } from 'react-router'
import { Container, Row, Col, NavBar, NavLink } from 'components/bootstrap'
import { prefixLink } from 'gatsby-helpers'
import includes from 'underscore.string/include'
import cx from 'classnames'

import { config } from 'config'

import 'css/github.css'
import 'css/app.scss'

styles := {
  navBar: {
    // backgroundColor: '#DAF3FF'
    // borderBottom: '1px solid #CBE2EC'
  }
}


TopNavBar({ location }) ->
  docsActive := includes(location.pathname, '/docs/')
  examplesActive := includes(location.pathname, '/examples/')

  <NavBar className="justify-content-md-center row navbar-light mb-1" style={styles.navBar}>
    <Col xs={6}>
      <Link to={prefixLink('/')} className='navbar-brand'>
        {config.siteTitle}
      </Link>
    </Col>

    <Col xs={'auto'} className="navbar-nav float-right">
      <NavLink to={prefixLink('/docs/')} isActive={docsActive}>
        Documentation
      </NavLink>
      <NavLink to={prefixLink('/examples/')} isActive={examplesActive}>
        Examples
      </NavLink>
      <NavLink href="https://github.com/lightscript/lightscript">
        Github
      </NavLink>
    </Col>
  </NavBar>

export default ({ children, location }) ->
  <div>
    <TopNavBar location={location} />
    {children}
  </div>
