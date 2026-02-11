'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavbarSearch } from '@/context/navbarSearch';

interface DashboardNavbarProps {
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    showSearch?: boolean;
}

export const DashboardNavbar = ({ 
    searchQuery = '', 
    onSearchChange, 
    showSearch = true 
}: DashboardNavbarProps) => {
    const { user, logout } = useAuth();
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);

    const navbarSearch = useNavbarSearch();
    const resolvedSearchQuery = searchQuery ?? navbarSearch?.searchQuery ?? '';
    const resolvedOnSearchChange = onSearchChange ?? navbarSearch?.setSearchQuery;

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (showMobileSearch && searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowMobileSearch(false);
            }
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [showMobileSearch]);

    return (
        <header className="sticky top-0 z-40 backdrop-blur-sm bg-white/90 dark:bg-zinc-950/90 border-b shadow-sm px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                    <SidebarTrigger />

                    <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1 rounded font-bold text-sm md:text-base">
                        RestaurantPOS
                    </div>

                    {showSearch && resolvedOnSearchChange && (
                        <div className="relative" ref={searchRef}>
                            {/* Desktop */}
                            <div className="hidden md:block">
                                <Input
                                    type="search"
                                    placeholder="Search table..."
                                    value={resolvedSearchQuery}
                                    onChange={(e) => resolvedOnSearchChange(e.target.value)}
                                    className="w-64"
                                />
                            </div>

                            {/* Mobile: icon toggles small input */}
                            <div className="md:hidden">
                                <button
                                    aria-label="Toggle search"
                                    onClick={() => setShowMobileSearch((s) => !s)}
                                    className="p-2 rounded-md bg-slate-100 dark:bg-zinc-900"
                                >
                                    <Search size={16} />
                                </button>

                                {showMobileSearch && (
                                    <div className="absolute left-0 mt-2 w-48 z-50">
                                        <Input
                                            type="search"
                                            placeholder="Search table..."
                                            value={resolvedSearchQuery}
                                            onChange={(e) => resolvedOnSearchChange(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div> 

                <div className="flex items-center gap-3">
                    <div className="text-sm flex flex-col items-end">
                        <div className="font-medium max-w-[140px] truncate">{user?.name || 'User'}</div>
                        <div className="text-zinc-500 hidden sm:block">{user?.role || 'Staff'}</div>
                    </div>
                    <Button variant="outline" onClick={logout} size="sm">
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};
