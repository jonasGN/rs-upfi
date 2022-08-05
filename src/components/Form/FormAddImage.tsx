import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { FormState, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface CreateImageFormData {
  title: string;
  description: string;
}

interface ImageError {
  image: string;
  title: string;
  description: string;
}

type Validate = boolean | string;

const validateImageSize = (fileList: FileList): Validate => {
  return fileList[0].size < 10000000 || 'O arquivo deve ser menor que 10MB';
};

const validateImageFormats = (fileList: FileList): Validate => {
  const acceptedFormats = /[/.](gif|jpeg|png)$/i;
  return (
    acceptedFormats.test(fileList[0].type) ||
    'Somente são aceitos arquivos PNG, JPEG e GIF'
  );
};

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: validateImageSize,
        acceptedFormats: validateImageFormats,
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // MUTATION API POST REQUEST,
    (data: CreateImageFormData) => {
      // TODO imagem sendo adicionada ao imgBB mesmo se o formulário der erro
      return api.post('api/images', {
        title: data.title,
        description: data.description,
        url: imageUrl,
      });
    },
    {
      // ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries(['images']);
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  // const { errors } = formState as FormState<CreateImageFormData>;
  const { errors } = formState as FormState<ImageError>;

  const onSubmit = async (data: CreateImageFormData): Promise<void> => {
    try {
      // SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro',
        });
        return;
      }
      // EXECUTE ASYNC MUTATION
      await mutation.mutateAsync(data);
      // SHOW SUCCESS TOAST
      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso',
      });
    } catch {
      // SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem',
      });
    } finally {
      // CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // SEND IMAGE ERRORS
          error={errors.image}
          // REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          // SEND TITLE ERRORS
          error={errors.title}
          // REGISTER TITLE INPUT WITH VALIDATIONS
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          // SEND DESCRIPTION ERRORS
          error={errors.description}
          // REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
