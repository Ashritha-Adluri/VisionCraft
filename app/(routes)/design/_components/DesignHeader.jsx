import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserButton } from '@stackframe/stack';
import { Download, Save } from 'lucide-react';
import Image from 'next/image';
import { useCanvasHook } from '../[designId]/page';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ImageKit from 'imagekit';
import { ThemeToggle } from './ThemeToggle';

function DesignHeader({ DesignInfo }) {
    const SaveDesign = useMutation(api.designs.SaveDesign);
    const { designId } = useParams();
    const { canvasEditor } = useCanvasHook();
    const router = useRouter();

    const [designName, setDesignName] = useState('');

    useEffect(() => {
        if (DesignInfo?.name) {
            setDesignName(DesignInfo.name);
        }
    }, [DesignInfo]);

    const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });

    const onSave = async () => {
        if (!canvasEditor) return;

        const toastId = toast.loading('Saving...');
        try {
            const base64Image = canvasEditor.toDataURL({
                format: 'png',
                quality: 0.5
            });

            const existingFiles = await imagekit.listFiles({
                searchQuery: `name="${designId}.png"`
            });

            if (existingFiles.length > 0) {
                await imagekit.deleteFile(existingFiles[0].fileId);
            }

            const imageRef = await imagekit.upload({
                file: base64Image,
                fileName: designId + ".png",
                isPublished: true,
                useUniqueFileName: false,
                invalidateCache: true
            });

            const JsonDesign = canvasEditor.toJSON();

            await SaveDesign({
                id: designId,
                jsonDesign: JsonDesign,
                imagePreview: `${imageRef.url}?t=${Date.now()}` // ✅ force preview refresh
                // name: designName, // optional: include if editable
            });

            toast.success('Saved!', { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error('Failed to save', { id: toastId });
        }
    };

    const onExport = () => {
        const dataUrl = canvasEditor?.toDataURL({
            format: 'png',
            quality: 1
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = 'CreatifyDesign.png';
        link.click();
    };

    return (
        <div className='p-3 flex justify-between bg-gradient-to-r from-sky-500 via-blue-400 to-purple-600'>
            <div onClick={() => router.push('/workspace')} className="cursor-pointer">
                <Image src={'/logo.jpg'} alt='logo' width={100} height={100} />
            </div>
            <input
                placeholder='Design Name'
                className='text-white border-none outline-none bg-transparent text-lg font-medium'
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
            />
            <div className='flex gap-5'>
                <Button onClick={onSave} className='cursor-pointer'>
                    <Save className='mr-2 h-4 w-4' /> Save
                </Button>
                <Button onClick={onExport} className='cursor-pointer'>
                    <Download className='mr-2 h-4 w-4' /> Export
                </Button>
                <ThemeToggle />
                <UserButton />
            </div>
        </div>
    );
}

export default DesignHeader;
