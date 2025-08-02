import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, SquareTerminal } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { url } = usePage();
    const { auth } = usePage().props as any;
    const permissions = auth?.permissions;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
            isActive: url === '/dashboard',
        },
        {
            title: 'Admin',
            href: '#',
            icon: SquareTerminal,
            isActive: url.startsWith('/admin/'),
            permission: 'access-admin-module',
            items: [
                {
                    title: 'Users',
                    href: '/admin/users',
                },
                {
                    title: 'Permissions',
                    href: '/admin/permissions',
                },
                {
                    title: 'Roles',
                    href: '/admin/roles',
                },
            ],
        },
    ];

    const filteredNavItems = mainNavItems.filter((item) => !item.permission || permissions.includes(item.permission));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
