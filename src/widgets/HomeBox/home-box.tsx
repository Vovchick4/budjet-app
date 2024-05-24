import { ReactNode } from "react";
import { Box } from "@mui/material";

export default function HomeBox({ children }: { children: ReactNode }) {
    return (
        <Box
            sx={{
                p: 2,
                boxShadow: 2
            }}
        >
            {children}
        </Box>
    )
}
