import React from 'react'
import { Link } from 'react-router'
import Breakpoint from 'components/Breakpoint'
import find from 'lodash/find'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'

import typography from 'utils/typography'
const { rhythm } = typography

class Template extends React.Component:
  handleTopicChange(e) =>
    this.context.router.push(e.target.value)

  render() ->
    childPages := config.docPages.map((p) =>
      page := this.props.route.pages~find((_p) => _p.path === p)
      {
        title: page.data.title
        path: page.path
      }
    )
    docOptions := childPages.map((child) =>
      <option
        key={prefixLink(child.path)}
        value={prefixLink(child.path)}
      >
        {child.title}
      </option>
    )
    docPages := childPages.map((child) =>
      isActive := prefixLink(child.path) == this.props.location.pathname

      <li
        key={child.path}
        style={{
          marginBottom: rhythm(1/2),
        }}
      >
        <Link
          to={prefixLink(child.path)}
          style={{
            textDecoration: 'none',
          }}
        >
          {isActive ? <strong>{child.title}</strong> : child.title}
        </Link>
      </li>
    )

    <div>
      <Breakpoint mobile>
        <div
          style={{
            overflowY: 'auto',
            paddingRight: `calc(${rhythm(1/2)} - 1px)`
            position: 'absolute'
            width: `calc(${rhythm(8)} - 1px)`
            borderRight: '1px solid lightgrey'
          }}
        >
          <ul
            style={{
              listStyle: 'none'
              marginLeft: 0
              marginTop: rhythm(1/2)
            }}
          >
            {docPages}
          </ul>
        </div>
        <div
          style={{
            padding: `0 ${rhythm(1)}`
            paddingLeft: `calc(${rhythm(8)} + ${rhythm(1)})`
          }}
        >
          {this.props.children}
        </div>
      </Breakpoint>
      <Breakpoint>
        <strong>Topics:</strong>
        {' '}
        <select
          defaultValue={this.props.location.pathname}
          onChange={this.handleTopicChange}
        >
          {docOptions}
        </select>
        <br />
        <br />
        {this.props.children}
      </Breakpoint>
    </div>

Template.propTypes = {
  route: React.PropTypes.object
}

Template.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Template
