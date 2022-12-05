import React, { PropsWithChildren } from 'react'
import { Box, HStack, Pressable, VStack, Text } from 'native-base'

type ListItemProps = {
  title: string
  subtitle: string
  label: string
  subtitleColor?: string
  onPress?: () => void
}

export const CredentialItem: React.FC<PropsWithChildren<ListItemProps>> = ({
  title,
  subtitle,
  label,
  onPress,
  subtitleColor = 'coolGray.600',
  children,
}) => (
  <Pressable onPress={onPress}>
    <Box
      _dark={{
        borderColor: 'gray.600',
      }}
      m="2"
      rounded="xl"
      backgroundColor="gray.100"
      borderColor="coolGray.100"
      p="4"
      height="32"
    >
      <VStack flex={1} justifyContent="space-between">
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
              py={1}
            >
              {label}
            </Text>
          </VStack>
        </HStack>
        <HStack width="100%" justifyContent="flex-end">
          <Text
            color={subtitleColor}
            fontSize={12}
            _dark={{
              color: 'warmGray.200',
            }}
          >
            {`${subtitle.charAt(0).toUpperCase()}${subtitle.slice(1)}`.replace(
              '-',
              ' '
            )}
          </Text>
        </HStack>
      </VStack>
    </Box>
  </Pressable>
)
