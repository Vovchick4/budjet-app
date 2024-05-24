import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { Drawer } from '../widgets'
import { PrivateRoute } from '../hooks'
import useGetUser from '../store/auth/services/use-get-user'

export default function RootLayout() {
    useGetUser();

    return (
        <PrivateRoute>
            <Suspense fallback={"loading..."}>
                <Drawer.DrawerResponsive>
                    <Outlet />
                </Drawer.DrawerResponsive>
            </Suspense>
        </PrivateRoute>
    )
}
