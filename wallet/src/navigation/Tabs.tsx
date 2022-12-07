import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'native-base'
import { Proofs } from '../pages/proofs'
import { Credentials } from '../pages/credentials'
import { Connections } from '../pages/connections'
import { TabParamList } from './navigation'
import { useCredentialByState, useProofByState } from '@aries-framework/react-hooks'
import { CredentialState, ProofState } from '@aries-framework/core'

const getTabOptions = (iconName: 'wallet' | 'people' | 'documents', badge: number = 0): BottomTabNavigationOptions => {
  const { colors } = useTheme()
  return {
    headerTitleStyle: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.black,
    },
    headerTitleAlign: 'left',
    headerStyle: {
      height: 100,
      elevation: 0,
      shadowOpacity: 0,
    },
    tabBarStyle: {
      height: 80,
      backgroundColor: '#F5F5F4',
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
    },
    tabBarBadge: badge ? badge.toString() : undefined,
    tabBarBadgeStyle: {
      top: 10,
    },
    tabBarShowLabel: false,
    tabBarIcon: ({ focused }) => (
      <Ionicons name={iconName} size={32} color={focused ? colors.primary[300] : colors.text[300]} />
    ),
  }
}

export const Tabs = () => {
  const Tab = createBottomTabNavigator<TabParamList>()

  const pendingCredentialOffers = useCredentialByState(CredentialState.OfferReceived).length
  const pendingCredentialRequest = useCredentialByState(CredentialState.RequestReceived).length

  const pendingProofRequest = useProofByState(ProofState.RequestReceived).length
  const pendingProofProposal = useProofByState(ProofState.ProposalReceived).length

  return (
    <Tab.Navigator initialRouteName="Credentials">
      <Tab.Screen name="Contacts" component={Connections} options={getTabOptions('people')} />
      <Tab.Screen
        name="Credentials"
        component={Credentials}
        options={getTabOptions('wallet', pendingCredentialOffers + pendingCredentialRequest)}
      />
      <Tab.Screen
        name="Proofs"
        component={Proofs}
        options={getTabOptions('documents', pendingProofRequest + pendingProofProposal)}
      />
    </Tab.Navigator>
  )
}
