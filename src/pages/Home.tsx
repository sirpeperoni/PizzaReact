import Container from '@mui/material/Container'
import { Header } from '../Widgets/Header/Header';
import { Box, Typography } from '@mui/material';
import { GoodsList } from '../Widgets/GoodsList/GoodsList';



const goodLists = [
  {
    name: "Пиццы",
    colName: "pizza"
  },
  {
    name: "Пиццы",
    colName: "pizza"
  },
]

export const Home = () => {
    return (
        <div className="">
          <Header/>
          <Container maxWidth="xl" >
            {
              goodLists.map((good) => 
                <Box>
                  <Typography variant='h4' sx={{fontWeight: "bold", mt: 3}}>{good.name}</Typography>
                  <GoodsList goodName={good.colName}/>
                </Box>
              )
            }
          </Container>
        </div>
    )
}