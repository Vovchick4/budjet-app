import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useBoundStore } from "../../store";
import { setToken } from "../../../config/axios";
import { queryClient } from "../../../app";

export default function useGetUser() {
    const user = useBoundStore(state => state.user);
    const savetUser = useBoundStore(state => state.featUser);
    const forgotUser = useBoundStore(state => state.forgotUser);

    return useQuery({
        queryKey: ["get-user"],
        queryFn: async () => {
            try {
                if (user?.rememberToken) {
                    setToken(user.rememberToken);
                    const response = (await axios({
                        method: 'GET',
                        url: 'http://localhost:5254/api/User/me',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })).data
                    queryClient.invalidateQueries({ queryKey: ['get-categories', 'get-notifications', 'get-events-by-user', user.id], exact: false });
                    savetUser(response);
                    return response;
                } else {
                    throw new Error("Logout");
                }
            } catch (error) {
                forgotUser();
                throw (error as Error)?.message || { message: 'An error occurred' };
            }
        },
        enabled: !!user,
        refetchOnWindowFocus: false
    });
}
