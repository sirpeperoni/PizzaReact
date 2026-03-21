import { Box, Container, Typography, } from "@mui/material"
import { useProfileStore } from "../../domains/profile/stores/profileStrore"
import { Loading } from "../../shared/components/Loading/Loading"
import { useEffect } from "react"
import { ProgressOrders } from "../../domains/profile/components/orders/progress-orders/ProgressOrders"
import { CompletedOrders } from "../../domains/profile/components/orders/completed-orders/CompletedOrders"
import { NoOrders } from "../../domains/profile/components/orders/no-orders/NoOrders"
import { ProfileInput } from "../../domains/profile/components/profile-input/ProfileInput"
import { PersonalInformation } from "../../domains/profile/components/personal-information/PersonalInformation"





export const Profile = () => {
    const history = useProfileStore((state) => state.history)
    const isLoading = useProfileStore((state) => state.isLoading)
    const error = useProfileStore((state) => state.error)

    const fetchHistory = useProfileStore((state) => state.fetchHistory)

    useEffect(() => {
        fetchHistory()
    },[])

    if(isLoading){
        return <Loading/>
    }

    if(error){
        return <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyConten: "center"
            }}
        >
            {error}
        </Box>
    }
    const inProgressOrders = history.filter((order) => order.status !== 'delivered')
    const completedOrders = history.filter((order) => order.status === 'delivered')
    
    return (
        <Container maxWidth='xl' sx={{ py: 4 }}>
            <PersonalInformation/>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                
                {inProgressOrders.length > 0 && (
                    <ProgressOrders inProgressOrders={inProgressOrders}/>
                )}

                {completedOrders.length > 0 && (
                    <CompletedOrders completedOrders={completedOrders}/>
                )}

                {history.length === 0 && !isLoading && (
                    <NoOrders/>
                )}
            </Box>
        </Container>
    )
}

