import { Center, Text } from 'native-base'
import React from 'react'

type NoContentProps = {
  title: string
}

export const NoContent: React.FC<NoContentProps> = ({ title }) => {
  return (
    <Center flex={1}>
      <Text fontWeight={500} size={38} textAlign="center" width="100%">
        {title}
      </Text>
    </Center>
  )
}
