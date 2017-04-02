import { render } from 'react-dom';
import { createElement } from 'react';

import App from './containers/App';

(() => {
  let RootComponent = App;
  
  function main() {
    render(
      createElement(RootComponent, {}),
      document.getElementById('main')
    );
  }
  
  if (module.hot) {
    module.hot.accept('./containers/App', () => {
      RootComponent = require('./containers/App').default;
      main();
    });
  }
  
  main();
})();
