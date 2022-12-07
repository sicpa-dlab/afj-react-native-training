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

    // ========= IMPLEMENT =========
    await agent.oob.receiveInvitationFromUrl(scannedData, { reuseConnection: true }).catch(onError)
    // ========= IMPLEMENT =========

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
      // ========= IMPLEMENT =========
      const invite = ConnectionInvitationMessage.fromUrl(scannedData)
      // ========= IMPLEMENT =========
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
