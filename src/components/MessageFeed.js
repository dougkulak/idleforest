import React from 'react';
import {Box, StackDivider, Text, VStack} from '@chakra-ui/react';

function Message({message}) {
  if (!message.color) message.color = 'gray.500';
  return (
    <Text fontSize={'xs'} textAlign={'left'} color={message.color}>
      {message.message}
    </Text>
  );
}

const messages = [
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
    message: 'Faint screams can be heard from a nearby cave.',
    time: new Date(),
    color: 'red.500',
  },
];

export function MessageFeed() {
  return (
    <VStack
      spacing={1}
      alignItems={'flex-start'}
      divider={<StackDivider borderColor="#222" />}>
      {messages.map((message, i) => (
        <Message message={message} key={i} />
      ))}
    </VStack>
  );
}
