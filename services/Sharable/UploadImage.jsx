import React, { useState } from 'react';
import ImageKit from 'imagekit';
import { useParams } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';
import { fabric } from 'fabric'; // ✅ updated import
import { useTheme } from '@/context/ThemeContext';

function UploadImage() {
    const { designId } = useParams();
    const [loading, setLoading] = useState(false);
    const { canvasEditor } = useCanvasHook();
    const { theme } = useTheme();

    const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });

    const onFileUpload = async (event) => {
        if (!canvasEditor) {
            console.warn('Canvas editor not initialized yet');
            return;
        }

        setLoading(true);
        const file = event.target.files[0];

        try {
            const imageRef = await imagekit.upload({
                file: file,
                fileName: `${designId}.png`,
                isPublished: true,
            });

            fabric.Image.fromURL(
                imageRef?.url,
                (img) => {
                    img.set({
                        left: 100,
                        top: 100,
                        scaleX: 0.5,
                        scaleY: 0.5
                    });
                    canvasEditor.add(img);
                    canvasEditor.requestRenderAll();
                    setLoading(false);
                },
                { crossOrigin: 'anonymous' } // ✅ important fix
            );

        } catch (error) {
            console.error('Upload or canvas error:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <label htmlFor="uploadImage">
                <h2
                    className={`p-2 rounded-md text-center text-sm cursor-pointer
                    ${theme === 'dark'
                            ? 'bg-primary-foreground text-primary'
                            : 'bg-primary text-primary-foreground'}
                    hover:opacity-90 transition-opacity`}
                >
                    {loading ? <Loader2Icon className="animate-spin" /> : 'Upload Image'}
                </h2>
            </label>
            <input
                type="file"
                id="uploadImage"
                className="hidden"
                multiple={false}
                onChange={onFileUpload}
                accept="image/*"
            />
        </div>
    );
}

export default UploadImage;
