const withEntitlementsPlist = require('@expo/config-plugins').withEntitlementsPlist

const withRemoveiOSNotificationEntitlement = (config) => {
  return withEntitlementsPlist(config, (mod) => {
    delete mod.modResults['aps-environment']
    return mod
  })
}

const config = {
  name: 'Unicc Wallet - Workshop',
  slug: 'unicc-workshop-wallet',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-screen.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  plugins: ['@animo-id/indy-sdk-expo-plugin', [withRemoveiOSNotificationEntitlement]],
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'unicc.workshop.wallet',
    infoPlist: {
      NSCameraUsageDescription: 'This app uses the camera to scan invitations.',
    },
  },
  android: {
    permissions: ['CAMERA'],
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'unicc.workshop.wallet',
  },
  web: {
    favicon: './assets/favicon.png',
  },
}

export default config
