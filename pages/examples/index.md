---
title: Modules used on this site
---

A real documentation site would have live examples here. But since this
site isn't documenting anything real, here's the list of modules used on
this site.

* [React](https://facebook.github.io/react/docs/)
* [GatsbyJS](https://github.com/gatsbyjs/gatsby)
* [TypographyJS](https://kyleamathews.github.io/typography.js/#/)
* [React Router](https://github.com/rackt/react-router)
* [Underscore.String](http://epeli.github.io/underscore.string/)
* [React Responsive Grid](http://kyleamathews.github.io/react-responsive-grid/#/)
* [Color Pairs Picker](http://kyleamathews.github.io/color-pairs-picker/)
* [React Document Title](https://github.com/gaearon/react-document-title)
* [Lodash](https://lodash.com/)

```js
function fizzBuzz(n = 100) {
  const _arr = [];
  for (let i = 0; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      _arr.push("fizzbuzz");
    } else if (i % 3 === 0) {
      _arr.push("fizz");
    } else if (i % 5 === 0) {
      _arr.push("buzz");
    } else {
      _arr.push(i);
    }
  }
  return _arr;
}
```
