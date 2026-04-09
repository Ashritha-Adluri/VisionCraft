import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { fabric } from 'fabric'; // ✅ Correct for Fabric 4.x
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

function SearchImages() {
    const [imageList, setImageList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const { canvasEditor } = useCanvasHook();


    useEffect(() => {
        GetImageList('Gradient');
    }, []);


    const GetImageList = async (query) => {
        try {
            const result = await axios.get('https://api.unsplash.com/search/photos', {
                params: {
                    query,
                    page: 1,
                    per_page: 30
                },
                headers: {
                    Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
                }
            });
            setImageList(result?.data?.results || []);
        } catch (error) {
            console.log(error);
        }
    };

    const addImageToCanvas = (imageUrl) => {
        try {

            fabric.Image.fromURL(
                imageUrl,
                (img) => {
                    img.set({
                        crossOrigin: 'anonymous',
                        left: 100,
                        top: 100,
                        scaleX: 0.5,
                        scaleY: 0.5,
                    });
                    canvasEditor.add(img);
                    canvasEditor.requestRenderAll();
                },
                { crossOrigin: 'anonymous' }
            );
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className='mt-5'>
            <h2 className='font-bold'>Search Images</h2>
            <div className='flex gap-2 items-center my-2'>
                <Input placeholder='Mountain' onChange={(e) => setSearchInput(e.target.value)} />
                <Button onClick={() => GetImageList(searchInput)}><SearchIcon /></Button>
            </div>
            <div className='mt-3 grid grid-cols-2 gap-2 overflow-auto h-[75vh]'>
                {imageList.map((image, index) => (
                    <div key={index} onClick={() => addImageToCanvas(image?.urls?.small)} className='cursor-pointer'>
                        <Image
                            src={image?.urls?.thumb}
                            alt={image?.alt_description || `Image-${index}`}
                            width={300}
                            height={300}
                            className='w-full h-[80px] rounded-sm object-cover'
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchImages;
