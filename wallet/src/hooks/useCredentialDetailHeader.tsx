import { Ionicons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { customAlert, formatSchemaName } from '../utils'
import { useStackNavigation } from './navigation'
import { useCredentialFormatDataById } from './useCredentialFormatData'

export const useCredentialDetailsHeader = (id: string) => {
  const navigation = useStackNavigation()
  const formattedData = useCredentialFormatDataById(id)

  const name = formatSchemaName(formattedData.offer?.indy?.schema_id)

  const deleteCredential = () => {
    const onConfirm = () => {
      // IMPLEMENT
      // Here we would like to delete the credential on the agent.

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
      headerRight: () => <Ionicons name="trash-outline" size={24} onPress={deleteCredential} />,
    })
  }, [])
}
