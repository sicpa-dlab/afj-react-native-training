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
  <a href="#snippets">Snippets</a> |
</p>

---

## Getting Started

```console
# Installing the dependencies
yarn install

# Prebuilding both Android and iOS
yarn prebuild

# Building android
yarn android

# Building iOS
yarn ios

# Starting the dev server
yarn start
```

## Snippets

<details>
<summary>Agent Setup</summary>

In this section the agent will be set up with a minimal configuration.
This can be used to make sure the agent works. For more functionality
we have to add more fields, which we will do later on.

**file**: `./src/agent.ts`

```ts
import { InitConfig, LogLevel, ConsoleLogger } from '@aries-framework/core'
import { Agent } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/react-native'

export const initializeAgent = async () => {
  const config: InitConfig = {
    label: 'wallet-demo-id4',
    walletConfig: {
      id: 'wallet-demo-id4',
      key: 'testkey0000000000000000000000004',
    },
    logger: new ConsoleLogger(loglevel.debug),
  }

  const agent = new Agent(config, agentDependencies)

  await agent.initialize()

  return agent
}
```

</details>

**file**: ./src/components/BarcodeScanner.tsx

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

**file**: ./src/hooks/useProofDetailHeader.tsx

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

**file**: ./src/hooks/useCredentialDetailHeader.tsx

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

**file**: ./src/hooks/useConnectionDetailsHeader.tsx

```diff
 const deleteConnection = () => {
   const onConfirm = () => {
+     void agent.connections.deleteById(id)
     navigation.goBack()
   }

   customAlert({
     title: 'Delete',
     message: 'Are you sure you want to delete the connection?',
     confirmOnPress: onConfirm,
   })
 }
```

**file**: ./src/pages/proofs/ProofDetails.tsx

```diff
  const navigation = useStackNavigation()
  const { colors } = useTheme()
  const toast = useToast()
+ const { agent } = useAgent()
+ const proof = useProofById(id)
  const [fields, setFields] = useState<FormattedRequestedCredentials>([])
```

```diff

 useEffect(() => {
   void (async () => {
      try {
+       const creds = await agent.proofs.getRequestedCredentialsForProofRequest(id)
+       const requestedCredentials = agent.proofs.autoSelectCredentialsForProofRequest(creds)

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
