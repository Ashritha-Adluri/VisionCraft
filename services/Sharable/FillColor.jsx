import React, { useState } from 'react'
import ColorPickerEditor from './ColorPickerEditor'
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';

function FillColor() {

    const [color, setColor] = useState('#000');
    const { canvasEditor } = useCanvasHook();

    const onColorChange = (color) => {
        setColor(color);
        const activeObject = canvasEditor.getActiveObject();
        if (activeObject) {
            activeObject.set({
                fill: color
            });
            // canvasEditor.add(activeObject);
            canvasEditor.requestRenderAll();
        }
    }

    return (
        <div>
            <ColorPickerEditor onColorChange={(v) => onColorChange(v)}
                value={color}
            />
        </div>
    )
}

export default FillColor
