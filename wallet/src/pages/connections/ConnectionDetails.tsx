import React from 'react'
import { FlatList } from 'native-base'
import { useConnectionDetailsHeader } from '../../hooks'
import { SafeAreaView } from 'react-native'
import { RecordListItem } from '../../components'
import { ConnectionRecord } from '@aries-framework/core'

export type ConnectionDetailsRouteParams = {
  id: string
}

type ConnectionDetailProps = {
  route: { params: ConnectionDetailsRouteParams }
}

export const ConnectionDetails: React.FC<ConnectionDetailProps> = ({ route }) => {
  const {
    params: { id },
  } = route
  useConnectionDetailsHeader(id)

  // IMPLEMENT
  // here we would like to get the connection record from the id we received from
  // the routing
  const record = {} as ConnectionRecord

  return (
    <SafeAreaView>
      <FlatList
        data={Object.entries(record)}
        renderItem={({ item: [key, value] }) => <RecordListItem title={key} subtitle={JSON.stringify(value)} />}
      />
    </SafeAreaView>
  )
}
