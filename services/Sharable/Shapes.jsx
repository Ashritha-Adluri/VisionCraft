import React from 'react';
import { ShapeList } from '../Options';
import Image from 'next/image';
import { fabric } from 'fabric'; // ✅ Standard Fabric import
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';

function Shapes() {
    const { canvasEditor } = useCanvasHook();

    const onShapeSelect = (shape) => {
        if (!canvasEditor) return;

        const baseProps = {
            left: 100,
            top: 100,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2,
            selectable: true,
            evented: true,
            hasControls: true,
            hasBorders: true,
        };

        let shapeRef = null;

        switch (shape.name) {
            case 'Circle':
                shapeRef = new fabric.Circle({
                    ...baseProps,
                    radius: 50,
                });
                break;

            case 'Ellipse':
                shapeRef = new fabric.Ellipse({
                    ...baseProps,
                    rx: 75,
                    ry: 50,
                });
                break;

            case 'Rectangle':
                shapeRef = new fabric.Rect({
                    ...baseProps,
                    width: 150,
                    height: 100,
                });
                break;

            case 'Square':
                shapeRef = new fabric.Rect({
                    ...baseProps,
                    width: 100,
                    height: 100,
                });
                break;

            case 'Triangle':
                shapeRef = new fabric.Triangle({
                    ...baseProps,
                    width: 100,
                    height: 100,
                });
                break;

            case 'Line':
                shapeRef = new fabric.Line([10, 10, 200, 200], {
                    stroke: 'black',
                    strokeWidth: 5,
                    ...baseProps,
                });
                break;

            default:
                return;
        }

        canvasEditor.add(shapeRef);
        canvasEditor.requestRenderAll();
    };

    return (
        <div>
            <div className="grid grid-cols-3 gap-3">
                {ShapeList.map((shape, index) => (
                    <div
                        key={index}
                        className="p-2 border rounded-xl cursor-pointer hover:bg-gray-100"
                        onClick={() => onShapeSelect(shape)}
                    >
                        <Image src={shape.icon} alt={shape.name} width={100} height={100} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Shapes;
