import { useCanvasHook } from '@/app/(routes)/design/[designId]/page'
import { Slider } from '@/components/ui/slider';
import React from 'react'

function BorderWidth() {

    const { canvasEditor } = useCanvasHook();
    const onWidthChange = (value) => {
        const activeObject = canvasEditor.getActiveObject();
        if (activeObject) {
            activeObject.set({
                strokeWidth: value
            });
            // canvasEditor.add(activeObject);
            canvasEditor.requestRenderAll();
        }
    }

    return (
        <div>
            <h2 className='my-2'>Border width</h2>
            <Slider defaultValue={[10]} max={100} step={1}
                onValueChange={(v) => onWidthChange(v[0])}
                className="w-full max-w-[400px]" />
        </div>
    )
}

export default BorderWidth
