import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Box, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";

import type { TEvent } from "../app/types";
import { useBoundStore } from "../store/store";

export default function HistoryPage() {
    const user = useBoundStore(state => state.user)
    const { data, error, isLoading } = useQuery<TEvent[]>({
        queryKey: ['get-history', user?.id],
        queryFn: async () => (await axios({ url: 'http://localhost:5254/api/Event/history', method: 'GET' })).data?.$values,
        enabled: !!user
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                    }}
                >
                    <Typography sx={{ margin: 0 }} variant="h4" gutterBottom>Історія оплат:</Typography>
                </Box>
            </Box>

            {(isLoading) && <CircularProgress color="secondary" />}

            {!isLoading && data && data.length > 0 && (
                <Grid container spacing={2}>
                    {data.map((event) => (
                        <Grid key={event.id} item xs={12} md={6} xl={3}>
                            <Card >
                                <CardContent>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        {event.type === 0 ? 'Дохід' : 'Розхід'}
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        {event.number}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {event.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {((!isLoading && data?.length === 0)) && <Typography color={'ActiveCaption'} variant="h5" gutterBottom>Історія порожня, {error && JSON.stringify(error?.message ?? "")}</Typography>}
        </Box>
    )
}
