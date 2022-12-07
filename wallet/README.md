<p align="center">
  <picture>
   <source srcset="https://upload.wikimedia.org/wikipedia/commons/0/08/United_Nations_International_Computing_Centre_%28UNICC%29.png">
   <img alt="UNICC Logo" height="250px" />
  </picture>
</p>

<h1 align="center" ><b>UNICC Workshop Wallet</b></h1>
<br>

<p align="center">
  <a href="#getting-started">Getting started</a> |
  <a href="#agent-setup">Agent Setup</a> |
  <a href="#connection">Connections</a> |
  <a href="#credentials">Credentials</a> |
  <a href="#proofs">Proofs</a>
</p>

---

## Getting Started

```console
# Installing the dependencies
yarn install

# Prebuilding both Android and iOS
# note: the warnings displayed in this step are fine
yarn prebuild

# Building android
yarn android

# Building iOS
# note: this will only work on macOS
# note: this will throw an error as it does not work in
#       a simulator. You can launch the app with xcode
yarn ios

# Again, only required for iOS builds
open ios/UniccWalletWorkshop.xcworkspace/

# Starting the dev server
yarn start
```

## Agent Setup

<details>
<summary>Agent Setup</summary>

In this section the agent will be set up with a minimal configuration.
This can be used to make sure the agent works. For more functionality
we have to add more fields, which we will do later on.

**file**: `./src/agent.ts`

```diff
import { InitConfig, LogLevel, ConsoleLogger } from '@aries-framework/core'
import { Agent } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/react-native'

export const initializeAgent = async () => {
+ const config: InitConfig = {
+   label: 'wallet-demo-id4',
+   walletConfig: {
+     id: 'wallet-demo-id4',
+     key: 'testkey0000000000000000000000004',
+   },
+   logger: new ConsoleLogger(loglevel.debug),
+ }

  const agent = new Agent(config, agentDependencies)

+ await agent.initialize()

  return agent
}
```

</details>

## Connections

<details>
<summary>Setting up the agent</summary>

In this section we will set the agent up to work correctly with establishing connections.
We will add some fields to the configuration of the agent.

**file**: `./src/agent.ts`

```diff
  import {
    ConsoleLogger,
+   HttpOutboundTransport,
    InitConfig,
    LogLevel,
+   WsOutboundTransport,
  } from '@aries-framework/core'
  import { Agent } from '@aries-framework/core'
  import { agentDependencies } from '@aries-framework/react-native'
+ import { mediatorConnectionsInvite } from './mediator'

  export const initializeAgent = async () => {
    const config: InitConfig = {
      label: 'wallet-demo-id4',
      walletConfig: {
        id: 'wallet-demo-id4',
        key: 'testkey0000000000000000000000004',
      },
+     autoAcceptConnections: true,
      logger: new ConsoleLogger(LogLevel.off),
+     mediatorConnectionsInvite: mediatorConnectionsInvite,
    }

    const agent = new Agent(config, agentDependencies)

+   agent.registerOutboundTransport(new HttpOutboundTransport())
+   agent.registerOutboundTransport(new WsOutboundTransport())

    await agent.initialize()

    return agent
  }
```

</details>

<details>
<summary>Parsing the barcode</summary>

In this section we use a function that parses a URL to an connection invitation object.
This can be used to display information like the label, etc. It can also be used to
accept the invitation.

**file**: `./src/components/BarcodeScanner.tsx`

```diff
try {
+ const invite = ConnectionInvitationMessage.fromUrl(scannedData)
  customAlert({
    title: 'Invitation',
    message: `Received invitation from: ${invite.label}`,
    cancelOnPress: navigation.goBack,
    confirmOnPress: onAcceptInvitation,
  })
```

</details>

<details>
<summary>Accepting the invitation</summary>

In this section we accept the invitation. Note that we set `reuseConnection` to true.
This means that if we already have a connection with the other entity, we will reuse
that connection. With the new Out of Band module, we can accept both the old and the new
way of connections (connections and Out of Band).

**file**: `./src/components/BarcodeScanner.tsx`

```diff
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

+ await agent.oob.receiveInvitationFromUrl(scannedData, { reuseConnection: true }).catch(onError)

  setIsLoading(false)
  navigation.goBack()
 }
```

</details>

<details>
<summary>Deleting a connection</summary>

