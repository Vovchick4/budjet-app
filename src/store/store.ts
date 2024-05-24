import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { TState, createAuthSlice } from './auth/auth-slice'
import { TToastState, createToastSlice } from './toast/toast-slice'
import { TDatesState, createDatesSlice } from './auth/dates/dates-slice'

export const useBoundStore = create<TState>()(
    persist(
        (...a) => ({
            ...createAuthSlice(...a),
        }),
        { name: 'auth-storage' }
    )
)

export const useToastStore = create<TToastState>(
    (...a) => ({
        ...createToastSlice(...a),
    }),
)

export const useDatesStore = create<TDatesState>(
    (...a) => ({
        ...createDatesSlice(...a),
    }),
)