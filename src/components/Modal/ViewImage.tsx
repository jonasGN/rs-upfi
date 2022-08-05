import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  ModalCloseButton,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // MODAL WITH IMAGE AND EXTERNAL LINK
  // TODO MANTER A PROPORÇÃO DA IMAGEM DE ACORDO COM A PRIMEIRA MEDIDA MÁXIMA
  // A SER ATINGIDA

  return (
    <Modal closeOnEsc isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        height="auto"
        width="auto"
        maxHeight={600}
        maxWidth={900}
        borderRadius="10"
        backgroundColor="pGray.800"
      >
        <ModalCloseButton />
        <ModalBody padding="0">
          <Image
            src={imgUrl}
            width="max"
            height="max"
            maxWidth={900}
            maxHeight={600}
            objectFit="cover"
          />
        </ModalBody>
        <ModalFooter
          borderBottomRadius="6"
          justifyContent="start"
          paddingBlock="2"
          paddingInline="2.5"
        >
          <Link href={imgUrl} target="_blank" fontSize="sm">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
