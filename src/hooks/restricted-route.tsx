import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { urls } from "../config/urls";
import { useBoundStore } from "../store/store";

export default function RestrictedRoute({ children }: { children: ReactNode }) {
    const user = useBoundStore((state) => state.user);

    if (user) {
        return <Navigate to={urls.home} />
    }

    return children;
}