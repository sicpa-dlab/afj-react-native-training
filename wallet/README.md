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
    logger: new ConsoleLogger(loglevel.debug)
  }

  const agent = new Agent(config, agentDependencies)

  await agent.initialize()

  return agent
}
```
</details>

