import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure();

  // SELECTED IMAGE URL STATE
  const [focusedImgUrl, setFocusedImgUrl] = useState('');

  // FUNCTION HANDLE VIEW IMAGE
  const handleOpenImageView = (url: string): void => {
    setFocusedImgUrl(url);
    onOpen();
  };

  const handleCloseImageView = (): void => {
    setFocusedImgUrl('');
    onClose();
  };

  return (
    <>
      {/* CARD GRID */}
      <SimpleGrid minChildWidth={280} spacing="10">
        {cards.map(card => (
          <Card key={card.id} data={card} viewImage={handleOpenImageView} />
        ))}
      </SimpleGrid>

      {/* MODALVIEWIMAGE */}
      <ModalViewImage
        isOpen={isOpen}
        imgUrl={focusedImgUrl}
        onClose={handleCloseImageView}
      />
    </>
  );
}
