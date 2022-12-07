import React, { useEffect, useState } from 'react'
import { FlatList, useTheme } from 'native-base'
import { useProofDetailsHeader, useStackNavigation } from '../../hooks'
import { useAgent, useProofById } from '@aries-framework/react-hooks'
import { ProofState } from '@aries-framework/core'
import { SafeAreaView } from 'react-native'
import { useToast } from 'native-base'
import { formatRequestedCredentials, FormattedRequestedCredentials } from '../../utils/formatRequestedCredentials'
import { DoubleButton, ListItem } from '../../components'
import { customAlert } from '../../utils'

export type ProofDetailsRouteParams = {
  id: string
}

type ProofDetailsProps = {
  route: { params: ProofDetailsRouteParams }
}

export const ProofDetails: React.FC<ProofDetailsProps> = ({ route }) => {
  const {
    params: { id },
  } = route

  useProofDetailsHeader(id)

  const navigation = useStackNavigation()
  const { colors } = useTheme()
  const toast = useToast()

  // ========= IMPLEMENT =========
  const { agent } = useAgent()
  const proof = useProofById(id)
  // ========= IMPLEMENT =========
  const [fields, setFields] = useState<FormattedRequestedCredentials>([])

  useEffect(() => {
    void (async () => {
      // ========= IMPLEMENT =========
      try {
        const credentials = await agent.proofs.getRequestedCredentialsForProofRequest(id)
        const requestedCredentials = agent.proofs.autoSelectCredentialsForProofRequest(credentials)

        const formattedCredentials = formatRequestedCredentials(proof, requestedCredentials)
        if (formattedCredentials.length === 0) {
          deleteProof()
        } else {
          setFields(formattedCredentials)
        }
      } catch (e) {
        toast.show({
          placement: 'top',
          title: e.toString(),
          background: colors.error[500],
        })
        deleteProof()
      }
      // ========= IMPLEMENT =========
    })()
  }, [])

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

  const onDeclineProof = () => {
    try {
      const onConfirm = async () => {
        await agent.proofs.declineRequest(id)
        navigation.goBack()
      }
      customAlert({
        title: 'Decline',
        message: 'Are you sure you want to decline the proof?',
        confirmOnPress: onConfirm,
      })
    } catch (e) {
      toast.show({
        placement: 'top',
        title: 'Something went wrong while declining the proof',
        background: colors.error[500],
      })
      navigation.goBack()
      throw e
    }
  }

  const onAcceptProof = async () => {
    try {
      const creds = await agent.proofs.getRequestedCredentialsForProofRequest(id)
      const requestedCredentials = agent.proofs.autoSelectCredentialsForProofRequest(creds)
      void agent.proofs.acceptRequest(id, requestedCredentials)
    } catch (e) {
      toast.show({
        placement: 'top',
        title: 'Something went wrong while accepting the proof',
        background: colors.error[500],
      })
      throw e
    }
    navigation.goBack()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={fields}
        keyExtractor={(item) => item.name}
        renderItem={({ item: { name, value, isPredicate } }) => (
          <ListItem title={name} subtitle={value} subtitleColor={isPredicate ? 'success.500' : 'coolGray.600'} />
        )}
      />
      {proof.state === ProofState.RequestReceived && (
        <DoubleButton onAccept={onAcceptProof} onDecline={onDeclineProof} />
      )}
    </SafeAreaView>
  )
}
