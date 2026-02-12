'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, UtensilsCrossed, Users, Receipt } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export default function SidebarMenuItems() {
  const pathname = usePathname();

  const items = [
    { href: '/manajemen/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/meja-tersedia', label: 'Meja Tersedia', Icon: Home },
    { href: '/manajemen/detail-order', label: 'Detail Order', Icon: Receipt },
    { href: '/manajemen/master-makanan', label: 'Master Makanan', Icon: UtensilsCrossed },
  ];

  return (
    <SidebarMenu>
      {items.map((it) => (
        <SidebarMenuItem key={it.href}>
          <SidebarMenuButton asChild isActive={pathname === it.href}>
            <Link href={it.href} className="flex items-center gap-2">
              <it.Icon className="w-4 h-4" />
              <span>{it.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
