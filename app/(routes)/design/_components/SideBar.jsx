import { sideBarMenu } from '@/services/Options';
import React, { useState } from 'react';
import SideBarSettings from './SideBarSettings';

function SideBar() {
    const [selectedOption, setSelectedOption] = useState();

    return (
        <div className='flex'>
            {/* Left Sidebar */}
            <div className='p-2 w-[120px] border-r h-screen pt-2'>
                {sideBarMenu.map((menu, index) => (
                    <div
                        key={index}
                        className={`p-2 mb-2 flex flex-col items-center
                            hover:bg-secondary cursor-pointer 
                            ${menu.name === selectedOption?.name ? 'bg-secondary' : ''}`}
                        onClick={() =>
                            setSelectedOption((prev) =>
                                prev?.name === menu.name ? null : menu
                            )
                        }

                    >
                        <menu.icon />
                        <h2 className='mt-1 text-center'>{menu.name}</h2>
                    </div>
                ))}
            </div>

            {/* Conditionally show right panel only when a menu is selected */}
            {selectedOption && <SideBarSettings selectedOption={selectedOption} />}
        </div>
    );
}

export default SideBar;
