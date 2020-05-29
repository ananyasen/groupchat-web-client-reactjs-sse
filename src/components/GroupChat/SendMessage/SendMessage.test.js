import React from 'react';
import { render } from '@testing-library/react';
import SendMessage from './SendMessage'

test('SendMessage', async (done) => {
    const {container, getByText, getByTestId} = render(<SendMessage/>);
    const buttonElement = getByText(/Send/i);
    expect(buttonElement).toBeInTheDocument();

    expect(container).toMatchSnapshot()

    done()
})