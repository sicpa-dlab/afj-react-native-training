import React, { useState, useEffect } from 'react'
import { Text, Center, useTheme } from 'native-base'
import { StyleSheet } from 'react-native'
import { BarCodeScanner as ExpoBarCodeScanner } from 'expo-barcode-scanner'
import { useStackNavigation } from '../hooks'
import { ConnectionInvitationMessage } from '@aries-framework/core'
import { useToast } from 'native-base'
import { useAgent } from '@aries-framework/react-hooks'
import { Loader } from './Loader'
import { customAlert } from '../utils'

export const BarcodeScanner = () => {
  const navigation = useStackNavigation()
  const toast = useToast()
  const { agent } = useAgent()
  const { colors } = useTheme()

  const [hasPermission, setHasPermission] = useState(null)
  const [scannedData, setScannedData] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onAcceptInvitation = async () => {
    setIsLoading(true)
    const onError = (e: unknown) => {
      toast.show({
        placement: 'top',
        title: 'Something went wrong while accepting the invitation',
        background: colors.error[500],
      })
      throw e
    }

    // IMPLEMENT
    // At this point we validated data and we can receive the invitation on the agent
    // tip: check the agent modules related to connections (connections and oob)
    //      for help
    // Bonus points if you can reuse the connection if it already exists.

    setIsLoading(false)
    navigation.goBack()
  }

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await ExpoBarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getBarCodeScannerPermissions()
  }, [])

  useEffect(() => {
    if (!scannedData) return

    try {
      // IMPLEMENT
      // Here we have to parse the scanned QR code to an instance of `ConnectionInvitationMessage `.
      //
      // This is here so the linter will not complain
      const invite = {} as ConnectionInvitationMessage
      customAlert({
        title: 'Invitation',
        message: `Received invitation from: ${invite.label}`,
        cancelOnPress: navigation.goBack,
        confirmOnPress: onAcceptInvitation,
      })
    } catch {
      toast.show({
        placement: 'top',
        title: 'Invalid invitation',
        background: colors.error[500],
      })
      navigation.goBack()
      return
    }
  }, [scannedData])

  if (isLoading || hasPermission === null) return <Loader />

  if (hasPermission === false) {
    return (
      <Center height="full">
        <Text>No access to camera</Text>
      </Center>
    )
  }

  return (
    <Center flex={1}>
      <ExpoBarCodeScanner
        onBarCodeScanned={scannedData ? undefined : ({ data }) => setScannedData(data)}
        style={StyleSheet.absoluteFill}
      />
    </Center>
  )
}