In this section we delete a connection. As with the proof, when deleting a connection
we do not delete the other entities record of the connection with you. We simply remove
the record from our wallet and internally we have no reference to this anymore.

**file**: `./src/hooks/useConnectionDetailsHeader.tsx`

```diff
 const deleteConnection = () => {
   const onConfirm = () => {
+    void agent.connections.deleteById(id)
     navigation.goBack()
   }

   customAlert({
     title: 'Delete',
     message: 'Are you sure you want to delete the connection?',
     confirmOnPress: onConfirm,
   })
 }
```

</details>

## Credentials

<details>
<summary>Setting up the agent</summary>

In this section we will set the agent up to work correctly with receiving credentials.
We will add some fields to the configuration of the agent.

**file**: `./src/agent.ts`

```diff
  import {
+   AutoAcceptCredential,
    ConsoleLogger,
    HttpOutboundTransport,
    InitConfig,
    LogLevel,
    WsOutboundTransport,
  } from '@aries-framework/core'
  import { Agent } from '@aries-framework/core'
  import { agentDependencies } from '@aries-framework/react-native'
+ import { GENESIS_BCORVIN_TEST_NET } from './ledgers'
  import { mediatorConnectionsInvite } from './mediator'

  export const initializeAgent = async () => {
    const config: InitConfig = {
      label: 'wallet-demo-id4',
      walletConfig: {
        id: 'wallet-demo-id4',
        key: 'testkey0000000000000000000000004',
      },
      autoAcceptConnections: true,
+     autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
+     indyLedgers: [
+       {
+         id: 'bcovrin-test-net',
+         isProduction: false,
+         genesisTransactions: GENESIS_BCORVIN_TEST_NET,
+       },
+     ],
      logger: new ConsoleLogger(LogLevel.off),
      mediatorConnectionsInvite: mediatorConnectionsInvite,
    }

    const agent = new Agent(config, agentDependencies)

    agent.registerOutboundTransport(new HttpOutboundTransport())
    agent.registerOutboundTransport(new WsOutboundTransport())

    await agent.initialize()

    return agent
  }
```

</details>

<details>
<summary>Using hooks to get credential info</summary>

In this section we use the hooks from `@aries-framework/react-hooks` in order
to get the agent and the credential data associated with the id.

**file**: `./src/pages/credentials/CredentialDetails.tsx`

```diff
useCredentialDetailsHeader(id)
+ const { agent } = useAgent()
+ const credential = useCredentialById(id)
  const formattedData = useCredentialFormatDataById(id)
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useStackNavigation()
  const { colors } = useTheme()
  const toast = useToast()
```

</details>

<details>
<summary>Declining a credential offer</summary>

In this section we add the functionality to decline a credential offer.
This can be for various reasons, mainly if the credential contains invaild data.
We could also negotiate with the issuer about the data, but this is omitted as it
can quickly create a lot of complexity in the UI.

**file**: `./src/pages/credentials/CredentialDetails.tsx`

```diff
     const onConfirm = async () => {
+      await agent.credentials.declineOffer(id)
       setIsLoading(false)
       navigation.goBack()
     }
     customAlert({
       title: 'Decline',
       message: 'Are you sure you want to decline the credential?',
       confirmOnPress: onConfirm,
     })
```

</details>

<details>
<summary>Accepting a credential offer</summary>

In this section we accept a credential offer. The API only requires the id of the record
as it is already stored when we receive the offer.

**file**: `./src/pages/credentials/CredentialDetails.tsx`

```diff
 const onAcceptCredential = async () => {
   try {
     setIsLoading(true)
+    await agent.credentials.acceptOffer({ credentialRecordId: id })
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
```

</details>

<details>
<summary>Deleting a credential</summary>

In this section we delete a credential. When the credential has been removed from
our wallet, we can not use it anymore for proof requests. This can be done if a
credential is revoked by an issuer and does not need to be there anymore.

**file**: `./src/hooks/useCredentialDetailHeader.tsx`

```diff
 const deleteCredential = () => {
   const onConfirm = () => {
+    void agent.credentials.deleteById(id)
     navigation.goBack()
   }

   customAlert({
     title: 'Delete',
     message: 'Are you sure you want to delete the credential?',
     confirmOnPress: onConfirm,
   })
 }
```

</details>

## Proofs

<details>
<summary>Setting up the agent</summary>

In this section we will set the agent up to work correctly with receiving proofs.
We will add some fields to the configuration of the agent.

