import React, {useContext, useEffect, useState} from 'react';
import {config} from '../config';
import rawFile from '../ascii/intro.txt';

export const MessageContext = React.createContext();
export const useMessage = () => useContext(MessageContext);

const defaultMessages = [
  {
    type: 'info',
    message: 'Welcome to Idle Night - Demons & Dragons!',
    time: new Date(),
    color: 'gray.500',
  },
  {
    type: 'success',
    message: 'Tip: Move with W,S,A,D.',
    time: new Date(),
    color: 'cyan.500',
  },
  {
    type: 'success',
    message: 'Tip: Collect gold, wood, and rocks to build.',
    time: new Date(),
    color: 'cyan.500',
  },
  {
    type: 'info',
    message: 'Faint screams come from a cave to the north.',
    time: new Date(),
    color: 'red.500',
  },
];

export const MessageProvider = ({children}) => {
  const [messages, setMessages] = useState(defaultMessages);

  function addMessage(
    message,
    type = 'info',
    time = new Date(),
    color = 'gray.200'
  ) {
    setMessages((prevState) => {
      let newState = [...prevState];
      newState.push({message, type, time, color});
      if (newState.length > 23) newState.shift();
      return newState;
    });
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        addMessage,
      }}>
      {children}
    </MessageContext.Provider>
  );
};
