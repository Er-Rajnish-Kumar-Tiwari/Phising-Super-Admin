import { useState } from "react";
import Cookies from "js-cookie";
import { AppSidebar } from "@/components/app-sidebar"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet,useLocation } from "react-router-dom";

export default function Page() {
    const location = useLocation();
    // Initialize state using the cookie value
    // const [defaultOpen, setDefaultOpen] = useState(Cookies.get("sidebar_state") === "true");
    const [defaultOpen, setDefaultOpen] = useState(true);

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
                <SidebarTrigger className="-ml-1" />
                <Outlet key={location.pathname}/>
            </SidebarInset>
        </SidebarProvider>
    )
}
