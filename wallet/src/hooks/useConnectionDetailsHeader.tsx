import { useAgent, useConnectionById } from '@aries-framework/react-hooks'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { customAlert } from '../utils'
import { useStackNavigation } from './navigation'

export const useConnectionDetailsHeader = (id: string) => {
  const navigation = useStackNavigation()
  const record = useConnectionById(id)
  const { agent } = useAgent()

  const deleteConnection = () => {
    const onConfirm = () => {
      // ========= IMPLEMENT =========
      void agent.connections.deleteById(id)
      // ========= IMPLEMENT =========
      navigation.goBack()
    }

    customAlert({
      title: 'Delete',
      message: 'Are you sure you want to delete the connection?',
      confirmOnPress: onConfirm,
    })
  }
  useEffect(() => {
    navigation.setOptions({
      title: record.theirLabel ?? 'Unknown Contact',
      headerShown: true,
      headerRight: () => (
        <Ionicons name={'trash-outline'} size={24} onPress={deleteConnection} />
      ),
    })
  }, [])
}
