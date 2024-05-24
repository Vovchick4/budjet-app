import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { RestrictedRoute } from '../hooks'

export default function AuthLayout() {
    return (
        <RestrictedRoute>
            <Suspense fallback={"loading..."}>
                <Outlet />
            </Suspense>
        </RestrictedRoute>
    )
}
