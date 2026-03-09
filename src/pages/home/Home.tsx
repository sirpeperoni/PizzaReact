import Container from '@mui/material/Container';
import { Box, Typography } from '@mui/material';
import { GoodsList } from '../../domains/pizza/components/GoodsList';

const goodLists = [
  {
    name: 'Пиццы',
    colName: 'pizza',
  },
  {
    name: 'Пиццы',
    colName: 'pizza',
  },
];

export const Home = () => {
  return (
    <div className=''>
      <Container maxWidth='xl'>
        {goodLists.map(good => (
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 'bold', mt: 3 }}>
              {good.name}
            </Typography>
            <GoodsList goodName={good.colName} />
          </Box>
        ))}
      </Container>
    </div>
  );
};
