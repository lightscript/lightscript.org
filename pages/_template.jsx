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


export default ({ children, location }) ->
  docsActive := includes(location.pathname, '/docs/')
  examplesActive := includes(location.pathname, '/examples/')


  <div>
    <div
      style={{
        background: colors.bg
        color: colors.fg
        marginBottom: rhythm(1.5)
      }}
    >
      <Container
        style={{
          maxWidth: 960
          paddingLeft: rhythm(3/4)
        }}
      >
        <Grid
          columns={12}
          style={{
            padding: `${rhythm(3/4)} 0`
          }}
        >
          <Span
            columns={4}
            style={{
              height: 24 // Ugly hack. How better to constrain height of div?
            }}
          >
            <Link
              to={prefixLink('/')}
              style={{
                textDecoration: 'none'
                color: colors.fg
                fontSize: adjustFontSizeTo('25.5px').fontSize
              }}
            >
              {config.siteTitle}
            </Link>
          </Span>
          <Span columns={8} last>
            <a
              style={{
                float: 'right'
                color: colors.fg
                textDecoration: 'none'
                marginLeft: rhythm(1/2)
              }}
              href="https://github.com/gatsbyjs/gatsby"
            >
              Github
            </a>
            <Link
              to={prefixLink('/examples/')}
              style={{
                background: if examplesActive: activeColors.bg else: colors.bg
                color: if examplesActive: activeColors.fg else: colors.fg
                float: 'right'
                textDecoration: 'none'
                paddingLeft: rhythm(1/2)
                paddingRight: rhythm(1/2)
                paddingBottom: rhythm(3/4)
                marginBottom: rhythm(-1)
                paddingTop: rhythm(1)
                marginTop: rhythm(-1)
              }}
            >
              Examples
            </Link>
            <Link
              to={prefixLink('/docs/')}
              style={{
                background: if docsActive: activeColors.bg else: colors.bg
                color: if docsActive: activeColors.fg else: colors.fg
                float: 'right'
                textDecoration: 'none'
                paddingLeft: rhythm(1/2)
                paddingRight: rhythm(1/2)
                paddingBottom: rhythm(3/4)
                marginBottom: rhythm(-1)
                paddingTop: rhythm(1)
                marginTop: rhythm(-1)
              }}
            >
              Documentation
            </Link>
          </Span>
        </Grid>
      </Container>
    </div>
    <Container
      style={{
        maxWidth: 960
        padding: `${rhythm(1)} ${rhythm(3/4)}`
        paddingTop: 0
      }}
    >
      {children}
    </Container>
  </div>
