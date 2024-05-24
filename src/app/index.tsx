import { Snackbar } from "@mui/material"
import { RouterProvider } from "react-router-dom"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import router from "../config/routes"
import { useToastStore } from "../store/store"

export const queryClient = new QueryClient()

function App() {
  const { open, message } = useToastStore(state => state.toast);
  const onHandleClose = useToastStore(state => state.onHandleClose);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onHandleClose}
        message={message}
      />
    </QueryClientProvider>
  )
}

export default App
