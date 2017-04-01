import { render } from 'react-dom';
import { createElement } from 'react';

import App from './containers/App';

render(
  createElement(App, {}),
  document.getElementById('main')
);
