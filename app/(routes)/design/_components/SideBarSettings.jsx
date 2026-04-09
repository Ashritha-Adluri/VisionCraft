import React, { useRef, useState, useEffect } from 'react';

function SideBarSettings({ selectedOption }) {
    const MIN_WIDTH = 280;
    const MAX_WIDTH = 600;

    const [width, setWidth] = useState(MIN_WIDTH);
    const [isResizing, setIsResizing] = useState(false);
    const panelRef = useRef();

    const startResizing = () => setIsResizing(true);
    const stopResizing = () => setIsResizing(false);

    const handleMouseMove = (e) => {
        if (!isResizing) return;
        const sidebarLeft = panelRef.current.getBoundingClientRect().left;
        const newWidth = Math.min(Math.max(e.clientX - sidebarLeft, MIN_WIDTH), MAX_WIDTH);
        setWidth(newWidth);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing]);

    if (!selectedOption) return null;

    return (
        <div
            ref={panelRef}
            className="flex flex-col h-screen border-r overflow-hidden relative"
            style={{
                width,
                scrollbarWidth: 'thin', // For Firefox
            }}
        >
            {/* Custom scrollbar styles */}
            <style jsx>{`
                ::-webkit-scrollbar {
                    width: 16px;  /* Increased scrollbar width */
                    height: 16px; /* Increased horizontal scrollbar height */
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #c1c1c1;
                    border-radius: 8px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: #a8a8a8;
                }
                ::-webkit-scrollbar-track {
                    background-color: #f1f1f1;
                }
            `}</style>

            {/* Header */}
            <div className="p-5 border-b shrink-0">
                <h2 className="font-bold">{selectedOption?.name}</h2>
                <p className="text-sm text-gray-500">{selectedOption?.desc}</p>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5">
                {selectedOption?.component}
            </div>

            {/* Resizer */}
            <div
                className="absolute top-0 right-0 w-4 h-full cursor-col-resize bg-gray-400 hover:bg-gray-500"
                onMouseDown={startResizing}
            />
        </div>
    );
}

export default SideBarSettings;