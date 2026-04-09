import React, { useState } from 'react';
import { fabric } from 'fabric';
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';

function TextSettings() {
    const { canvasEditor } = useCanvasHook();
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [isEraserMode, setIsEraserMode] = useState(false);

    const onAddTextClick = (type) => {
        if (!canvasEditor) return;

        const baseProps = {
            fontFamily: 'Arial',
            fill: 'black',
            left: 100,
            top: 100,
            selectable: true,
            evented: true,
            hasControls: true,
            hasBorders: true,
        };

        const textMap = {
            Heading: { text: 'Add Heading', fontSize: 35, fontWeight: 'bold' },
            Subheading: { text: 'Add Sub Heading', fontSize: 25, fontWeight: '400' },
            para: { text: 'Add paragraph', fontSize: 19, fontWeight: 'normal' }
        };

        const { text, fontSize, fontWeight } = textMap[type];
        const textRef = new fabric.IText(text, {
            ...baseProps,
            fontSize,
            fontWeight
        });

        canvasEditor.add(textRef);
    };

    const toggleDrawingMode = () => {
        if (!canvasEditor) return;

        const newMode = !isDrawingMode;
        setIsDrawingMode(newMode);
        setIsEraserMode(false); // disable eraser
        canvasEditor.isDrawingMode = newMode;

        if (newMode) {
            canvasEditor.freeDrawingBrush = new fabric.PencilBrush(canvasEditor);
            canvasEditor.freeDrawingBrush.color = 'black';
            canvasEditor.freeDrawingBrush.width = 3;
            canvasEditor.defaultCursor = 'none';
            canvasEditor.upperCanvasEl.classList.add('pencil-cursor');
        } else {
            canvasEditor.defaultCursor = 'default';
            canvasEditor.upperCanvasEl.classList.remove('pencil-cursor');
        }
    };

    const toggleEraserMode = () => {
        if (!canvasEditor) return;

        const newEraserMode = !isEraserMode;
        setIsEraserMode(newEraserMode);
        setIsDrawingMode(false); // disable pencil
        canvasEditor.isDrawingMode = newEraserMode;
        canvasEditor.upperCanvasEl.classList.remove('pencil-cursor');

        if (newEraserMode) {
            const whiteBrush = new fabric.PencilBrush(canvasEditor);
            whiteBrush.width = 20;
            whiteBrush.color = '#ffffff'; // match canvas background
            canvasEditor.freeDrawingBrush = whiteBrush;
            canvasEditor.defaultCursor = 'none';
            canvasEditor.upperCanvasEl.classList.add('eraser-cursor');
        } else {
            canvasEditor.isDrawingMode = false;
            canvasEditor.defaultCursor = 'default';
            canvasEditor.upperCanvasEl.classList.remove('eraser-cursor');
        }
    };

    return (
        <div className='flex flex-col gap-3'>
            <h2 className='font-bold text-3xl p-3 bg-secondary rounded-xl cursor-pointer'
                onClick={() => onAddTextClick('Heading')}
            >Add Heading</h2>

            <h2 className='font-medium text-xl p-3 bg-secondary rounded-xl cursor-pointer'
                onClick={() => onAddTextClick('Subheading')}
            >Add Sub Heading</h2>

            <h2 className='text-md p-3 bg-secondary rounded-xl cursor-pointer'
                onClick={() => onAddTextClick('para')}
            >Add Paragraph</h2>

            <h2 className={`text-md p-3 rounded-xl cursor-pointer transition-all duration-200 ${isDrawingMode ? 'bg-green-600 text-white' : 'bg-secondary'}`}
                onClick={toggleDrawingMode}
            >
                {isDrawingMode ? 'Disable Pencil Tool' : 'Enable Pencil Tool'}
            </h2>
            <h2 className={`text-md p-3 rounded-xl cursor-pointer transition-all duration-200 ${isEraserMode ? 'bg-green-600 text-white' : 'bg-secondary'}`}
                onClick={toggleEraserMode}
            >
                {isEraserMode ? 'Disable Eraser Tool' : 'Enable Eraser Tool'}
            </h2>
        </div>
    );
}

export default TextSettings;
