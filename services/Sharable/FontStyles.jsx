import React from 'react'
import { Bold, Italic, Underline } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page'


function FontStyles() {

    const { canvasEditor } = useCanvasHook();
    const activeObject = canvasEditor.getActiveObject();

    const onSettingClick = (type) => {
        const activeObject = canvasEditor.getActiveObject();
        if (activeObject) {
            if (type == 'bold') {
                activeObject.set({
                    fontWeight: activeObject?.fontWeight == 'bold' ? 'normal' : 'bold'
                })
            }
            if (type == 'italic') {
                activeObject.set({
                    fontWeight: activeObject?.fontWeight == 'italic' ? 'normal' : 'italic'
                })
            }
            if (type == 'underline') {
                activeObject.set({
                    underline: activeObject?.underline ? false : true
                })
            }
            // canvasEditor.add(activeObject);
            canvasEditor.requestRenderAll();
        }
    }

    return (
        <div>
            <Toggle aria-label="Toggle"
                defaultPressed={activeObject?.fontWeight == 'bold'}
                onClick={() => onSettingClick('bold')}>
                <Bold className="h-4 w-4" size={'lg'} />
            </Toggle>
            <Toggle aria-label="Toggle"
                defaultPressed={activeObject?.fontWeight == 'italic'}
                onClick={() => onSettingClick('italic')}>
                <Italic className="h-4 w-4" size={'lg'} />
            </Toggle>
            <Toggle aria-label="Toggle"
                defaultPressed={activeObject?.fontWeight == 'underline'}
                onClick={() => onSettingClick('underline')}>
                <Underline className="h-4 w-4" size={'lg'} />
            </Toggle>
        </div>
    )
}

export default FontStyles
