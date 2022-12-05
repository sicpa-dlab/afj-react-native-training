import React from 'react'
import { FlatList } from 'native-base'
import { useConnectionDetailsHeader } from '../../hooks'
import { useConnectionById } from '@aries-framework/react-hooks'
import { SafeAreaView } from 'react-native'
import { RecordListItem } from '../../components'

export type ConnectionDetailsRouteParams = {
  id: string
}

type ConnectionDetailProps = {
  route: { params: ConnectionDetailsRouteParams }
}

export const ConnectionDetails: React.FC<ConnectionDetailProps> = ({
  route,
}) => {
  const {
    params: { id },
  } = route
  useConnectionDetailsHeader(id)

  const record = useConnectionById(id)

  return (
    <SafeAreaView>
      <FlatList
        data={Object.entries(record)}
        renderItem={({ item: [key, value] }) => (
          <RecordListItem title={key} subtitle={JSON.stringify(value)} />
        )}
      />
    </SafeAreaView>
  )
}
