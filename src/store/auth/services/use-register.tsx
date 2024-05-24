import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { TUser } from "../auth-slice";
import { useBoundStore, useToastStore } from "../../store";
import { TUserPayload } from "../../../pages/register-page";

export default function useRegister() {
    const featUser = useBoundStore(user => user.featUser);
    const onShowToast = useToastStore(state => state.onShowToast)

    return useMutation<TUser, Error, TUserPayload>(
        {
            mutationKey: ["register-user"],
            mutationFn: async (data) => {
                try {
                    const res = (await axios({ method: 'POST', url: 'http://localhost:5254/api/User/register', data })).data;
                    featUser(res);
                    return res
                } catch (error) {
                    throw (error as any).response?.data || 'An error occurred'
                }
            },
            onSuccess: () => {
                onShowToast({ open: true, message: 'Успішно створено аакаунт' });
            },
            onError: (err) => {
                onShowToast({ open: true, message: err });
            }
        }
    );
}