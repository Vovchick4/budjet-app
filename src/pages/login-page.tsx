import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TextField, Box, Divider, Link } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { urls } from '../config/urls';
import useLogin from '../store/auth/services/use-login';

// Define the validation schema using Zod
const validationSchema = z.object({
    usernameOrEmail: z.string().nonempty("Необхідно вказати електронну адресу або ім’я користувача"),
    password: z.string().min(6, "Пароль має бути не менше 6 символів"),
});

export type TLoginPayload = {
    usernameOrEmail: string;
    password: string;
};

export default function LoginPage() {
    const { mutate, isPending } = useLogin();
    const { register, handleSubmit, formState: { errors } } = useForm<TLoginPayload>({
        resolver: zodResolver(validationSchema)
    });

    const onSubmit: SubmitHandler<TLoginPayload> = data => mutate(data);

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
                    id="email_or_username"
                    type="text"
                    label="Ваше ім'я або почта"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    margin="normal"
                    {...register('usernameOrEmail')}
                    error={!!errors.usernameOrEmail}
                    helperText={errors.usernameOrEmail?.message}
                />
                <TextField
                    id="password"
                    type="password"
                    label="Ваш пароль"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    margin="normal"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <LoadingButton loading={isPending} type="submit" color="primary" variant="contained" fullWidth>
                    Увійти
                </LoadingButton>
                <Divider sx={{ margin: '20px 0' }} variant='fullWidth' />
                <Box sx={{ textAlign: 'center' }}>
                    <Link href={urls.register} underline="always">
                        Сторінка регістрації
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}
