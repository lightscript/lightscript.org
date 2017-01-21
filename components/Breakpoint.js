import React, { Component } from 'react'
import './breakpoints.css'

class Breakpoint extends Component:
  render() ->
    { mobile, children } := this.props

    if mobile:
      <div className="breakpoint-min-width-700">
        {children}
      </div>
    else:
      <div className="breakpoint-max-width-700">
        {children}
      </div>

Breakpoint.propTypes = {
  children: React.PropTypes.array
  mobile: React.PropTypes.bool
}

export default Breakpoint
