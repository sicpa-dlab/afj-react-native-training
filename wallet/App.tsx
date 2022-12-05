import 'expo-dev-client'

import React, { useEffect, useState } from 'react'
import AgentProvider from '@aries-framework/react-hooks'
import { initializeAgent } from './src/agent'
import { Agent } from '@aries-framework/core'
import { NativeBaseProvider } from 'native-base'
import { customTheme } from './src/theme'
import { NavigationContainer } from '@react-navigation/native'
import { Stack } from './src/navigation'
import CredentialFormatDataProvider from './src/hooks/useCredentialFormatData'

export default function app() {
  const [agent, setAgent] = useState<Agent>()

  useEffect(() => {
    void (async () => setAgent(await initializeAgent()))()
  }, [])

  return (
    <NativeBaseProvider theme={customTheme}>
      <AgentProvider agent={agent}>
        <CredentialFormatDataProvider agent={agent}>
          <NavigationContainer
            theme={{
              dark: false,
              colors: {
                background: customTheme.colors.white,
                border: customTheme.colors.gray[500],
                card: customTheme.colors.white,
                notification: customTheme.colors.error[500],
                primary: customTheme.colors.primary[300],
                text: customTheme.colors.text[500],
              },
            }}
          >
            <Stack />
          </NavigationContainer>
        </CredentialFormatDataProvider>
      </AgentProvider>
    </NativeBaseProvider>
  )
}
