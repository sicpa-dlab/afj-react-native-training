import { useConnections } from '@aries-framework/react-hooks'
import { Ionicons } from '@expo/vector-icons'
import { FlatList, useTheme, Text, Box, Center, Image } from 'native-base'
import React from 'react'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import { NoContent, ListItem, Loader } from '../../components'
import { useStackNavigation } from '../../hooks'
import { labelToLetters } from '../../utils'

export const Connections = () => {
  const navigation = useStackNavigation()
  const { records, loading } = useConnections()
  const { colors } = useTheme()

  if (loading) return <Loader />

  const onShowDetails = (id: string) =>
    navigation.navigate('ConnectionDetails', { id })

  const noContent = <NoContent title="You have zero connections" />

  const connectionsList = (
    <FlatList
      data={records}
      renderItem={({ item }) => (
        <ListItem
          title={item.theirLabel ?? 'Unknown Contact'}
          subtitle={item.state.replace('-', ' ')}
          onPress={() => onShowDetails(item.id)}
        >
          <Center
            style={{ height: 50, width: 50, borderRadius: 100 }}
            backgroundColor={item.imageUrl ? colors.white : '#F5F5F4'}
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                size="xs"
                alt="connection-image"
              />
            ) : (
              <Text fontWeight={600}>{labelToLetters(item.theirLabel)}</Text>
            )}
          </Center>
        </ListItem>
      )}
      keyExtractor={(item) => item.id}
    />
  )

  return (
    <SafeAreaView>
      <Box height="100%">
        {records.length === 0 ? noContent : connectionsList}

        <TouchableOpacity
          onPress={() => navigation.navigate('BarcodeScanner')}
          style={{
            justifyContent: 'center',
            margin: 16,
            borderRadius: 100,
            alignItems: 'center',
            width: 60,
            height: 60,
            backgroundColor: colors.primary[300],
            shadowColor: '#5b5b5b',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 3,
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        >
          <Ionicons
            size={24}
            style={{ color: colors.text[50] }}
            name="qr-code-outline"
          />
        </TouchableOpacity>
      </Box>
    </SafeAreaView>
  )
}
