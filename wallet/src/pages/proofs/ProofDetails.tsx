import React, { useEffect, useState } from 'react'
import { FlatList, useTheme } from 'native-base'
import { useProofDetailsHeader, useStackNavigation } from '../../hooks'
import { ProofRecord, ProofState, RequestedCredentials } from '@aries-framework/core'
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

  // IMPLEMENT
  // Here we need the agent and proof (by id), we can get them again from the hooks
  //
  // This is here so the linter will not complain
  const proof = {} as ProofRecord

  const [fields, setFields] = useState<FormattedRequestedCredentials>([])

  useEffect(() => {
    void (async () => {
      try {
        // IMPLEMENT
        // Here we need to display some data to the users related to the proof request.
        // Since we have to show what we are going to share, we must get the credentials first
        // that will be used for the proof request.
        // Luckily AFJ has some utility functions for this.
        // 1. Get the requested credentials for the proof request
        // 2. Select the first credentials that match (this should not be used in production)
        const selectedCredentials = {} as RequestedCredentials

        const formattedCredentials = formatRequestedCredentials(proof, selectedCredentials)
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
    })()
  }, [])

  const deleteProof = () => {
    const onConfirm = () => {
      // IMPLEMENT
      // Here we have to delete a proof. This does not remove the data at the verifier,
      // but only locally. This can be done by a user to clean up their wallet.
      // The function should not be awaited for a faster navigation

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
        // IMPLEMENT
        // Here we decline the proof request. This will send a message to the verifier
        // that we do not want to send our data or any other reason.

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
      // IMPLEMENT
      // Here we will accept the proof. As with the displaying of the credential data, we will
      // get the credential data again as we will use the same algorithm for selecting the credential.
      // After getting the selected credentials, like we did before, the request has to be accepted.
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
