import { useAgent } from '@aries-framework/react-hooks'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { customAlert, formatSchemaName } from '../utils'
import { useStackNavigation } from './navigation'
import { useCredentialFormatDataById } from './useCredentialFormatData'

export const useCredentialDetailsHeader = (id: string) => {
  const navigation = useStackNavigation()
  const formattedData = useCredentialFormatDataById(id)
  const { agent } = useAgent()

  const name = formatSchemaName(formattedData.offer?.indy?.schema_id)

  const deleteCredential = () => {
    const onConfirm = () => {
      // ========= IMPLEMENT =========
      void agent.credentials.deleteById(id)
      // ========= IMPLEMENT =========
      navigation.goBack()
    }

    customAlert({
      title: 'Delete',
      message: 'Are you sure you want to delete the credential?',
      confirmOnPress: onConfirm,
    })
  }

  useEffect(() => {
    navigation.setOptions({
      title: name ?? 'Unknown credential',
      headerShown: true,
      headerRight: () => (
        <Ionicons name="trash-outline" size={24} onPress={deleteCredential} />
      ),
    })
  }, [])
}
