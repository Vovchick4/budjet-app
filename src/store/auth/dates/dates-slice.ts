import { StateCreator } from "zustand";

export type TDates = {
    end: string;
    start: string;
}

export type TDatesStore = {
    dates: TDates
}

export type TDatesAction = {
    setDates: (key: string, value: string) => void;
}

export type TDatesState = TDatesStore & TDatesAction;

export const createDatesSlice: StateCreator<
    TDatesStore & TDatesAction,
    [],
    [],
    TDatesState
> = (set) => ({
    dates: {
        end: '',
        start: '',
    },
    setDates: (key, value) => set((state) => ({ dates: { ...state.dates, [key]: value } })),
})