**file**: `./src/agent.ts`

```diff
  import {
    AutoAcceptCredential,
+   AutoAcceptProof,
    ConsoleLogger,
    HttpOutboundTransport,
    InitConfig,
    LogLevel,
    WsOutboundTransport,
  } from '@aries-framework/core'
  import { Agent } from '@aries-framework/core'
  import { agentDependencies } from '@aries-framework/react-native'
+ import { GENESIS_BCORVIN_TEST_NET } from './ledgers'
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
+     autoAcceptProofs: AutoAcceptProof.ContentApproved,
      indyLedgers: [
        {
          id: 'bcovrin-test-net',
          isProduction: false,
          genesisTransactions: GENESIS_BCORVIN_TEST_NET,
        },
      ],
      logger: new ConsoleLogger(LogLevel.off),
      mediatorConnectionsInvite: mediatorConnectionsInvite,
    }

    const agent = new Agent(config, agentDependencies)

    agent.registerOutboundTransport(new HttpOutboundTransport())
    agent.registerOutboundTransport(new WsOutboundTransport())

    await agent.initialize()

    return agent
  }
```

<details>
<summary>Using hooks to get proof info</summary>

In this section we call the hooks from `@aries-framework/react-hooks` to
get the agent and the proof related to the `id` we receive from the routing.

**file**: `./src/pages/proofs/ProofDetails.tsx`

```diff
  const navigation = useStackNavigation()
  const { colors } = useTheme()
  const toast = useToast()
+ const { agent } = useAgent()
+ const proof = useProofById(id)
  const [fields, setFields] = useState<FormattedRequestedCredentials>([])
```

</details>

<details>
<summary>Selecting the credentials for the proof request</summary>

In this section we select the required credentials for the incoming proof request.
We call `agent.proofs.getRequestedCredentialsForProofRequest(id)` to get all the
credentials in the wallet which can be used to fulfill the proof request. Afterwards,
we call `agent.proofs.autoSelectCredentialsForProofRequest(credentials)` which will
automatically pick the first matching credentials and makes this flow a lot easier for us.
If the real world, we would let the user pick these credentials themselves, but the UI
can get quite complex for this.

**file**: `./src/pages/proofs/ProofDetails.tsx`

```diff

 useEffect(() => {
   void (async () => {
      try {
+       const credentials = await agent.proofs.getRequestedCredentialsForProofRequest(id)
+       const requestedCredentials = agent.proofs.autoSelectCredentialsForProofRequest(credentials)

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
   })()
 }, [])
```

</details>

<details>
<summary>Accepting a proof</summary>

In this section we accept the proof request. We reuse the algorithm given to us by
`@aries-framework/core`. Because we do not have any custom implementation for selecting the
credentials, this will work everytime. This is not recommended in production, and the credentials
selected by the user should also be excatly the same as used in the `agent.proofs.acceptRequest`
function.

**file**: `./src/hooks/useProofDetailHeader.tsx`

```diff
  const onAcceptProof = async () => {
    try {
+     const credentials = await agent.proofs.getRequestedCredentialsForProofRequest(id)
+     const requestedCredentials = agent.proofs.autoSelectCredentialsForProofRequest(credentials)
+     void agent.proofs.acceptRequest(id, requestedCredentials)
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
```

</details>

<details>
<summary>Deleting a proof</summary>

In this section we delete a proof. This does not mean that the receiver does not
have your data anymore. This means that the record containing the exchange, is
deleted from your local wallet.

**file**: `./src/hooks/useProofDetailHeader.tsx`

```diff
 const deleteProof = () => {
   const onConfirm = () => {
+    void agent.proofs.deleteById(id)
     navigation.goBack()
   }

   customAlert({
     title: 'Delete',
     message: 'Are you sure you want to delete the proof?',
     confirmOnPress: onConfirm,
   })
 }
```

</details>

<details>
<summary>Deleting a proof</summary>

In this section we implement the delete proof function so we can delete the proof
when we do not have the required credentials for the request.

**file**: `./src/pages/proofs/ProofDetails.tsx`

```diff
 const deleteProof = () => {
   const onConfirm = () => {
+    void agent.proofs.deleteById(id)
     navigation.goBack()
   }

   customAlert({
     title: 'Delete',
     message: 'Are you sure you want to delete the proof?',
     confirmOnPress: onConfirm,
   })
 }
```

</details>
