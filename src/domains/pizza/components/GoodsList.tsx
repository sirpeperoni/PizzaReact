import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ImageWithDimensionsIndicated } from '../../../shared/utils/image';
import { ModalGood } from './ModalGood';
import { usePizzaStore } from '../stores/usePizzaStore';

export interface GoodItemInterface {
  id: string;
  title: string;
  content: string;
  price: number[];
  img: string;
  sizes: string[];
  dough: string[];
}

interface GoodItemProps extends GoodItemInterface {
  onOpenModal: (id: string) => void;
  onCloseModal: () => void;
}

const IMAGE_DIMENSIONS = {
  width: 292,
  height: 292,
} as const;

const CARD_MAX_WIDTH = 350;

const GoodItem = memo(({ id, title, content, price, img, onOpenModal }: GoodItemProps) => {
  const minPrice = () => {
    return Math.min(...price);
  };

  const handleOpen = () => {
    onOpenModal(id);
  };

  const imageUrl = useMemo(
    () =>
      ImageWithDimensionsIndicated({
        r: IMAGE_DIMENSIONS.width,
        x: IMAGE_DIMENSIONS.height,
        id: img,
      }),
    [img],
  );

  return (
    <>
      <Card
        sx={{
          maxWidth: CARD_MAX_WIDTH,
          p: 1,
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}>
        <CardActionArea onClick={handleOpen}>
          <CardMedia component='img' image={img} alt={title} />
          <CardContent>
            <Typography variant='h5' sx={{ fontWeight: 'bold' }} gutterBottom>
              {title}
            </Typography>
            <Typography>{content}</Typography>
          </CardContent>
        </CardActionArea>

        <CardActions
          sx={{
            justifyContent: 'space-between',
            px: 2.5,
            mt: 'auto',
          }}>
          <Typography>от {minPrice()} руб.</Typography>
          <Button variant='contained' color='warning' sx={{ borderRadius: 10 }} onClick={handleOpen}>
            Выбрать
          </Button>
        </CardActions>
      </Card>

      {/*<ModalGood*/}
      {/*  id={id}*/}
      {/*  open={isOpen}*/}
      {/*  handleClose={onCloseModal}*/}
      {/*  img={img}*/}
      {/*  title={title}*/}
      {/*  content={content}*/}
      {/*  priceArr={price}*/}
      {/*  sizes={sizes}*/}
      {/*  dough={dough}*/}
      {/*/>*/}
    </>
  );
});

interface GoodsListProps {
  goodName: string;
}

export const GoodsList = memo(({ goodName }: GoodsListProps) => {
  const pizza = usePizzaStore();
  const [open, setOpen] = useState(false);
  // const [openModalId, setOpenModalId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        await pizza.fetchGoods(goodName);
      } catch (error) {}
    };

    fetchGoods();
  }, [goodName]);

  const handleOpenModal = (id: string) => {
    setOpen(true);
    pizza.defineCurrentItem(id);
  };

  const handleCloseModal = useCallback(() => {
    setOpen(false);
  }, []);

  if (pizza.loading) {
    return <GoodsListSkeleton />;
  }

  if (pizza.error) {
    return (
      <Typography color='error' align='center'>
        Ошибка: {pizza.error}
      </Typography>
    );
  }

  if (!pizza.goods.length) {
    return (
      <Typography align='center' sx={{ mt: 5 }}>
        Товары не найдены
      </Typography>
    );
  }

  return (
    <>
      <Grid
        container
        spacing={3}
        sx={{
          mt: 5,
          justifyContent: 'center',
        }}>
        {pizza.goods.map(item => (
          <Grid key={item.id} container>
            <GoodItem {...item} onOpenModal={handleOpenModal} onCloseModal={handleCloseModal} />
          </Grid>
        ))}
      </Grid>
      <ModalGood open={open} handleClose={handleCloseModal} data={pizza.currentItem} />
    </>
  );
});

const GoodsListSkeleton = memo(() => (
  <Grid container spacing={3} sx={{ mt: 5 }}>
    {[...Array(4)].map((_, index) => (
      <Grid key={index}>
        <Card sx={{ maxWidth: CARD_MAX_WIDTH, p: 1 }}>
          <Skeleton variant='rectangular' height={IMAGE_DIMENSIONS.height} />
          <CardContent>
            <Skeleton variant='text' height={32} />
            <Skeleton variant='text' height={24} />
            <Skeleton variant='text' height={24} width='60%' />
          </CardContent>
          <CardActions>
            <Skeleton variant='text' width={80} />
            <Skeleton variant='rectangular' width={250} height={36} />
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
));
