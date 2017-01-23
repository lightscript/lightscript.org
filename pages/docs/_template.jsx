import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky';
import { Container, Row, Col, NavLink } from 'components/bootstrap'
import find from 'lodash/find'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'

styles := {
  borderRight: {
    borderRight: '1px solid #efefef'
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

DocsPageLink({ child, location }) ->
  isActive := prefixLink(child.path) == location.pathname

  <NavLink to={prefixLink(child.path)} isActive={isActive} className="text-muted">
    {child.title}
  </NavLink>

Docs({ route: { pages }, location, children }) ->
  <Container className="pb-15">
    <StickyContainer>
      <Row>
        <Col sm={3}>
          <Sticky className="px-4 pt-2" style={styles.borderRight}>
            <ul className="nav flex-column">
              {[for child of getChildPages(pages):
                <DocsPageLink child={child} location={location} key={child.path} />
              ]}
            </ul>
          </Sticky>
        </Col>

        <Col className="px-5 py-2">
          {children}
        </Col>
      </Row>
    </StickyContainer>
  </Container>

export default Docs
