import React, { PropsWithChildren } from 'react'
import { Box, HStack, VStack, Text } from 'native-base'
import { TouchableOpacity } from 'react-native'

type ListItemProps = {
  title: string
  subtitle: string
  subtitleColor?: string
  onPress?: () => void
}

export const ListItem: React.FC<PropsWithChildren<ListItemProps>> = ({
  title,
  subtitle,
  onPress,
  subtitleColor = 'coolGray.600',
  children,
}) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress}>
    <Box
      _dark={{
        borderColor: 'gray.600',
      }}
      borderColor="coolGray.100"
      pl="4"
      py="2"
    >
      <HStack space={2}>
        <Box>{children}</Box>
        <VStack flex={1} justifyContent="center">
          <Text
            _dark={{
              color: 'warmGray.50',
            }}
            color="coolGray.800"
            fontWeight={500}
            fontSize={16}
          >
            {title}
          </Text>
          <Text
            fontSize={16}
            color={subtitleColor}
            _dark={{
              color: 'warmGray.200',
            }}
            pb={2}
          >
            {subtitle.charAt(0).toUpperCase() + subtitle.slice(1)}
          </Text>
        </VStack>
      </HStack>
    </Box>
  </TouchableOpacity>
)
