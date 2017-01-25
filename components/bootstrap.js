import React from 'react'
import { Link } from 'react-router'
import cx from 'classnames'
import { compact, isEmpty } from 'lodash'

Container({ children, className, ...etc }) ->
  <div className={cx("container", className)} {...etc}>
    {children}
  </div>

Row({ children, alignItems, className, ...etc }) ->
  classes := cx("row", className, {
    [`align-items-${alignItems}`]: alignItems
  })

  <div className={classes} {...etc}>
    {children}
  </div>

Col({ children, xs, sm, md, lg, xl, className, ...etc }) ->
  classes := cx(className, {
    'col': [xs, sm, md, lg, xl]~compact()~isEmpty()
    [`col-${xs}`]: xs
    [`col-sm-${sm}`]: sm
    [`col-md-${md}`]: md
    [`col-lg-${lg}`]: lg
    [`col-xl-${xl}`]: xl
  })

  <div {...etc} className={classes}>
    {children}
  </div>

NavBar({ children, className, ...etc }) ->
  classes := cx('navbar', 'navbar', 'navbar-toggleable', className)

  <nav className={classes} {...etc}>
    {children}
  </nav>

NavLink({ children, to, href, isActive, className, ...etc }) ->
  classes := cx('nav-item', 'nav-link', { active: isActive }, className)

  if href:
    <a href={href} className={classes} {...etc}>
      {children}
    </a>
  else:
    <Link to={to} className={classes} {...etc}>
      {children}
    </Link>

Nav({ children, className, ...etc }) ->
  <ul className={cx("nav flex-column", className)} {...etc}>
    {children}
  </ul>

export { Container, Row, Col, NavBar, NavLink, Nav }
