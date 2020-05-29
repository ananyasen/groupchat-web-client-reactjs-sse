import React from 'react';
import { render } from '@testing-library/react';
import JoinChat from './JoinChat'

test('Login Screen', async (done) => {
    const { getByText, getByTestId } = render(<JoinChat />);
    const buttonElement = getByText(/Join the DoorDash Chat!/i);
    expect(buttonElement).toBeInTheDocument();

    const username = getByTestId('login-text')
    expect(username).toBeInTheDocument();

    done()
});