'use client';
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useCanvasHook } from '../[designId]/page';
import TopNavBar from '@/services/Components/TopNavBar';

function CanvasEditor({ DesignInfo }) {
    const canvasRef = useRef(null);
    const { canvasEditor, setCanvasEditor } = useCanvasHook();
    const [selectedImage, setSelectedImage] = useState(null);


    const undoStack = useRef([]);
    const redoStack = useRef([]);
    const isRestoring = useRef(false);

    useEffect(() => {
        if (canvasRef.current && DesignInfo) {
            const initCanvas = new fabric.Canvas(canvasRef.current, {
                width: DesignInfo?.width || 800,
                height: DesignInfo?.height || 600,
                backgroundColor: '#fff',
                preserveObjectStacking: true,
                selection: true,
            });

            if (DesignInfo?.jsonTemplate) {
                initCanvas.loadFromJSON(DesignInfo.jsonTemplate, () => {
                    initCanvas.requestRenderAll();
                    undoStack.current.push(initCanvas.toJSON());
                });
            } else {
                undoStack.current.push(initCanvas.toJSON());
            }

            canvasRef.current.tabIndex = 1;
            canvasRef.current.style.outline = 'none';
            canvasRef.current.focus();

            setCanvasEditor(initCanvas);

            return () => {
                initCanvas.dispose();
            };
        }
    }, [DesignInfo, setCanvasEditor]);


    useEffect(() => {
        if (!canvasEditor) return;

        const handleSelection = () => {
            const activeObject = canvasEditor.getActiveObject();
            if (activeObject && activeObject.type === 'image') {
                setSelectedImage(activeObject);
            } else {
                setSelectedImage(null);
            }
        };

        canvasEditor.on('selection:created', handleSelection);
        canvasEditor.on('selection:updated', handleSelection);
        canvasEditor.on('selection:cleared', () => setSelectedImage(null));

        return () => {
            canvasEditor.off('selection:created', handleSelection);
            canvasEditor.off('selection:updated', handleSelection);
            canvasEditor.off('selection:cleared');
        };
    }, [canvasEditor]);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!canvasEditor) return;

            const isCtrl = event.ctrlKey || event.metaKey;

            // Undo
            if (isCtrl && (event.key === 'z' || event.key === 'Z')) {
                event.preventDefault();
                if (undoStack.current.length <= 1) return;

                isRestoring.current = true;
                const currentState = undoStack.current.pop();
                redoStack.current.push(currentState);
                const previousState = undoStack.current[undoStack.current.length - 1];

                canvasEditor.loadFromJSON(previousState, () => {
                    canvasEditor.renderAll();
                    isRestoring.current = false;
                });
            }

            // Redo
            if (isCtrl && (event.key === 'y' || event.key === 'Y')) {
                event.preventDefault();
                if (redoStack.current.length === 0) return;

                isRestoring.current = true;
                const nextState = redoStack.current.pop();
                undoStack.current.push(nextState);

                canvasEditor.loadFromJSON(nextState, () => {
                    canvasEditor.renderAll();
                    isRestoring.current = false;
                });
            }

            // Delete
            if (event.key === 'Delete') {
                const activeObjects = canvasEditor.getActiveObjects();
                if (activeObjects.length > 0) {
                    canvasEditor.discardActiveObject();
                    activeObjects.forEach(obj => canvasEditor.remove(obj));
                    canvasEditor.requestRenderAll();
                    event.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canvasEditor]);

    return (
        <div className="bg-secondary w-full h-screen">
            <TopNavBar />
            <div className="mt-15 flex items-center justify-center flex-col relative">
                <canvas id="canvas" ref={canvasRef} />
            </div>
        </div>
    );
}

export default CanvasEditor;
