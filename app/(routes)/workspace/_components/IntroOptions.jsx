"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { canvasSizeOptions } from '@/services/Options'
import { useMutation } from 'convex/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'
import { toast } from 'sonner';

function IntroOptions() {

    // const createDesignRecord = useMutation(api.designs.CreateNewDesign);
    // const { userDetail } = useContext(UserDetailContext);
    const createDesignRecord = useMutation(api.designs.CreateNewDesign);
    const { userDetail } = useContext(UserDetailContext);
    const router = useRouter();


    const OnCanvasOptionSelect = async (option) => {
        toast('Loading...')
        const result = await createDesignRecord({
            name: option.name,
            width: option.width,
            height: option.height,
            uid: userDetail?._id
        });
        console.log(result);
        router.push('/design/' + result);
    }

    return (
        <div>
            <div className='relative'>
                <Image src={'/banner.jpg'} alt='banner' width={'1800'} height={'300'}
                    className='w-full h-[150px] rounded-2xl object-cover' />
                <h2 className='text-3xl absolute bottom-5 left-10 text-white'>Workspace</h2>
            </div>
            <div className='flex gap-10 item-center mt-10 justify-center'>
                {canvasSizeOptions.map((option, index) => (
                    <div key={index} className='flex flex-col items-center cursor-pointer'
                        onClick={() => OnCanvasOptionSelect(option)} >
                        <Image src={option.icon} alt={option.name} width={45} height={45}
                            className='hover:scale-105 translate-all' />
                        <h2 className='text-xs mt-3 font-medium'>{option.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default IntroOptions
