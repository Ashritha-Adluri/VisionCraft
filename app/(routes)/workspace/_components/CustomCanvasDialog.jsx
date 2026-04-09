import React, { useContext, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useMutation } from 'convex/react';
import { Loader2Icon } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function CustomCanvasDialog({ children }) {

    const [name, setName] = useState();
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();
    const [loading, setLoading] = useState(false);
    const { userDetail } = useContext(UserDetailContext);
    const createDesignRecord = useMutation(api.designs.CreateNewDesign);
    const router = useRouter();

    const onCreate = async () => {
        if (!userDetail?._id) {
            toast.error("Please login to your account before creating a design.");
            return;
        }
        toast('Loading...');
        setLoading(true);
        const result = await createDesignRecord({
            name: name,
            width: Number(width),
            height: Number(height),
            uid: userDetail?._id,
        });
        setLoading(false);
        router.push('/design/' + result);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create custom Canvas</DialogTitle>
                    <DialogDescription>
                        Please provide canvas width and height.
                    </DialogDescription>
                    {/* ✅ Moved outside to avoid <p><div>...</div></p> */}
                    <div className='mt-4'>
                        <div className='mt-2'>
                            <label>Design Name</label>
                            <Input placeholder="Design Name" onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='mt-5 flex gap-5 w-full'>
                            <div className='w-full'>
                                <label>Width</label>
                                <Input className='mt-1' type='number' placeholder={300} onChange={(e) => setWidth(e.target.value)} />
                            </div>
                            <div className='w-full'>
                                <label>Height</label>
                                <Input className='mt-1' type='number' placeholder={300} onChange={(e) => setHeight(e.target.value)} />
                            </div>
                        </div>
                        <div className='flex justify-end mt-6'>
                            <Button className='w-full'
                                disabled={loading || !name || !width || !height}
                                onClick={onCreate}>
                                {loading ? <Loader2Icon className='animate-spin' /> : 'Create'}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default CustomCanvasDialog;
