import React from 'react';
import {StackDivider, Text, VStack} from '@chakra-ui/react';
import {useMessage} from '../providers/MessageProvider';

function Message({message}) {
  if (!message.color) message.color = 'gray.500';
  return (
    <Text fontSize={'xx-small'} textAlign={'left'} color={message.color}>
      {message.message}
    </Text>
  );
}

export function MessageFeed() {
  const message = useMessage();

  return (
    <VStack
      spacing={1}
      alignItems={'flex-start'}
      divider={<StackDivider borderColor="#222" />}>
      {message.messages.map((message, i) => (
        <Message message={message} key={i} />
      ))}
    </VStack>
  );
}
