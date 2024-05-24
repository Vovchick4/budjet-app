import { StateCreator } from "zustand";

export type TUser = {
    id: number;
    username: string;
    email: string;
    rememberToken: string;
    createdAt: string;
    updatedAt: string;
}

export type TStore = {
    user: TUser | null
}

export type TAction = {
    featUser: (user: TUser) => void,
    forgotUser: () => void,
}

export type TState = TStore & TAction;

export const createAuthSlice: StateCreator<
    TStore & TAction,
    [],
    [],
    TState
> = (set) => ({
    user: null,
    featUser: (user: TUser) => set(() => ({ user })),
    forgotUser: () => set(() => ({ user: null })),
})