'use client'

import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

export const LayoutProvider = ({ children }) => {
    const pathname = usePathname();
    return (
        <>
            {pathname !== "/" && pathname !== '/register' ? <Sidebar /> : ''}
            {children}
        </>
    )
};

