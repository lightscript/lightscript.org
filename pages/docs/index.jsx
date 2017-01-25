import React from 'react'
import cx from 'classnames'
import { StickyContainer, Sticky } from 'react-sticky'
import Waypoint from 'react-waypoint'
import { Container, Row, Col, NavLink, Nav } from 'components/bootstrap'
import find from 'lodash/find'
import last from 'lodash/last'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'

import remark from 'remark'
import toc from 'remark-toc'
import slug from 'remark-slug'
import markdownToReact from 'util/markdownToReact'
import mainDocsTraverser from 'util/mainDocsTraverser'
import tocTraverser from 'util/tocTraverser'
import rawDocs from '!raw!./docs.md'

{ TableOfContents, DocsContents } := convertDocsMarkdownToReact()

class Docs extends React.Component:
  constructor() ->
    this.state = {
      activeSections: new Set()
    }

  getChildContext() ->
    { activeSections } := this.state
    // TODO: debug why fat-arrows aren't working
    onEnter(id) => this.onEnter(id)
    onLeave(id) => this.onLeave(id)

    { activeSections, onEnter, onLeave }

  onEnter(sectionId): void ->
    { activeSections } := this.state
    activeSections.add(sectionId)
    this.setState({ activeSections })

  onLeave(sectionId): void ->
    { activeSections } := this.state
    activeSections.delete(sectionId)
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
            {DocsContents}
          </Col>
        </Row>
      </StickyContainer>
    </Container>

Docs.childContextTypes = {
  activeSections: React.PropTypes.object
  onEnter: React.PropTypes.func
  onLeave: React.PropTypes.func
}

export default Docs


TocSection({ children, section }, { activeSections }) ->
  isActive := if section: activeSections.has(section)
  classes := cx("nav-item", { active: isActive })

  <li className={classes}>
    {children}
  </li>

TocSection.contextTypes = {
  activeSections: React.PropTypes.object.isRequired
}


ScrollTargetSection({ section, id, children }, { onEnter, onLeave }) ->
  sectionId := id.replace('section-', '')
  _onEnter() -> onEnter(sectionId)
  _onLeave() -> onLeave(sectionId)

  <Waypoint onEnter={_onEnter} onLeave={_onLeave}>
    <section id={id}>
      {children}
    </section>
  </Waypoint>

ScrollTargetSection.contextTypes = {
  onEnter: React.PropTypes.func.isRequired
  onLeave: React.PropTypes.func.isRequired
}


convertDocsMarkdownToReact() ->
  markdownWithTOC := remark()
    .use(toc)
    .process(rawDocs)
    .contents

  // HACK; shouldn't need to double-process this way
  split := markdownWithTOC.split('\n## ')
  tocMD := split[0].replace('## TOC\n', '')
  docMD := '## ' + split.slice(1).join('\n## ')

  TableOfContents := remark()
    .use(markdownToReact, {
      traverse: tocTraverser
      remarkReactComponents: {
        ul: Nav
        TocSection: TocSection
        a: NavLink
      }
    })
    .process(tocMD)
    .contents

  DocsContents := remark()
    .use(slug)
    .use(markdownToReact, {
      sanitize: { clobber: ["name"] }
      traverse: mainDocsTraverser
      remarkReactComponents: {
        section: ScrollTargetSection
      }
    })
    .process(docMD)
    .contents
    .props.children

  { TableOfContents, DocsContents }
