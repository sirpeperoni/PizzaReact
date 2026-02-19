import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Skeleton, Typography } from "@mui/material"
import { memo, useCallback, useEffect, useMemo, useState } from "react"

import { ImageWithDimensionsIndicated } from "../../utils/image";
import { goodsApi } from "../../api/goodsApi";
import { ModalGood } from "./ModalGood";

  
export interface GoodItemInterface {
    id: string;
    title: string;
    content: string;
    price: number[];
    img: string;
}
  
interface GoodItemProps extends GoodItemInterface {
    onOpenModal: (id: string) => void;
    isOpen: boolean;
    onCloseModal: () => void;
}

const IMAGE_DIMENSIONS = {
    width: 292,
    height: 292
} as const;
  
const CARD_MAX_WIDTH = 350;


const GoodItem = memo(({ 
    id,
    title, 
    content, 
    price, 
    img,
    onOpenModal,
    isOpen,
    onCloseModal
}: GoodItemProps) => {
    
    const minPrice = () => {
        return Math.min(...price);
    }
  
    const handleOpen = () => {
        onOpenModal(id);
    }
  
    const imageUrl = useMemo(() => 
        ImageWithDimensionsIndicated({
            r: IMAGE_DIMENSIONS.width, 
            x: IMAGE_DIMENSIONS.height, 
            id: img
        }), [img]
    );
  
    return (
        <>
            <Card sx={{
                maxWidth: CARD_MAX_WIDTH,
                p: 1,
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}>
                <CardActionArea onClick={handleOpen}>
                    <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={title}
                    />
                    <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
                            {title}
                        </Typography>
                        <Typography>
                            {content}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            
                <CardActions sx={{
                    justifyContent: 'space-between',
                    px: 2.5,
                    mt: 'auto'
                }}>
                    <Typography>
                        от {minPrice()} руб.
                    </Typography>
                    <Button
                        variant="contained"
                        color="warning"
                        sx={{ borderRadius: 10 }}
                        onClick={handleOpen}
                    >
                        Выбрать
                    </Button>
                </CardActions>
            </Card>
        
            <ModalGood
                id={id}
                open={isOpen}
                handleClose={onCloseModal}
                img={img}
                title={title}
                content={content}
                priceArr={price}
            />
      </>
    );
});

interface GoodsListProps {
    goodName: string;
}
  
interface GoodsState {
    items: GoodItemInterface[];
    loading: boolean;
    error: string | null;
}
  
export const GoodsList = memo(({ goodName }: GoodsListProps) => {
    const [state, setState] = useState<GoodsState>({
        items: [],
        loading: true,
        error: null
    });
    
    const [openModalId, setOpenModalId] = useState<string | null>(null);
  
    useEffect(() => {
        let mounted = true;
  
        const fetchGoods = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }));
                const data = await goodsApi.fetchGoods(goodName);
                
                if (mounted) {
                    setState({
                        items: data,
                        loading: false,
                        error: null
                    });
                }
            } catch (error) {
                if (mounted) {
                    setState({
                        items: [],
                        loading: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }
        };
  
        fetchGoods();
  
        return () => {
            mounted = false;
        };
    }, [goodName]);
  
    const handleOpenModal = useCallback((id: string) => {
        setOpenModalId(id);
    }, []);
  
    const handleCloseModal = useCallback(() => {
        setOpenModalId(null);
    }, []);
  
    if (state.loading) {
        return <GoodsListSkeleton />;
    }
  
    if (state.error) {
        return (
            <Typography color="error" align="center">
                Ошибка: {state.error}
            </Typography>
        );
    }
  
    if (!state.items.length) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                Товары не найдены
            </Typography>
        );
    }
  
    return (
        <Grid
            container
            spacing={3}
            sx={{
                mt: 5,
                justifyContent: 'center'
            }}
        >
            {state.items.map((item) => (
                <Grid
                    key={item.id}
                >
                    <GoodItem
                        {...item}
                        onOpenModal={handleOpenModal}
                        onCloseModal={handleCloseModal}
                        isOpen={openModalId === item.id}
                    />
                </Grid>
            ))}
        </Grid>
    );
});

const GoodsListSkeleton = memo(() => (
    <Grid container spacing={3} sx={{ mt: 5 }}>
        {[...Array(4)].map((_, index) => (
            <Grid key={index}>
            <Card sx={{ maxWidth: CARD_MAX_WIDTH, p: 1 }}>
                <Skeleton variant="rectangular" height={IMAGE_DIMENSIONS.height} />
                <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="text" height={24} width="60%" />
                </CardContent>
                <CardActions>
                    <Skeleton variant="text" width={80} />
                    <Skeleton variant="rectangular" width={250} height={36} />
                </CardActions>
            </Card>
            </Grid>
        ))}
    </Grid>
));
