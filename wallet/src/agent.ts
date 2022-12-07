import { InitConfig } from '@aries-framework/core'
import { Agent } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/react-native'

// IMPLEMENT
// During the workshop we will add a couple of configuration options
// to the agent.
//
// tip: If you want more logging, you can set the `loglevel` to `trace`
//      once you have added it after the first `agent setup` section
export const initializeAgent = async () => {
  const config: InitConfig = {
    label: 'TODO',
  }

  const agent = new Agent(config, agentDependencies)

  return agent
}
