import React from 'react';
import ReactDOM from 'react-dom';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

jest.mock('./App', () => {
  return () => <div>MyApp</div>;
});

it('should bootstrap app correctly', () => {
  const renderSpy = jest.spyOn(ReactDOM, 'render');
  require('./index');
  expect(renderSpy).toHaveBeenCalled();
});
