import React from 'react';
import { render } from '@testing-library/react';
import GroupChatController from './GroupChatController'

test('Group Chat Screen', () => {
    const { getByText, getByTestId } = render(<GroupChatController />);
    const buttonElement = getByText(/Send/i);
    expect(buttonElement).toBeInTheDocument();

    const groupInfo = getByTestId('group-info');
    expect(groupInfo).toBeInTheDocument();

    const messages = getByTestId('messages');
    expect(messages).toBeInTheDocument();

    const groupTabs = getByTestId('group-tabs');
    expect(groupTabs).toBeInTheDocument();

    const sendText = getByTestId('send-text');
    expect(sendText).toBeInTheDocument();

    const sendBtn = getByTestId('send-btn');
    expect(sendBtn).toBeInTheDocument();
    
});


/* -- TEST CASES -- */
//test these render
// usename, groups, selected group name, users, chats
// chat from others, show name, has white color
// chats from, me is red, no name

//message textbox renders
//Mock: Click Send button makes POST call to send message, and renders the message
