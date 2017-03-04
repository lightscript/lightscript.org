const ReactGA = require('react-ga')
ReactGA.initialize('UA-27324389-2')

exports.onRouteUpdate = function () {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}
