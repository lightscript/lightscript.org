import React from 'react'
import ReactDOM from 'react-dom'
import { Spring } from 'react-motion'
import range from 'lodash/range'

import './ball-faces.css'

export default class Demo extends React.Component:
  constructor() ->
    this.state = {
      left: 0
      right: 0
      mouse: [250, 300]
    }

  componentDidMount(): void ->
    rect := ReactDOM.findDOMNode(this).getBoundingClientRect()
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      left: rect.left
      top: rect.top
    })

    // LSC TODO: find out why on earth this had to be here instead of constructor()
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.getValues = this.getValues.bind(this)

  getValues(currentPositions) ->
    // No currentPositions means it's the first render for Spring
    if not currentPositions:
      return { val: range(6).map(() => [0, 0]) }

    // hack. We're getting the currentPositions of the previous ball, but in
    // reality it's not really the "current" position. It's the last render's.
    // If we want to get the real current position, we'd have to compute it
    // now, then read into it now. This gets very tedious with this API.
    endValue := currentPositions.val.map((_, i) =>
      if i == 0:
        this.state.mouse
      else:
        currentPositions.val[i - 1]
    )

    { val: endValue, config: [120, 17] }

  handleMouseMove({ pageX, pageY }): void ->
    this.setState({ mouse: [
      pageX - this.state.left
      pageY - this.state.top
    ]})

  handleTouchMove({ touches }): void ->
    this.handleMouseMove(touches[0])

  render() ->
    <Spring endValue={this.getValues}>
      {({ val }) =>
        <div
          style={{ height: 400 }}
          className="demo1"
          onMouseMove={this.handleMouseMove}
          onTouchMove={this.handleTouchMove}
        >
          {val.map(([x, y], i) =>
            <div
              key={i}
              className={`demo1-ball ball-${i}`}
              style={{
                WebkitTransform: `translate3d(${x - 25}px, ${y - 25}px, 0)`
                transform: `translate3d(${x - 25}px, ${y - 25}px, 0)`
                zIndex: val.length - i
              }}
            />
          )}
        </div>
      }
    </Spring>
