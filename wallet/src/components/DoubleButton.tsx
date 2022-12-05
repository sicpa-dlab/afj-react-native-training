import { Box, Text, Button } from 'native-base'
import React from 'react'

type DoubleButtonProps = {
  onDecline: () => void
  onAccept: () => void
}

export const DoubleButton: React.FC<DoubleButtonProps> = ({
  onDecline,
  onAccept,
}) => (
  <Box flexDir="row" h={75} margin="2">
    <Button
      onPress={onDecline}
      flex={1}
      borderRadius="2xl"
      m="2"
      backgroundColor="coolGray.100"
    >
      <Text color="black" fontWeight="600" fontSize="lg">
        Decline
      </Text>
    </Button>
    <Button
      onPress={onAccept}
      flex={1}
      borderRadius="2xl"
      m="2"
      backgroundColor="black"
    >
      <Text color="white" fontWeight="600" fontSize="lg">
        Accept
      </Text>
    </Button>
  </Box>
)
