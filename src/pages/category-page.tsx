import axios from "axios";
import React from 'react';
import { useParams, useNavigate } from "react-router-dom"
import CreateIcon from '@mui/icons-material/Create';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Box, Modal, Button, IconButton, Typography, Grid, CircularProgress, Chip } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { Card } from '../widgets';
import { queryClient } from "../app";
import { Form } from '../components';
import { TEvent, TType } from '../app/types';
import { useToastStore } from "../store/store";
import { urls } from "../config/urls";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function CategoryPage() {
    const navigation = useNavigate();
    const { categoryId } = useParams();
    const onShowToast = useToastStore(state => state.onShowToast)
    const { data, error, isLoading } = useQuery<TEvent[]>({
        queryKey: ['get-events', categoryId],
        queryFn: async () => {
            return (await axios({ method: 'GET', url: `http://localhost:5254/api/Event/category/${categoryId}` })).data?.$values
        }
    });
    const { mutate, isPending } = useMutation({
        mutationKey: ["remove-category"],
        mutationFn: async (data) => {
            try {
                const res = (await axios({ method: 'DELETE', url: `http://localhost:5254/api/Event/${data}` })).data;
                return res
            } catch (error) {
                throw (error as any).response?.data || 'An error occurred'
            }
        },
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['get-events', categoryId] });
            onShowToast({ open: true, message: 'Успішно видалено' });
        },
        onError: (err) => {
            onShowToast({ open: true, message: JSON.stringify(err) });
        }
    })

    const [open, setOpen] = React.useState(false);
    const [activeCategory, setActiveCategory] = React.useState<TEvent | null>(null);
    const onChangeCategory = (event?: TEvent) => setActiveCategory(event ?? null)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        onChangeCategory();
    }

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
                    <IconButton onClick={() => navigation(urls.categories)}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Typography sx={{ margin: 0 }} variant="h4" gutterBottom>Доходи/Розходи</Typography>
                </Box>
                <Button variant="contained" endIcon={<CreateIcon />} onClick={handleOpen}>
                    Створити дохід/розхід
                </Button>
            </Box>

            {(isLoading || isPending) && <CircularProgress color="secondary" />}

            {!isLoading && data && data.length > 0 && (
                <Grid container spacing={2}>
                    {data.map((event) => (
                        <Grid key={event.id} item xs={12} md={6} xl={3}>
                            <Card.RootCard item={event} RenderTitle={({ name, number, type }) => <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}><Typography>{name} - {number} UAH</Typography><Chip color={type === 0 ? 'success' : 'error'} label={type === 0 ? 'Дохід' : 'Розхід'} /></Box>} RenderDesc={({ desc }) => desc} onChangeCategory={onChangeCategory} onRemoveElement={mutate} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {(!isLoading && (!data || data?.length === 0)) && <Typography color={'ActiveCaption'} variant="h5" gutterBottom>Немає категорій по заданій категорії, {error && JSON.stringify(error?.message ?? "")}</Typography>}

            <Modal
                open={open || !!activeCategory}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Form.EventForm mode={activeCategory ? 'update' : 'create'} fData={activeCategory ?? { name: '', number: '', date: '', categoryId: Number(categoryId) ?? 0, type: TType.Profit }} handleClose={handleClose} />
                </Box>
            </Modal>
        </Box>
    )
}
