import Image from 'next/image'
import React from 'react'
import TemplateList from '../_components/TemplateList'

function Templates() {
    return (
        <div className='p-10 w-full'>
            <div className='relative'>
                <Image src={'/banner.jpg'} alt='banner' width={'1800'} height={'300'}
                    className='w-full h-[150px] rounded-2xl object-cover' />
                <h2 className='text-3xl absolute bottom-5 left-10 text-white'>Templates</h2>
            </div>
            <TemplateList />
        </div>
    )
}

export default Templates
