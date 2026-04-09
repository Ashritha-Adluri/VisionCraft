'use client';
import React, { useEffect, useState } from 'react';
import ShapesSettings from '../Sharable/ShapesSettings';
import TextSettingsNavBar from './TextSettingsNavBar';
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

function TopNavBar() {
    const { canvasEditor } = useCanvasHook();
    const [activePanel, setActivePanel] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const { theme } = useTheme();

    useEffect(() => {
        if (!canvasEditor) return;

        const updateActivePanel = () => {
            const activeObject = canvasEditor.getActiveObject();
            if (!activeObject) {
                setActivePanel(null);
                setSelectedImage(null);
                return;
            }

            if (activeObject.type === 'image') {
                setSelectedImage(activeObject);
                setActivePanel('image');
            } else if (activeObject.text) {
                setActivePanel('text');
                setSelectedImage(null);
            } else {
                setActivePanel('shape');
                setSelectedImage(null);
            }
        };

        canvasEditor.on('selection:created', updateActivePanel);
        canvasEditor.on('selection:updated', updateActivePanel);
        canvasEditor.on('selection:cleared', () => {
            setActivePanel(null);
            setSelectedImage(null);
        });

        return () => {
            canvasEditor.off('selection:created', updateActivePanel);
            canvasEditor.off('selection:updated', updateActivePanel);
            canvasEditor.off('selection:cleared');
        };
    }, [canvasEditor]);

    const downloadSelectedImage = async () => {
        if (!selectedImage) return;

        const imgUrl = selectedImage.getSrc?.();
        if (!imgUrl) {
            alert('No valid image source found.');
            return;
        }

        try {
            const response = await fetch(imgUrl, { mode: 'cors' }); // Ensure CORS
            if (!response.ok) throw new Error('Failed to fetch image');

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'selected-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl); // Clean up
        } catch (err) {
            console.error('Download failed:', err);
            alert('Could not download image. Check browser CORS settings or source.');
        }
    };


    return (
        <div className={`p-3 bg-card border-b border-border flex items-center justify-between`}>
            <div>
                {activePanel === 'shape' && <ShapesSettings />}
                {activePanel === 'text' && <TextSettingsNavBar />}
            </div>

            {selectedImage && (
                <Button
                    variant="outline"
                    onClick={downloadSelectedImage}
                    className="ml-auto"
                >
                    Download Image
                </Button>
            )}
        </div>
    );
}

export default TopNavBar;
