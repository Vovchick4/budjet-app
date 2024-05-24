import axios from 'axios';
import { z } from 'zod';
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TextField, Typography } from "@mui/material";
import { TCategories } from '../../app/types';
import { LoadingButton } from '@mui/lab';
import { queryClient } from '../../app';
import { useToastStore } from '../../store/store';

// Define the validation schema using Zod
const validationSchema = z.object({
    name: z.string().nonempty("Iм'я категорії є обов'язковою"),
});

type FormData = {
    id?: number;
    name: string;
};

export default function CategoryForm({ mode = 'create', fData = { name: '' }, handleClose }: { mode?: string, fData?: FormData, handleClose: () => void }) {
    const isUpdateMode = mode === 'update';
    const onShowToast = useToastStore(state => state.onShowToast);
    const { mutate, isPending } = useMutation<TCategories, Error, FormData>(
        {
            mutationKey: ["create-update-category"],
            mutationFn: async (data) => {
                try {
                    const res = (await axios({ method: isUpdateMode ? 'PUT' : 'POST', url: 'http://localhost:5254/api/Category/' + (isUpdateMode ? fData.id : ''), data })).data;
                    return res
                } catch (error) {
                    throw (error as any).response?.data || 'An error occurred'
                }
            },
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: ['get-categories'] });
                handleClose();
                onShowToast({ open: true, message: `Успішно ${isUpdateMode ? 'оновлено' : 'створено'}!` });
            },
            onError: (err) => {
                onShowToast({ open: true, message: JSON.stringify(err) });
            }
        })

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: isUpdateMode ? { ...fData, id: undefined } : {},
        resolver: zodResolver(validationSchema)
    });

    const onSubmit: SubmitHandler<FormData> = data => mutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {!isUpdateMode ? <Typography>Створення категорії</Typography> : <Typography>Оновлення категорії</Typography>}
            <TextField
                id="name"
                type="text"
                label="Iм'я категорії"
                variant="outlined"
                color="primary"
                fullWidth
                margin="normal"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
            />
            <LoadingButton loading={isPending} type="submit" color="primary" variant="contained" fullWidth>
                {!isUpdateMode ? 'Створити' : 'Змінити'}
            </LoadingButton>
        </form>
    )
}
