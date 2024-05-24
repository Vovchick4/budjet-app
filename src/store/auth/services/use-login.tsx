import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { TUser } from "../auth-slice";
import { TLoginPayload } from "../../../pages/login-page";
import { useBoundStore, useToastStore } from "../../store";

export default function useLogin() {
    const featUser = useBoundStore(user => user.featUser);
    const onShowToast = useToastStore(state => state.onShowToast)

    return useMutation<TUser, Error, TLoginPayload>(
        {
            mutationKey: ["login-user"],
            mutationFn: async (data) => {
                try {
                    const res = (await axios({ method: 'POST', url: 'http://localhost:5254/api/User/login', data })).data;
                    featUser(res);
                    return res
                } catch (error) {
                    throw (error as any).response?.data || 'An error occurred'
                }
            },
            onSuccess: () => {
                onShowToast({ open: true, message: 'Успішний вхід' });
            },
            onError: (err) => {
                onShowToast({ open: true, message: err });
            }
        }
    );
}