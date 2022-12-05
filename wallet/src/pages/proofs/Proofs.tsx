import { FlatList } from 'native-base'
import React from 'react'
import { useProofs } from '@aries-framework/react-hooks'
import { useStackNavigation } from '../../hooks'
import { NoContent, ListItem, Loader } from '../../components'

export const Proofs = () => {
  const { records, loading } = useProofs()
  const navigation = useStackNavigation()

  if (loading) return <Loader />

  if (records.length === 0) {
    return <NoContent title="You have zero proofs" />
  }

  const onShowDetails = (id: string) => {
    navigation.navigate('ProofDetails', { id })
  }

  return (
    <FlatList
      data={records}
      renderItem={({ item: proof }) => (
        <ListItem
          title={proof.requestMessage?.indyProofRequest.name ?? 'Unknown proof'}
          subtitle={proof.state.replace('-', ' ')}
          onPress={() => onShowDetails(proof.id)}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  )
}
