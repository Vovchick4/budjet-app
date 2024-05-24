import { z } from 'zod';
import { TextField, Divider, Box, Link } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { urls } from '../config/urls';
import useRegister from '../store/auth/services/use-register';

export const registrationSchema = z.object({
    username: z.string().nonempty("Поле ім'я є обов'язковим"),
    email: z.string().email("Неправельна email адресса"),
    password: z.string().min(6, "Пароль має бути не менше 6 символів"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Паролі мають співпадати",
    path: ["confirmPassword"],
});

export type TUserPayload = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const { mutate, isPending } = useRegister();
    const { register, handleSubmit, formState: { errors } } = useForm<TUserPayload>({
        resolver: zodResolver(registrationSchema)
    });

    const onSubmit: SubmitHandler<TUserPayload> = data => mutate(data);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f0f0f0"
        >
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    bgcolor: 'white',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3
                }}
            >
                <Box sx={{ textAlign: 'center' }} component='h2'>Увійти в адмінку</Box>
                <TextField
                    id="username"
                    type="text"
                    label="Ваше ім'я"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    margin="normal"
                    {...register('username')}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                />
                <TextField
                    id="email"
                    type="email"
                    label="Ваша eлектрона скринька"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    margin="normal"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    id="password"
                    type="password"
                    label="Згенеруйте пароль"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    margin="normal"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <TextField
                    id="confirmPassword"
                    type="password"
                    label="Ще раз ваш пароль"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    margin="normal"
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />
                <LoadingButton loading={isPending} type="submit" color="primary" variant="contained" fullWidth>
                    Створити аккаунт
                </LoadingButton >
                <Divider sx={{ margin: '20px 0' }} variant='fullWidth' />
                <Box sx={{ textAlign: 'center' }}>
                    <Link href={urls.login} underline="always">
                        Сторінка логіну
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}
