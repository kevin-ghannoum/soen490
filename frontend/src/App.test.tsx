import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';

test('initial test to test the framework', () => {
  expect(1).toBe(1);
});
