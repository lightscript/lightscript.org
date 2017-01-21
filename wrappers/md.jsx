import React from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'

export default ({ route }) ->
  post := route.page.data

  <DocumentTitle title={`${post.title} | ${config.siteTitle}`}>
    <div className="markdown">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.body }} />
    </div>
  </DocumentTitle>
