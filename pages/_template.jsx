import React from 'react'
import { Link } from 'react-router'
import { Container, Grid, Span } from 'react-responsive-grid'
import { prefixLink } from 'gatsby-helpers'
import includes from 'underscore.string/include'
import { colors, activeColors } from 'utils/colors'

import typography from 'utils/typography'
import { config } from 'config'

// Import styles.
import 'css/main.css'
import 'css/github.css'

{ rhythm, adjustFontSizeTo } := typography

styles := {
  topNavWrapper: {
    background: colors.bg
    color: colors.fg
    marginBottom: rhythm(1.5)
  }
  container: {
    maxWidth: 960
    paddingLeft: rhythm(3/4)
  }
  grid: {
    padding: `${rhythm(3/4)} 0`
  }
  gridSpan: {
    height: 24 // Ugly hack. How better to constrain height of div?
  }
  someLink: {
    textDecoration: 'none'
    color: colors.fg
    fontSize: adjustFontSizeTo('25.5px').fontSize
  }
  githubLink: {
    float: 'right'
    color: colors.fg
    textDecoration: 'none'
    marginLeft: rhythm(1/2)
  }
  navLink(isActive) -> ({
    float: 'right'
    textDecoration: 'none'
    paddingLeft: rhythm(1/2)
    paddingRight: rhythm(1/2)
    paddingBottom: rhythm(3/4)
    marginBottom: rhythm(-1)
    paddingTop: rhythm(1)
    marginTop: rhythm(-1)
    background: if isActive: activeColors.bg else: colors.bg
    color: if isActive: activeColors.fg else: colors.fg
  })
  pageWrapper: {
    maxWidth: 960
    padding: `${rhythm(1)} ${rhythm(3/4)}`
    paddingTop: 0
  }
}


TopNavBar({ location }) ->
  docsActive := includes(location.pathname, '/docs/')
  examplesActive := includes(location.pathname, '/examples/')

  <div style={styles.topNavWrapper}>
    <Container style={styles.container}>
      <Grid columns={12} style={styles.grid}>
        <Span columns={4} style={styles.gridSpan}>
          <Link to={prefixLink('/')} style={styles.someLink}>
            {config.siteTitle}
          </Link>
        </Span>

        <Span columns={8} last>
          <a href="https://github.com/lightscript/lightscript" style={styles.githubLink}>
            Github
          </a>
          <Link to={prefixLink('/examples/')} style={styles.navLink(examplesActive)}>
            Examples
          </Link>
          <Link to={prefixLink('/docs/')} style={styles.navLink(docsActive)}>
            Documentation
          </Link>
        </Span>
      </Grid>
    </Container>
  </div>

export default ({ children, location }) ->
  <div>
    <TopNavBar location={location} />

    <Container style={styles.pageWrapper}>
      {children}
    </Container>
  </div>
