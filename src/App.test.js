import React from 'react';
import { render } from '@testing-library/react';
import App from './App'

test('renders App', async (done) => {
  const { getByText } = render(<App />);
  const buttonElement = getByText(/Join the DoorDash Chat!/i);
  expect(buttonElement).toBeInTheDocument();

  done()
});