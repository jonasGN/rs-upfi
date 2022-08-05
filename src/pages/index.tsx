import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Image {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface ImagesResponse {
  data: Image[];
  after?: string;
}

const fetchImages = async ({ pageParam = null }): Promise<ImagesResponse> => {
  const response = await api.get('api/images', {
    params: { after: pageParam },
  });
  return response.data as ImagesResponse;
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // AXIOS REQUEST WITH PARAM
    fetchImages,
    // GET AND RETURN NEXT PAGE PARAM
    {
      getNextPageParam: lastPage => lastPage?.after ?? null,
    }
  );

  const formattedData = useMemo(() => {
    // FORMAT AND FLAT DATA ARRAY
    // const pages = data?.pages.map(page => page.data);
    // const items = pages?.map(item => item);
    const items = data?.pages.flatMap(page => page.data.flat());

    return items;
  }, [data]);

  // RENDER LOADING SCREEN
  if (isLoading) return <Loading />;

  // RENDER ERROR SCREEN
  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button type="button" marginTop="10" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
