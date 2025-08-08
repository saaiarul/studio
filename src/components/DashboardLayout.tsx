
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  QrCode,
  Settings,
  Users,
  BarChart3,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type DashboardLayoutProps = {
  children: React.ReactNode;
  role: 'admin' | 'company';
};

const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: Home },
];

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary-foreground font-headline">
    <QrCode className="w-7 h-7" />
    <span className="text-white/90">ReviewRoute</span>
  </Link>
);


export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const businessId = role === 'company' ? pathname.split('/')[2] : null;

  const companyNav = businessId ? [
    { name: 'Dashboard', href: `/dashboard/${businessId}`, icon: Home },
    { name: 'Analytics', href: `/dashboard/${businessId}/analytics`, icon: BarChart3 },
    { name: 'Customers', href: `/dashboard/${businessId}/customers`, icon: Users },
    { name: 'Messaging', href: `/dashboard/${businessId}/messaging`, icon: MessageCircle },
    { name: 'Settings', href: `/dashboard/${businessId}/settings`, icon: Settings },
  ] : [];

  const navItems = role === 'admin' ? adminNav : companyNav;
  
  const user = {
    name: role === 'admin' ? 'Admin User' : 'Company User',
    email: role === 'admin' ? 'admin@reviewroute.com' : 'company@reviewroute.com',
    avatar: role === 'admin' ? 'https://placehold.co/100x100/64B5F6/FFFFFF/png' : 'https://placehold.co/100x100/26A69A/FFFFFF/png'
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="bg-gradient-to-br from-black via-blue-950 to-black bg-[length:200%_200%] animate-gradient text-white" collapsible="icon">
          <SidebarContent>
            <SidebarHeader className="p-4 border-b border-white/10">
              <Logo />
            </SidebarHeader>
            <SidebarMenu className="p-4">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="data-[active=true]:bg-white/10 data-[active=true]:text-white hover:bg-white/10 text-white/80"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-white/10">
             <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-white/80">
                        <Link href="/">
                            <LogOut className="w-5 h-5"/>
                            <span>Logout</span>
                        </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b bg-card">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon">
                      <Bell className="w-5 h-5"/>
                  </Button>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</Fallback>
                    </Avatar>
                    <div className="text-sm hidden md:block">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
              </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
