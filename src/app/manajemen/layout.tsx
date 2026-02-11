'use client';

import { ReactNode } from 'react';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarProvider,
    SidebarInset,
} from '@/components/ui/sidebar';
import { Home, LayoutDashboard, Users, UtensilsCrossed } from 'lucide-react';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { NavbarSearchProvider } from '@/context/navbarSearch';
import SidebarMenuItems from '@/components/sidebar-item/SidebarMenuItems';

export default function ManajemenLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider defaultOpen={false}>
            <Sidebar>
                <SidebarHeader>
                    <div className="font-bold px-2 text-lg">RestaurantPOS</div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenuItems />
                </SidebarContent>
            </Sidebar>
            <NavbarSearchProvider>
                <SidebarInset>
                    <DashboardNavbar />

                    {children}
                </SidebarInset>
            </NavbarSearchProvider>
        </SidebarProvider>
    );
}