import { AlertColor } from "@mui/material";
import { StateCreator } from "zustand";

export type TToast = {
    open: boolean,
    severity?: AlertColor,
    variant?: string,
    message: any,
}

export const initToast: TToast = {
    open: false,
    severity: 'success',
    variant: 'filled',
    message: ''
}

export type TToastStore = {
    toast: TToast
}

export type TAction = {
    onShowToast: (opts: TToast) => void,
    onHandleClose: () => void,
}

export type TToastState = TToastStore & TAction;

export const createToastSlice: StateCreator<
    TToastStore & TAction,
    [],
    [],
    TToastState
> = (set) => ({
    toast: initToast,
    onShowToast: (toast: TToast) => set(() => ({ toast })),
    onHandleClose: () => set(() => ({ toast: initToast, }))
})