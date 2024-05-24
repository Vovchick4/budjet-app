import axios from 'axios';
import { z } from 'zod';
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TextField, Typography, MenuItem } from "@mui/material";
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { queryClient } from '../../app';
import { useToastStore } from '../../store/store';
import { TCategories, TType } from '../../app/types';

// Define the validation schema using Zod
const validationSchema = z.object({
    name: z.string().nonempty("Назва є обов'язковою"),
    number: z.string().min(1, "Число повинно бути більше нуля"),
    date: z.string().nonempty("Дата є обов'язковою"),
    type: z.nativeEnum(TType, { errorMap: () => ({ message: "Тип є обов'язковим" }) }),
    categoryId: z.number()
});

type FormData = z.infer<typeof validationSchema> & { id?: number };

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function EventForm({ mode = 'create', fData = { name: '', number: '', date: '', type: TType.Profit, categoryId: 0 }, handleClose }: { mode?: string, fData?: FormData, handleClose: () => void }) {
    const { categoryId } = useParams();
    const isUpdateMode = mode === 'update';
    const onShowToast = useToastStore(state => state.onShowToast);
    const { mutate, isPending } = useMutation<TCategories, Error, FormData>(
        {
            mutationKey: ["create-update-event"],
            mutationFn: async (data) => {
                try {
                    const res = (await axios({ method: isUpdateMode ? 'PUT' : 'POST', url: 'http://localhost:5254/api/Event/' + (isUpdateMode ? fData.id : ''), data })).data;
                    return res
                } catch (error) {
                    throw (error as any).response?.data || 'An error occurred'
                }
            },
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: ['get-events', categoryId], exact: false });
                handleClose();
                onShowToast({ open: true, message: `Успішно ${isUpdateMode ? 'оновлено' : 'створено'}!` });
            },
            onError: (err) => {
                onShowToast({ open: true, message: JSON.stringify(err) });
            }
        })

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: isUpdateMode ? { ...fData, id: undefined, number: String(fData.number), date: formatDate(fData.date) } : { categoryId: fData.categoryId },
        resolver: zodResolver(validationSchema)
    });

    const onSubmit: SubmitHandler<FormData> = data => mutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {!isUpdateMode ? <Typography>Створення події</Typography> : <Typography>Оновлення події</Typography>}
            <TextField
                id="name"
                type="text"
                label="Iм'я події"
                variant="outlined"
                color="primary"
                fullWidth
                margin="normal"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
            />
            <TextField
                id="number"
                type="number"
                label="Число"
                variant="outlined"
                color="primary"
                fullWidth
                margin="normal"
                {...register('number')}
                error={!!errors.number}
                helperText={errors.number?.message}
            />
            <TextField
                id="date"
                type="date"
                label="Дата"
                variant="outlined"
                color="primary"
                fullWidth
                margin="normal"
                {...register('date')}
                InputLabelProps={{
                    shrink: true,
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
            />
            <TextField
                id="type"
                select
                label="Тип"
                variant="outlined"
                color="primary"
                fullWidth
                margin="normal"
                {...register('type')}
                defaultValue={isUpdateMode ? (fData.type === 0 ? TType.Profit : TType.Cost) : ''}
                error={!!errors.type}
                helperText={errors.type?.message}
            >
                <MenuItem value={TType.Profit}>Дохід</MenuItem>
                <MenuItem value={TType.Cost}>Розхід</MenuItem>
            </TextField>
            <LoadingButton loading={isPending} type="submit" color="primary" variant="contained" fullWidth>
                {!isUpdateMode ? 'Створити' : 'Змінити'}
            </LoadingButton>
        </form>
    )
}
