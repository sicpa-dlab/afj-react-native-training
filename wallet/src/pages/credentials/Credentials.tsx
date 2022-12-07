import { useConnections, useCredentials } from '@aries-framework/react-hooks'
import { Ionicons } from '@expo/vector-icons'
import { Box, FlatList, useTheme, Image, Center, Spinner } from 'native-base'
import React from 'react'
import { NoContent, CredentialItem } from '../../components'
import { useCredentialsFormatData, useStackNavigation } from '../../hooks'
import { formatSchemaName } from '../../utils'

export const Credentials = () => {
  const { colors } = useTheme()
  const { records: connections, loading: loadingConnections } = useConnections()
  const { records: credentials, loading: loadingCredentials } = useCredentials()
  const { formattedData, loading: loadingFormattedData } = useCredentialsFormatData()
  const navigation = useStackNavigation()

  const onShowDetails = async (id: string) => {
    navigation.navigate('CredentialDetails', {
      id,
    })
  }

  if (loadingConnections || loadingCredentials || loadingFormattedData) {
    return (
      <Center height="full">
        <Spinner />
      </Center>
    )
  }

  if (credentials.length === 0) {
    return <NoContent title="You have zero credentials" />
  }

  return (
    <FlatList
      p="2"
      data={credentials}
      renderItem={({ item: credential, index }) => {
        let name: string
        const data = formattedData[index]
        if (data) {
          name = formatSchemaName(data.offer?.indy?.schema_id)
        }
        const connection = connections.find((c) => c.id === credential.connectionId)
        const issuer = connection?.theirLabel ?? 'Unknown issuer'
        return (
          <CredentialItem
            onPress={() => onShowDetails(credential.id)}
            title={name}
            subtitle={credential.state}
            label={issuer}
          >
            <Box p={2} mr={2} backgroundColor="white" rounded="xl">
              {connection?.imageUrl ? (
                <Image
                  size="xs"
                  source={{
                    uri: connection.imageUrl,
                  }}
                  alt="Logo"
                  p={3}
                />
              ) : (
                <Ionicons size={32} name="document-attach" color={colors.gray[500]} />
              )}
            </Box>
          </CredentialItem>
        )
      }}
      keyExtractor={({ id }) => id}
    />
  )
}
