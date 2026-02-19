import { Box, Button, Dialog, DialogContent, IconButton, List, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { ImageWithDimensionsIndicated } from "../../utils/image";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { addToCart, clearCart } from "../../store/cartSlice";


interface ModalGoodInterface {
    id?: string,
    open: boolean,
    handleClose: () => void,
    img: string,
    title: string,
    content: string,
    priceArr: number[],
}

const PIZZA_SIZES = [
    { value: '0', label: '20 см', index: 0 },
    { value: '1', label: '25 см', index: 1 },
    { value: '2', label: '30 см', index: 2 },
    { value: '3', label: '35 см', index: 3 },
] as const;

const DOUGH_TYPES = [
    { value: 'tradition', label: 'Традиционное' },
    { value: 'thin', label: 'Тонкое' },
] as const;
  
const IMAGE_DIMENSIONS = {
    width: 584,
    height: 584
} as const;

const DIALOG_SIZES = {
    width: {
        xs: '95%',
        sm: '800px',
        md: '1000px',
        lg: '1100px',
        xl: '1200px'
    },
    height: {
        xs: '650px',
        sm: '650px',
        md: '650px',
        lg: '650px',
        xl: '650px'
    }
} as const;


const MODAL_STYLES = {
    content: {
      display: "flex",
      p: 3,
      height: "60vh",
      overflow: "hidden"
    },
    closeButton: (theme: any) => ({
      position: 'absolute',
      right: 24,
      top: 8,
      color: theme.palette.grey[500],
    })
} as const;

export const ModalGood = ({id, open, handleClose, img, title, content, priceArr}: ModalGoodInterface) => {
    const [selectedSize, setSelectedSize] = useState<string>(PIZZA_SIZES[0].value);
    const [selectedDough, setSelectedDough] = useState<string>(DOUGH_TYPES[0].value);

    const dispatch = useDispatch<AppDispatch>();

    const currentPrice = () => {
        const sizeIndex = PIZZA_SIZES.findIndex(size => size.value === selectedSize);
        return priceArr[sizeIndex] ?? priceArr[0];
    }

    const handleSizeChange = (
        _: React.MouseEvent<HTMLElement>,
        newValue: string | null
    )  => {
        if (newValue) {
            setSelectedSize(newValue);
        }
    }

    const handleDoughChange = (
        _: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue) {
          setSelectedDough(newValue);
        }
    }

    const handleAddToCart = useCallback(() => {
        if (!id) return;
        const sizeIndex = PIZZA_SIZES.findIndex(size => size.value === selectedSize);
        const size = PIZZA_SIZES[sizeIndex].label
        dispatch(addToCart({
          id,
          name: title,
          price: currentPrice(),
          image: img,
          quantity: 1,
          settings: {
            size: size,
            dough: selectedDough
          }
        }));
        handleClose();
    }, [id, title, currentPrice, img, selectedSize, selectedDough]);
    

    const sizeButtons = useMemo(() => (
        PIZZA_SIZES.map(({ value, label }) => (
          <ToggleButton key={value} value={value}>
            {label}
          </ToggleButton>
        ))
    ), []);

    const doughButtons = useMemo(() => (
        DOUGH_TYPES.map(({ value, label }) => (
          <ToggleButton key={value} value={value}>
            {label}
          </ToggleButton>
        ))
    ), []);

    return (
        <Box>

            <Dialog
                onClose={handleClose}
                open={open}
                maxWidth={false}
                PaperProps={{sx: {borderRadius: 15,}}}
                sx={{            
                    '& .MuiDialog-paper': {
                        width: DIALOG_SIZES.width,
                        maxWidth: DIALOG_SIZES.width,
                        height: DIALOG_SIZES.height,
                        maxHeight: DIALOG_SIZES.height,
                        m: 0
                    }
                }}
            >
                <DialogContent dividers sx={MODAL_STYLES.content}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right:  20,
                            top: 20,
                            zIndex: 1401,
                            color: 'black',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            },
                            width: 48,
                            height: 48,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{ flexShrink: 0, mr: 3 }}>
                        <img
                            width={IMAGE_DIMENSIONS.width}
                            src={ImageWithDimensionsIndicated({
                                r: IMAGE_DIMENSIONS.height,
                                x: IMAGE_DIMENSIONS.width,
                                id: img
                            })}
                            alt={title}
                            style={{ display: 'block' }}
                        />
                    </Box>
                    <Box sx={
                            {
                                flex: 1, 
                                overflowY: "hidden",
                                pr: 1,
                                position: "relative",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }
                        }
                    >
                        <List
                        sx={{
                                height: "80%",
                                overflowY: "auto", 
                                pr: 1,
                            }}
                        >
                            <Typography variant="h4" sx={{fontWeight: "bold"}} gutterBottom>
                                {title}
                            </Typography>
                            <Typography gutterBottom>
                                {content}
                            </Typography>
                            <Stack spacing={1}>
                                <ToggleButtonGroup
                                    color="warning"
                                    size="small"
                                    fullWidth
                                    value={selectedSize}
                                    onChange={handleSizeChange}
                                    exclusive
                                    aria-label="pizza sizes"
                                >
                                    {sizeButtons}
                                </ToggleButtonGroup>
                                <ToggleButtonGroup
                                    color="warning"
                                    size="small"
                                    fullWidth
                                    value={selectedDough}
                                    onChange={handleDoughChange}
                                    exclusive
                                    aria-label="dough types"
                                >
                                    {doughButtons}
                                </ToggleButtonGroup>
                                <Typography variant="h5" sx={{fontWeight: "bold"}}>Добавить по вкусу</Typography>
                            </Stack>
                        </List>
                        <Box sx={{
                            height: "20%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 1
                        }} >
                            <Button onClick={handleAddToCart} sx={{borderRadius: 15, width: "100%", height: "60%", fontWeight: "bold"}} color="warning" variant="contained" >В корзину за {currentPrice()} ₽</Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}