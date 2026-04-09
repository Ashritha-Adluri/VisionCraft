import React from 'react';
import { shapesSettingsList } from '../Options';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';
import { Trash } from 'lucide-react';

function ShapesSettings() {
    const { canvasEditor } = useCanvasHook();

    const onDelete = () => {
        if (!canvasEditor) return;

        // Handle both single objects and active groups
        const activeObjects = canvasEditor.getActiveObjects();
        if (activeObjects.length > 0) {
            canvasEditor.discardActiveObject(); // Clear selection first
            activeObjects.forEach(obj => canvasEditor.remove(obj));
            canvasEditor.requestRenderAll(); // More efficient than renderAll
        }
    };

    if (!canvasEditor) return null;

    return (
        <div className='flex gap-4'>
            {shapesSettingsList.map((shape, index) => (
                <div key={`shape-${index}`} className='hover:scale-105 transition-all cursor-pointer'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <shape.icon
                                aria-label={`Open ${shape.icon.name} settings`}
                                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                            {shape.component}
                        </PopoverContent>
                    </Popover>
                </div>
            ))}
            <Trash
                onClick={onDelete}
                className='hover:scale-105 transition-all cursor-pointer'
                aria-label="Delete selected shape"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onDelete()}
            />
        </div>
    );
}

export default ShapesSettings;