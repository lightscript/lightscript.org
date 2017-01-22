import React from 'react'
import { Link } from 'react-router'
import find from 'lodash/find'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'

import typography from 'utils/typography'
const { rhythm } = typography

styles := {
  navWrapper: {
    overflowY: 'auto',
    paddingRight: `calc(${rhythm(1/2)} - 1px)`
    position: 'absolute'
    width: `calc(${rhythm(8)} - 1px)`
    borderRight: '1px solid lightgrey'
  }
  leftNav: {
    listStyle: 'none'
    marginLeft: 0
    marginTop: rhythm(1/2)
  }
  content: {
    padding: `0 ${rhythm(1)}`
    paddingLeft: `calc(${rhythm(8)} + ${rhythm(1)})`
  }
  docPageLinkLi: {
    marginBottom: rhythm(1/2),
  }
  docPageLink: {
    textDecoration: 'none'
  }
}

getChildPages(pages) ->
  config.docPages.map((p) =>
    page := pages~find((_p) => _p.path === p)
    {
      title: page.data.title
      path: page.path
    }
  )

DocPageLink({ child, location }) ->
  isActive := prefixLink(child.path) == location.pathname

  <li style={styles.docPageLinkLi}>
    <Link to={prefixLink(child.path)} style={styles.docPageLink}>
      {if isActive:
        <strong>{child.title}</strong>
      else:
        child.title
      }
    </Link>
  </li>

Template({ route: { pages }, location, children }) ->
  <div>
    <div style={styles.navWrapper}>
      <ul style={styles.leftNav}>
        {[for child of getChildPages(pages):
          <DocPageLink child={child} location={location} key={child.path} />
        ]}
      </ul>
    </div>

    <div style={styles.content}>
      {children}
    </div>
  </div>

Template.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Template
