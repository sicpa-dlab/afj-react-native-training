import React, { PropsWithChildren } from 'react'
import { Box, HStack, Pressable, VStack, Text } from 'native-base'

type ListItemProps = {
  title: string
  subtitle: string
  subtitleColor?: string
  onPress?: () => void
}

export const RecordListItem: React.FC<PropsWithChildren<ListItemProps>> = ({
  title,
  subtitle,
  onPress,
  subtitleColor = 'coolGray.600',
  children,
}) => (
  <Pressable onPress={onPress}>
    <Box
      _dark={{
        borderColor: 'gray.600',
      }}
      borderColor="coolGray.100"
      p="2"
    >
      <HStack space={2}>
        <Box>{children}</Box>
        <VStack borderBottomWidth="1" borderBottomColor="gray.100" flex={1} justifyContent="center">
          <Text
            _dark={{
              color: 'warmGray.50',
            }}
            color="coolGray.800"
            fontSize={18}
            fontWeight={500}
          >
            {title}
          </Text>
          <Text
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
  </Pressable>
)
