import React from 'react'
import DocumentTitle from 'react-document-title'

import { prefixLink } from 'gatsby-helpers'

BUILD_TIME = new Date().getTime()

export default HTML({ body }) ->
  title = DocumentTitle.rewind()

  css = if process.env.NODE_ENV == 'production':
    <style dangerouslySetInnerHTML={{ __html: require('!raw!./public/styles.css') }} />

  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>{title}</title>
      <link rel="stylesheet" href="//code.cdn.mozilla.net/fonts/fira.css" />
      {css}
    </head>
    <body>
      <div id="react-mount" dangerouslySetInnerHTML={{ __html: body }} />
      <script src={prefixLink(`/bundle.js?t=${BUILD_TIME}`)} />
    </body>
  </html>
