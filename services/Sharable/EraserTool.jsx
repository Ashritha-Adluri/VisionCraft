// components/EraserTool.jsx
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';
import React from 'react';

function EraserTool() {
    const { canvasEditor } = useCanvasHook();

    const handleErase = () => {
        const activeObject = canvasEditor?.getActiveObject();
        if (activeObject) {
            canvasEditor.remove(activeObject);
            canvasEditor.discardActiveObject();
            canvasEditor.requestRenderAll();
        }
    };

    return (
        <button
            onClick={handleErase}
            className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        >
            Delete Selected Object
        </button>
    );
}

export default EraserTool;
