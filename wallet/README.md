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

<details>
<summary>Parsing the barcode</summary>

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

</details>

<details>
<summary>Accepting the invitation</summary>

**file**: ./src/components/BarcodeScanner.tsx

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
<summary>Deleting a proof</summary>

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

</details>

<details>
<summary>Deleting a credential</summary>

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

</details>

<details>
<summary>Deleting a connection</summary>

**file**: ./src/hooks/useConnectionDetailsHeader.tsx

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

<details>
<summary>Using hooks to get proof info</summary>

**file**: ./src/pages/proofs/ProofDetails.tsx

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
<summary>Accepting a proof request

**file**: ./src/pages/proofs/ProofDetails.tsx

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

</details>

<details>
<summary>Deleting a proof</summary>

**file**: ./src/pages/proofs/ProofDetails.tsx

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
<summary>Using hooks to get credential info</summary>

**file**: ./src/pages/credentials/CredentialDetails.tsx

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

**file**: ./src/pages/credentials/CredentialDetails.tsx

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

**file**: ./src/pages/credentials/CredentialDetails.tsx

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

</details
