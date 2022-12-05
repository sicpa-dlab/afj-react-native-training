import { Alert } from 'react-native'

type AlertProps = {
  title: string
  message?: string
  cancelText?: string
  cancelOnPress?: () => void
  confirmText?: string
  confirmOnPress?: () => void
}

export const customAlert = ({
  title,
  message,
  cancelText = 'Cancel',
  cancelOnPress,
  confirmText = 'Confirm',
  confirmOnPress,
}: AlertProps) => {
  Alert.alert(title, message, [
    { text: cancelText, onPress: cancelOnPress, style: 'destructive' },
    { text: confirmText, onPress: confirmOnPress, style: 'default' },
  ])
}
