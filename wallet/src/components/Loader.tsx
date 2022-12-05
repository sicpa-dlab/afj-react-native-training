import { Center, Modal, Spinner } from 'native-base'
import React from 'react'

export const Loader: React.FC = () => (
  <Modal isOpen={true}>
    <Center>
      <Spinner size="lg" />
    </Center>
  </Modal>
)
