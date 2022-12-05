import { useAgent, useProofById } from '@aries-framework/react-hooks'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { customAlert } from '../utils'
import { useStackNavigation } from './navigation'

export const useProofDetailsHeader = (id: string) => {
  const navigation = useStackNavigation()
  const record = useProofById(id)
  const { agent } = useAgent()

  const deleteProof = () => {
    const onConfirm = () => {
      // ========= IMPLEMENT =========
      void agent.proofs.deleteById(id)
      // ========= IMPLEMENT =========
      navigation.goBack()
    }

    customAlert({
      title: 'Delete',
      message: 'Are you sure you want to delete the proof?',
      confirmOnPress: onConfirm,
    })
  }

  useEffect(() => {
    navigation.setOptions({
      title: record.requestMessage.indyProofRequest.name ?? 'Unknown proof',
      headerShown: true,
      headerRight: () => (
        <Ionicons name={'trash-outline'} size={24} onPress={deleteProof} />
      ),
    })
  }, [])
}
