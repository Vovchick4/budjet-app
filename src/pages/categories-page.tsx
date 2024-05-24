import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from "@tanstack/react-query";
import CreateIcon from '@mui/icons-material/Create';
import { Box, Modal, Typography, Grid, CircularProgress } from "@mui/material";
import { LoadingButton } from '@mui/lab';

import { Card } from '../widgets';
import { Form } from '../components';
import { TCategories } from '../app/types';
import { useToastStore } from '../store/store';
import { queryClient } from '../app';

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

export default function CategoriesPage() {
    const onShowToast = useToastStore(state => state.onShowToast)
    const { data, error, isLoading } = useQuery<TCategories[]>({
        queryKey: ['get-categories'],
        queryFn: async () => {
            return (await axios({ method: 'GET', url: 'http://localhost:5254/api/Category' })).data?.$values
        }
    });
    const { mutate, isPending } = useMutation({
        mutationKey: ["remove-category"],
        mutationFn: async (data) => {
            try {
                const res = (await axios({ method: 'DELETE', url: `http://localhost:5254/api/Category/${data}` })).data;
                return res
            } catch (error) {
                throw (error as any).response?.data || 'An error occurred'
            }
        },
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['get-categories'] });
            onShowToast({ open: true, message: 'Успішно видалено' });
        },
        onError: (err) => {
            onShowToast({ open: true, message: JSON.stringify(err) });
        }
    })

    const [open, setOpen] = React.useState(false);
    const [activeCategory, setActiveCategory] = React.useState<TCategories | null>(null);
    const onChangeCategory = (category?: TCategories) => setActiveCategory(category ?? null)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        onChangeCategory();
    };

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
                <Typography sx={{ margin: 0 }} variant="h4" gutterBottom>Категорії</Typography>
                <LoadingButton loading={isLoading} variant="contained" endIcon={<CreateIcon />} onClick={handleOpen}>
                    Створити категорію
                </LoadingButton>
            </Box>

            {(isLoading || isPending) && <CircularProgress color="secondary" />}

            {!isLoading && data && data.length > 0 && (
                <Grid container spacing={2}>
                    {data.map((category) => (
                        <Grid key={category.id} item xs={12} md={6} xl={3}>
                            <Card.RootCard item={category} RenderTitle={({ name }) => name} RenderDesc={({ desc }) => desc} isRouting onChangeCategory={onChangeCategory} onRemoveElement={mutate} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {(!isLoading && data?.length === 0) && <Typography color={'ActiveCaption'} variant="h5" gutterBottom>Немає категорій, {error && JSON.stringify(error)}</Typography>}

            <Modal
                open={open || !!activeCategory}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Form.CategoryForm mode={activeCategory ? 'update' : 'create'} fData={activeCategory ?? { name: '' }} handleClose={handleClose} />
                </Box>
            </Modal>
        </Box>
    )
}
