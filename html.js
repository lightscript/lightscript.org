import React from 'react'
import DocumentTitle from 'react-document-title'

import { prefixLink } from 'gatsby-helpers'
import { TypographyStyle, GoogleFont } from 'react-typography'
import typography from './utils/typography'
import { colors } from 'utils/colors'

BUILD_TIME := new Date().getTime()

export default HTML({ body }) ->
  title := DocumentTitle.rewind()

  css := if process.env.NODE_ENV == 'production':
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
      <TypographyStyle typography={typography} />
      <GoogleFont typography={typography} />
      {css}
      <style
        dangerouslySetInnerHTML={{
          __html:
            `
              a {
                color: ${colors.bg};
              }
              .ball-0 {
                background-image: url(${prefixLink('/docs/some-react-code/0.jpg')});
              }
              .ball-1 {
                background-image: url(${prefixLink('/docs/some-react-code/1.jpg')});
              }
              .ball-2 {
                background-image: url(${prefixLink('/docs/some-react-code/2.jpg')});
              }
              .ball-3 {
                background-image: url(${prefixLink('/docs/some-react-code/3.jpg')});
              }
              .ball-4 {
                background-image: url(${prefixLink('/docs/some-react-code/4.jpg')});
              }
              .ball-5 {
                background-image: url(${prefixLink('/docs/some-react-code/5.jpg')});
              }
            `,
        }}
      />
    </head>
    <body>
      <div id="react-mount" dangerouslySetInnerHTML={{ __html: body }} />
      <script src={prefixLink(`/bundle.js?t=${BUILD_TIME}`)} />
    </body>
  </html>
