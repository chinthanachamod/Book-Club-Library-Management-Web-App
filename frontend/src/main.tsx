import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";
import {AuthProvider} from "./context/AuthProvider.tsx";
import {SidebarProvider} from "./context/SidebarContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SidebarProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </SidebarProvider>
    </StrictMode>
)
