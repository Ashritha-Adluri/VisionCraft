'use client';
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';
import { Button } from '@/components/ui/button';
import { fabric } from 'fabric';
import ImageKit from 'imagekit';
import { ImageUp, Loader } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

function CustomImageUpload({
    selectedAi,
    processedImage,
    generatedImage,
    setProcessedImage,
    setGeneratedImage,
    setUploadedFile,
    currentImage,
    setCurrentImage,
    transformationChain,
    setTransformationChain
}) {
    const [imageLoading, setImageLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const { canvasEditor } = useCanvasHook();
    const { designId } = useParams();
    const fileInputRef = useRef(null);

    const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });

    const onImageUpload = async (event) => {
        setUploadLoading(true);
        const toastId = toast.loading('Uploading image...');
        try {
            const file = event.target.files[0];
            if (file) {
                setUploadedFile?.(file);

                const imageRef = await imagekit.upload({
                    file: file,
                    fileName: designId + '.png',
                    isPublished: true,
                });

                setProcessedImage?.(null);
                setGeneratedImage?.(null);
                setCurrentImage?.(imageRef.url);
                setTransformationChain?.([]);
            }

            toast.success('Image uploaded successfully!', { id: toastId });
        } catch (error) {
            toast.error('Failed to upload image. Please try again.', { id: toastId });
        } finally {
            // Reset file input so same file can be reselected later
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setUploadLoading(false);
        }
    };


    const getTransformedUrl = () => {
        if (!currentImage) return null;

        const commands = transformationChain?.join(',');
        return commands
            ? currentImage.includes('?tr=')
                ? `${currentImage},${commands}`
                : `${currentImage}?tr=${commands}`
            : currentImage;
    };

    const onAddToCanvas = async () => {
        const toastId = toast.loading('Adding image to canvas...');
        try {
            const imageUrl = getTransformedUrl() || processedImage || generatedImage;
            if (!imageUrl) {
                toast.error('No image URL available.', { id: toastId });
                return;
            }

            let finalUrl = imageUrl;

            if (imageUrl.startsWith('blob:')) {
                try {
                    const response = await fetch(imageUrl);
                    if (!response.ok) throw new Error();

                    const blob = await response.blob();
                    finalUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = () => reject();
                        reader.readAsDataURL(blob);
                    });
                } catch {
                    toast.error('Failed to read blob image.', { id: toastId });
                    return;
                }
            }

            fabric.Image.fromURL(
                finalUrl,
                (img) => {
                    img.set({
                        crossOrigin: 'anonymous',
                        left: 100,
                        top: 100,
                        scaleX: 0.5,
                        scaleY: 0.5
                    });
                    canvasEditor.add(img);
                    canvasEditor.requestRenderAll();
                    toast.success('Image added to canvas!', { id: toastId });
                },
                { crossOrigin: 'anonymous' }
            );
        } catch (error) {
            toast.error('Unexpected error while adding image.', { id: toastId });
        } finally {
            try {
                if (generatedImage?.startsWith('blob:')) URL.revokeObjectURL(generatedImage);
                if (processedImage?.startsWith('blob:')) URL.revokeObjectURL(processedImage);
            } catch (revokeError) {
                console.warn('Failed to revoke blob URL:', revokeError);
            }
        }
    };

    const checkImageAvailability = async (url, retries = 3, delay = 2000) => {
        setImageLoading(true);
        for (let i = 0; i < retries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) {
                    setImageLoading(false);
                    return true;
                }
            } catch { }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        setImageLoading(false);
        toast.error('Image processing failed. Please try again.');
        return false;
    };

    useEffect(() => {
        const transformedUrl = getTransformedUrl();
        if (transformedUrl && selectedAi?.command && selectedAi.command !== 'text-to-image') {
            checkImageAvailability(transformedUrl);
        }
    }, [currentImage, transformationChain]);

    const transformedImageUrl = getTransformedUrl();
    const showGeneratedImage = selectedAi?.command === 'text-to-image' && generatedImage;
    const showUploadedImage = transformedImageUrl && !showGeneratedImage && !processedImage;

    return (
        <div>
            {processedImage && (
                <UploadedImagePreview
                    src={processedImage}
                    alt="Processed Image"
                    onRemove={() => {
                        setProcessedImage(null);
                        setCurrentImage(null);
                    }}
                />
            )}

            {!processedImage && showGeneratedImage && (
                <UploadedImagePreview
                    src={generatedImage}
                    alt="Generated Image"
                    onRemove={() => {
                        setGeneratedImage(null);
                        setCurrentImage(null);
                    }}
                />
            )}

            {!processedImage && !showGeneratedImage && showUploadedImage && (
                imageLoading ? (
                    <LoadingState text={`Processing ${selectedAi?.command || 'image'}...`} />
                ) : (
                    <UploadedImagePreview
                        src={transformedImageUrl}
                        alt="Uploaded Image"
                        onRemove={() => setCurrentImage(null)}
                    />
                )
            )}

            {!processedImage && !showGeneratedImage && !showUploadedImage && <UploadButton />}

            <input
                type="file"
                id="uploadImage"
                className="hidden"
                ref={fileInputRef}
                onChange={onImageUpload}
                accept="image/*"
            />

            {(processedImage || showGeneratedImage || showUploadedImage) && (
                <Button className="w-full my-2" size="sm" onClick={onAddToCanvas} disabled={uploadLoading || imageLoading}>
                    {(uploadLoading || imageLoading) && <Loader className="animate-spin mr-2" />}
                    Add To Canvas
                </Button>
            )}
        </div>
    );
}

// Reusable Components
const UploadedImagePreview = ({ src, alt, onRemove }) => (
    <div className="relative">
        <Image
            src={src}
            alt={alt}
            width={300}
            height={300}
            className="w-full h-[150px] rounded-lg object-contain bg-gray-100"
        />
        <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={onRemove}>
            Remove
        </Button>
    </div>
);

const LoadingState = ({ text }) => (
    <div className="flex items-center justify-center h-[150px]">
        <Loader className="animate-spin" />
        <span className="ml-2">{text}</span>
    </div>
);

const UploadButton = () => (
    <label
        htmlFor="uploadImage"
        className="bg-secondary p-4 flex flex-col items-center justify-center rounded-xl h-[100px] mb-4 cursor-pointer"
    >
        <ImageUp />
        <h2 className="text-xs">Upload Image</h2>
    </label>
);

export default CustomImageUpload;
