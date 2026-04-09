import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import React from 'react'
import { ThemeToggle } from '@/app/(routes)/design/_components/ThemeToggle' // Adjust path as needed


function WorkspaceHeader() {
    return (
        <div className='p-2 px-5 flex justify-between items-center shadow-sm'>
            <Image src={'/logo.jpg'} alt='logo' width={100} height={100}
                className='w-[150px] h-[55px]' />
            {/* <UserButton /> */}
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <UserButton />
            </div>
        </div>
    )
}

export default WorkspaceHeader
