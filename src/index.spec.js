import React from 'react';
import ReactDOM from 'react-dom';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

jest.doMock('./App', () => {
  return () => <div>MyApp</div>;
});

test('should bootstrap app correctly', () => {
  const renderSpy = jest.spyOn(ReactDOM, 'render');
  require('./index');
  expect(renderSpy).toHaveBeenCalled();
});
