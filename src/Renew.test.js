import React from 'react';
import ReactDOM from 'react-dom';
import Renew from './Renew';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Renew />, div);
  ReactDOM.unmountComponentAtNode(div);
});
