import React from 'react'
import { Container, Row, Col, NavBar, NavLink } from 'components/bootstrap'

fizzBuzz := {
  __html:
`fizzBuzz(n = <span class="hljs-number">100</span>) -&gt;
  [<span class="hljs-keyword">for</span> i <span class="hljs-keyword">from</span> <span class="hljs-number">1</span> thru n:
    <span class="hljs-keyword">if</span> i % <span class="hljs-number">3</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">and</span> i % <span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
      <span class="hljs-string">"fizzbuzz"</span>
    elif i % <span class="hljs-number">3</span> == <span class="hljs-number">0</span>:
      <span class="hljs-string">"fizz"</span>
    elif i % <span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
      <span class="hljs-string">"buzz"</span>
    else:
      i
  ]
`
}
fizzBuzzJS := {
  __html:
`<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">fizzBuzz</span>(<span class="hljs-params">n = <span class="hljs-number">100</span></span>) </span>{
  <span class="hljs-keyword">const</span> _arr = [];
  <span class="hljs-keyword">for</span> (<span class="hljs-keyword">let</span> i = <span class="hljs-number">0</span>; i &lt;= n; i++) {
    <span class="hljs-keyword">if</span> (i % <span class="hljs-number">3</span> === <span class="hljs-number">0</span> &amp;&amp; i % <span class="hljs-number">5</span> === <span class="hljs-number">0</span>) {
      _arr.push(<span class="hljs-string">"fizzbuzz"</span>);
    } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (i % <span class="hljs-number">3</span> === <span class="hljs-number">0</span>) {
      _arr.push(<span class="hljs-string">"fizz"</span>);
    } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (i % <span class="hljs-number">5</span> === <span class="hljs-number">0</span>) {
      _arr.push(<span class="hljs-string">"buzz"</span>);
    } <span class="hljs-keyword">else</span> {
      _arr.push(i);
    }
  }
  <span class="hljs-keyword">return</span> _arr;
}`
}

styles := {
  hero: {
    width: '100%'
    height: '100%'
    background: '#f9f5d7'
  }
  heroTitle: {
    color: '#28799f'
    textShadow: '1px 1px 1px rgba(0,0,0, .2)'
    fontSize: '3.5rem'
  }
  heroSubtitle: {
    color: '#7e8990'
  }
  codeWrapper: {
    boxShadow: '0px 0px 6px 1px rgba(0,0,0,.1)'
  }
}

Hero() ->
  <div style={styles.hero} className="py-4 mt-n1">
    <center className="pt-5 pb-3">
      <h1 style={styles.heroTitle}>LightScript</h1>
      <h4>
        <em style={styles.heroSubtitle}>
          JavaScript, with a cleaned-up syntax and a few conveniences.
        </em>
      </h4>
    </center>

    <Container>
      <Row className="justify-content-sm-center">
        <Col sm={8}>
          <center>
            <p className="lead pt-2">
              Built to make programmers more productive by zapping cruft. ⚡
            </p>
            <p className="lead pb-2">
              Implemented as a fork of Babel’s parser (babylon) wrapped in a Babel plugin.
              Fully compatible with JSX, all ES6/7 features, and the Flow static typing engine.
            </p>
            <p className="text-muted">Coming soon. A quick taste:</p>
          </center>
        </Col>
      </Row>
    </Container>
  </div>

export default () ->
  <div className="pb-6">
    <Hero />
    <Container>
      <Row className="justify-content-sm-center mt-n4">
        <Col md={5}>
          <div style={styles.codeWrapper} className="h-100">
            <pre className="mb-0 h-100">
              <code className="language-coffee" dangerouslySetInnerHTML={fizzBuzz} />
            </pre>
          </div>
        </Col>
        <Col md={5}>
          <div style={styles.codeWrapper} className="h-100">
            <pre className="mb-0 h-100">
              <code className="language-coffee" dangerouslySetInnerHTML={fizzBuzzJS} />
            </pre>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-sm-center">
        <Col sm={8}>
          <p>Completed features include:</p>
          <ul>
            <li>implicit returns</li>
            <li>optional whitespace</li>
            <li>if-expressions</li>
            <li>array comprehensions</li>
            <li>unified function declaration</li>
            <li>bound methods</li>
            <li>const shorthand</li>
            <li>automatic semicolon insertion</li>
            <li>range-based for-loops</li>
            <li>array-based for-loops</li>
            <li>commaless objects and arrays</li>
            <li>several others</li>
          </ul>

          <p>Real documentation with compelling examples is the top priority at this point. Tooling is next.</p>
          <p>
            WIP tests can be seen{' '}
            <a href="https://github.com/lightscript/babylon-lightscript/tree/lightscript/test/fixtures/lightscript">
              here
            </a>
            {' '}and{' '}
            <a href="https://github.com/lightscript/babel-plugin-lightscript/tree/master/test/fixtures">here</a>. WIP docs are <a href="https://github.com/lightscript/planning/blob/wip/docs.md">
              here
            </a>
            , though not really intended for public viewing just yet.
          </p>
        </Col>
      </Row>
    </Container>
  </div>
