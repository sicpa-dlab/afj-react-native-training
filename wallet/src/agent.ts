import {
  AutoAcceptCredential,
  AutoAcceptProof,
  ConsoleLogger,
  HttpOutboundTransport,
  InitConfig,
  LogLevel,
  WsOutboundTransport,
} from '@aries-framework/core'
import { Agent } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/react-native'
import { GENESIS_BCORVIN_TEST_NET } from './ledgers'
import { mediatorConnectionsInvite } from './mediator'

export const initializeAgent = async () => {
  const config: InitConfig = {
    label: 'wallet-demo-id4',
    walletConfig: {
      id: 'wallet-demo-id4',
      key: 'testkey0000000000000000000000004',
    },
    autoAcceptConnections: true,
    autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
    autoAcceptProofs: AutoAcceptProof.ContentApproved,
    logger: new ConsoleLogger(LogLevel.off),

    indyLedgers: [
      {
        id: 'bcovrin-test-net',
        isProduction: false,
        genesisTransactions: GENESIS_BCORVIN_TEST_NET,
      },
    ],
    mediatorConnectionsInvite: mediatorConnectionsInvite,
  }

  const agent = new Agent(config, agentDependencies)

  agent.registerOutboundTransport(new HttpOutboundTransport())
  agent.registerOutboundTransport(new WsOutboundTransport())

  await agent.initialize()

  return agent
}
