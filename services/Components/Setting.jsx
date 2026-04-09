'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';

function Setting() {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const { canvasEditor } = useCanvasHook();
    const { designId } = useParams();
    const updateDesign = useMutation(api.designs.UpdateDesign); // You need this mutation

    const handleUpdate = async () => {
        if (!canvasEditor) {
            toast.error('Canvas is not ready.');
            return;
        }

        if (!width || !height) {
            toast.error('Please enter both width and height.');
            return;
        }

        const numericWidth = Number(width);
        const numericHeight = Number(height);

        if (isNaN(numericWidth) || isNaN(numericHeight)) {
            toast.error('Width and Height must be numbers.');
            return;
        }

        // toast.loading('Updating canvas size...');

        try {
            // Update canvas size
            canvasEditor.setWidth(numericWidth);
            canvasEditor.setHeight(numericHeight);

            // Update the database
            await updateDesign({
                id: designId,
                width: numericWidth,
                height: numericHeight
            });

            toast.success('Canvas size updated!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update canvas size.');
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            {/* <h2 className="text-lg font-bold">Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">Before changing canvas size, save your work.</p> */}

            <div className="flex flex-col gap-3">
                <div>
                    <label className="text-sm">Width (px)</label>
                    <Input
                        type="number"
                        placeholder="Enter width"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm">Height (px)</label>
                    <Input
                        type="number"
                        placeholder="Enter height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="mt-1"
                    />
                </div>

                <Button
                    onClick={handleUpdate}
                    className="mt-4"
                    disabled={!width || !height}
                >
                    Update Canvas Size
                </Button>
            </div>
        </div>
    );
}

export default Setting;
