import React from 'react'
import cx from 'classnames'
import { StickyContainer, Sticky } from 'react-sticky'
import Waypoint from 'react-waypoint'
import { Container, Row, Col, NavLink } from 'components/bootstrap'
import find from 'lodash/find'
import last from 'lodash/last'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'

import remark from 'remark'
import toc from 'remark-toc'
import slug from 'remark-slug'
import remarkReactRenderer from 'remark-react'
import rawDocs from '!raw!./docs.md'


Nav({ children }) ->
  <ul className="nav flex-column">
    {children}
  </ul>

// HACK; TODO write a custom remark markdown parser or something
getSectionIdFromH2Id(children: Array<string|object>) ->
  nodes := children.filter(child => child != '\n')
  if nodes.length != 2: return null
  link := nodes.0.props.children.0
  href := link.props.href
  href.replace('#', '')

class NavLi extends React.Component:
  constructor() ->
    this.sectionId = getSectionIdFromH2Id(this.props.children)

  render() ->
    { children } := this.props
    { activeSections } := this.context

    isActive := if this.sectionId: activeSections.has(this.sectionId)
    classes := cx("nav-item", { active: isActive })

    <li className={classes}>
      {children}
    </li>
NavLi.contextTypes = {
  activeSections: React.PropTypes.object.isRequired
}

NavLiLink({ children, to, href }) ->
  classes := cx("nav-link", "text-muted")

  if href:
    <a href={href} className={classes}>{children}</a>
  else:
    <Link to={to} className={classes}>{children}</Link>


// HACK - should probably build a remark-plugin to do this instead
ScrollGroup({ children: flatChildren, onEnter, onLeave }) ->
  sections := []
  for child of flatChildren:
    if child.type == 'h2':
      id := `section-${child.props.id}`
      children := [child]
      newSection := { id, children }
      sections.push(newSection)
    else:
      if sections.length < 1: sections.push({ id: 'first', children: [] })
      currentSection := sections~last()
      currentSection.children.push(child)

  <div key="scroll-group">
    {sections.map(section =>
      _onEnter() -> onEnter(section.id)
      _onLeave() -> onLeave(section.id)

      <Waypoint onEnter={_onEnter} onLeave={_onLeave} key={section.id}>
        <section id={section.id}>
          {section.children}
        </section>
      </Waypoint>
    )}
  </div>

markdownWithTOC := remark()
  .use(toc)
  .process(rawDocs)
  .contents

split := markdownWithTOC.split('\n## ')
tocMD := split[0].replace('## TOC\n', '')
docMD := '## ' + split.slice(1).join('\n## ')

TableOfContents := remark()
  .use(remarkReactRenderer, {
    remarkReactComponents: {
      ul: Nav
      li: NavLi
      a: NavLiLink
    }
  })
  .process(tocMD)
  .contents

DocsContents := remark()
  .use(slug)
  .use(remarkReactRenderer, {
    sanitize: { clobber: ["name"] }
    remarkReactComponents: {
      // h2: DocSection
    }
  })
  .process(docMD)
  .contents

class Docs extends React.Component:
  constructor() ->
    this.state = {
      activeSections: new Set()
    }

  getChildContext() ->
    { activeSections: this.state.activeSections }

  removeSectionFromId(sectionId) ->
    sectionId.replace('section-', '')

  // TODO: debug why fat-arrows aren't working
  onEnter(sectionId): void ->
    { activeSections } := this.state
    id := this.removeSectionFromId(sectionId)
    activeSections.add(id)
    this.setState({ activeSections })

  onLeave(sectionId): void ->
    { activeSections } := this.state
    id := this.removeSectionFromId(sectionId)
    activeSections.delete(id)
    this.setState({ activeSections })

  render() ->
    <Container className="py-5">
      <StickyContainer>
        <Row>
          <Col sm={3}>
            <Sticky className="px-4 pt-2 docs-ref-toc">
              {TableOfContents}
            </Sticky>
          </Col>

          <Col className="px-5 py-2 docs-ref-docs">
            <ScrollGroup onEnter={(id) => this.onEnter(id)} onLeave={(id) => this.onLeave(id)}>
              {DocsContents.props.children}
            </ScrollGroup>
          </Col>
        </Row>
      </StickyContainer>
    </Container>

Docs.childContextTypes = {
  activeSections: React.PropTypes.object
}

export default Docs
