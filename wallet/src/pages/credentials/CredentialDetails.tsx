import React, { useState } from 'react'
import { FlatList, useTheme } from 'native-base'
import {
  useCredentialDetailsHeader,
  useCredentialFormatDataById,
  useStackNavigation,
} from '../../hooks'
import { useAgent, useCredentialById } from '@aries-framework/react-hooks'
import { CredentialState } from '@aries-framework/core'
import { SafeAreaView } from 'react-native'
import { useToast } from 'native-base'
import { DoubleButton, ListItem, Loader } from '../../components'
import { customAlert } from '../../utils'

export type CredentialDetailsRouteParams = {
  id: string
}

type CredentialDetailsProps = {
  route: { params: CredentialDetailsRouteParams }
}

export const CredentialDetails: React.FC<CredentialDetailsProps> = ({
  route,
}) => {
  const {
    params: { id },
  } = route

  useCredentialDetailsHeader(id)
  // ========= IMPLEMENT =========
  const { agent } = useAgent()
  const credential = useCredentialById(id)
  const formattedData = useCredentialFormatDataById(id)
  // ========= IMPLEMENT =========

  const [isLoading, setIsLoading] = useState(false)
  const navigation = useStackNavigation()
  const { colors } = useTheme()
  const toast = useToast()

  if (isLoading) return <Loader />

  if (!credential || !formattedData) {
    toast.show({
      placement: 'top',
      title: 'Something went wrong while fetching the credential',
      background: colors.error[500],
    })
    navigation.goBack()
    return
  }

  const attributes: Record<string, string> = {}
  formattedData?.offerAttributes?.forEach(
    ({ name, value }) => (attributes[name] = value)
  )

  const onDeclineCredential = () => {
    try {
      setIsLoading(true)
      const onConfirm = async () => {
        // ========= IMPLEMENT =========
        await agent.credentials.declineOffer(id)
        // ========= IMPLEMENT =========
        setIsLoading(false)
        navigation.goBack()
      }
      customAlert({
        title: 'Decline',
        message: 'Are you sure you want to decline the credential?',
        confirmOnPress: onConfirm,
      })
    } catch (e) {
      setIsLoading(false)
      toast.show({
        placement: 'top',
        title: 'Something went wrong while declining the credential',
        background: colors.error[500],
      })
      navigation.goBack()
      throw e
    }
  }

  const onAcceptCredential = async () => {
    try {
      setIsLoading(true)
      // ========= IMPLEMENT =========
      await agent.credentials.acceptOffer({ credentialRecordId: id })
      // ========= IMPLEMENT =========
    } catch (e) {
      toast.show({
        placement: 'top',
        title: 'Something went wrong while accepting the credential',
        background: colors.error[500],
      })
      throw e
    }
    setIsLoading(false)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={Object.entries(attributes)}
        renderItem={({ item }) => (
          <ListItem title={item[0]} subtitle={item[1]} />
        )}
        keyExtractor={(item) => item[0]}
      />
      {credential.state === CredentialState.OfferReceived && (
        <DoubleButton
          onDecline={onDeclineCredential}
          onAccept={onAcceptCredential}
        />
      )}
    </SafeAreaView>
  )
}
