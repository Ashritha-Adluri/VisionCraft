"use client";

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import CustomCanvasDialog from './CustomCanvasDialog';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useRouter } from 'next/navigation';
import { Trash2, Pencil } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { Input } from '@/components/ui/input';

function RecentDesign() {
    const [designList, setDesignList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedToDelete, setSelectedToDelete] = useState(null);
    const [renamingId, setRenamingId] = useState(null);
    const [newName, setNewName] = useState('');
    const convex = useConvex();
    const { userDetail } = useContext(UserDetailContext);
    const router = useRouter();

    useEffect(() => {
        if (userDetail?._id) {
            fetchRecentDesigns();
        } else {
            setLoading(false);
        }
    }, [userDetail?._id]);

    const fetchRecentDesigns = async () => {
        setLoading(true);
        const result = await convex.query(api.designs.GetUserDesigns, {
            uid: userDetail._id
        });
        setDesignList(result);
        setLoading(false);
    };

    const handleRename = async (id) => {
        await convex.mutation(api.designs.UpdateDesign, {
            id,
            name: newName,
        });
        setDesignList(prev =>
            prev.map(d => d._id === id ? { ...d, name: newName } : d)
        );
        setRenamingId(null);
        setNewName('');
    };

    return (
        <div className="mt-7">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl">Recent Designs</h2>
                {designList.length > 0 && (
                    <Button variant="outline" onClick={fetchRecentDesigns}>⟳ Refresh</Button>
                )}
            </div>

            {loading ? (
                <p className="text-center text-muted-foreground">Loading your designs...</p>
            ) : designList.length === 0 ? (
                <div className="flex flex-col gap-4 items-center mt-5">
                    <Image src="/edit.webp" alt="edit" width={80} height={80} />
                    <h2 className="text-center">You don't have any design created. Create a new one!</h2>
                    <CustomCanvasDialog>
                        <Button className="cursor-pointer">+ Create New</Button>
                    </CustomCanvasDialog>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {designList.map((design) => (
                        <div
                            key={design._id}
                            className="relative bg-secondary rounded-lg hover:scale-105 transition-all duration-200 group"
                        >
                            {/* Action Icons */}
                            <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Trash2
                                    className="w-5 h-5 text-red-500 hover:scale-110 cursor-pointer"
                                    title="Delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedToDelete(design._id);
                                    }}
                                />
                                <Pencil
                                    className="w-5 h-5 text-blue-500 hover:scale-110 cursor-pointer"
                                    title="Rename"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRenamingId(design._id);
                                        setNewName(design.name);
                                    }}
                                />
                            </div>

                            <div onClick={() => router.push('/design/' + design._id)}>
                                <Image
                                    src={
                                        design.imagePreview?.startsWith('http')
                                            ? `${design.imagePreview}?updated=${new Date(
                                                design._updatedAt || design._creationTime || Date.now()
                                            ).getTime()}`
                                            : '/fallback.png'
                                    }
                                    alt={design.name || 'Design Preview'}
                                    width={300}
                                    height={200}
                                    className="w-full h-[200px] object-contain rounded-lg"
                                />

                                {renamingId === design._id ? (
                                    <div className="px-2 pb-2">
                                        <Input
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onBlur={() => setRenamingId(null)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleRename(design._id);
                                            }}
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <p className="text-center py-2 font-medium">{design.name}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={!!selectedToDelete}
                onClose={() => setSelectedToDelete(null)}
                onConfirm={async () => {
                    await convex.mutation(api.designs.DeleteDesign, { id: selectedToDelete });
                    setDesignList(prev => prev.filter((d) => d._id !== selectedToDelete));
                    setSelectedToDelete(null);
                }}
            />
        </div>
    );
}

export default RecentDesign;
