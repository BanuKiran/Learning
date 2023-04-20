import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import ChatInput from './ChatInput';
import ChatWindow from './ChatWindow';

const Chat = () => {
  const [chat, setChat] = useState<string[]>([]);
  const latestChat = useRef(['']);

  latestChat.current = chat;

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5025/hubs/chat')
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then((result) => {
        console.log('Connected!');

        connection.on('ReceiveMessage', (message) => {
          const updatedChat = [...latestChat.current];
          updatedChat.push(message);

          setChat(updatedChat);
        });
      })
      .catch((e) => console.log('Connection failed: ', e));
  }, []);

  const sendMessage = async (user: any, message: any) => {
    const chatMessage = {
      user: user,
      message: message,
    };

    try {
      await fetch('http://localhost:5025/chat/messages', {
        method: 'POST',
        body: JSON.stringify(chatMessage),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      console.log('Sending message failed.', e);
    }
  };

  return (
    <div>
      <ChatInput sendMessage={sendMessage} />
      <hr />
      <ChatWindow chat={chat} />
    </div>
  );
};

export default Chat;
