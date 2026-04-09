"use client"
import { WorkspaceMenu } from '@/services/Options'
import { CirclePlus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import CustomCanvasDialog from './CustomCanvasDialog'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'

function Sidebar() {
    const path = usePathname();
    const { theme } = useTheme(); // Get current theme

    return (
        <div className={`h-screen shadow-sm p-2 bg-sidebar`}>
            <div className='p-2 flex items-center flex-col hover:cursor-pointer mb-4'>
                <CustomCanvasDialog>
                    <Button className='cursor-pointer'>Create</Button>
                </CustomCanvasDialog>
            </div>
            {WorkspaceMenu.map((menu, index) => (
                <Link href={menu.path} key={index}>
                    <div key={index} className={`p-2 flex items-center flex-col mb-4
                        group hover:bg-sidebar-accent rounded-xl cursor-pointer
                        ${menu.path === path ? 'bg-sidebar-accent' : ''}`}>
                        <menu.icon className={`group-hover:text-sidebar-accent-foreground 
                            ${menu.path === path ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`} />
                        <h2 className={`text-sm group-hover:text-sidebar-accent-foreground
                            ${menu.path === path ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
                            {menu.name}
                        </h2>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Sidebar