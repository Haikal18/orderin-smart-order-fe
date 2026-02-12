'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavbarSearch } from '@/context/navbarSearch';
import { useDebounce } from '@/hooks/useDebounce';

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
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);

    const navbarSearch = useNavbarSearch();
    const resolvedSearchQuery = searchQuery ?? navbarSearch?.searchQuery ?? '';
    const resolvedOnSearchChange = onSearchChange ?? navbarSearch?.setSearchQuery;

    // local input with debounce to avoid updating global/context on every keystroke
    const [localInput, setLocalInput] = useState<string>(resolvedSearchQuery);
    useEffect(() => setLocalInput(resolvedSearchQuery), [resolvedSearchQuery]);
    const debounced = useDebounce(localInput, 300);
    useEffect(() => {
        if (resolvedOnSearchChange) resolvedOnSearchChange(debounced);
    }, [debounced, resolvedOnSearchChange]);

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
            <div className="flex flex-wrap items-center justify-between gap-3">
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
                                    value={localInput}
                                    onChange={(e) => setLocalInput(e.target.value)}
                                    className="w-40 md:w-64"
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
                                            value={localInput}
                                            onChange={(e) => setLocalInput(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div> 

                <div className="flex items-center gap-3">
                    {/* compact user info on xs */}
                    <div className="hidden sm:flex text-sm flex-col items-end">
                        <div className="font-medium max-w-[140px] truncate">{user?.name || 'User'}</div>
                        <div className="text-zinc-500 hidden sm:block">{user?.role || 'Staff'}</div>
                    </div>

                    {/* small screen: show compact user button */}
                    <div className="flex items-center gap-2 sm:hidden">
                        <button
                            aria-label="User menu"
                            onClick={handleLogout}
                            disabled={mounted && isLoggingOut}
                            className="px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-900 text-sm"
                        >
                            {mounted && isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>

                    <div className="hidden sm:block">
                      <Button variant="outline" onClick={handleLogout} size="sm" disabled={mounted && isLoggingOut}>
                        {mounted && isLoggingOut ? 'Logging out...' : 'Logout'}
                      </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};
