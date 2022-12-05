const getDefaultConfig = require('@expo/metro-config').getDefaultConfig

const root = __dirname

const defaultConfig = getDefaultConfig(root)

defaultConfig.resolver.sourceExts = ['js', 'json', 'ts', 'tsx', 'cjs']

module.exports = defaultConfig
