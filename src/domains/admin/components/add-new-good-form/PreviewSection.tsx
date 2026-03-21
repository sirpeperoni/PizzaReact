import { Paper, Typography } from '@mui/material';

interface PreviewSectionProps {
    watchTitle: string;
    watchSizes: string[];
    watchDough: string[];
    watchPrices: number[];
    watchContent: string;
}

export const PreviewSection = ({ 
    watchTitle, 
    watchSizes, 
    watchDough, 
    watchPrices, 
    watchContent 
}: PreviewSectionProps) => {
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Предварительный просмотр
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                <Typography variant="body1">
                    <strong>{watchTitle || 'Название не указано'}</strong>
                    {watchSizes.map((size) => ` • ${size}`)}
                    {` / `}
                    {watchDough.map((dough) => ` • ${dough} тесто`)}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    Цены: {watchPrices.map((price) => <>{price}, </>)} ₽
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {watchContent || 'Описание не указано'}
                </Typography>
            </Paper>
        </>
    );
};