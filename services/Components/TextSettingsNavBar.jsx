import React from 'react';
import { TextSettingsList } from '../Options';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCanvasHook } from '@/app/(routes)/design/[designId]/page';
import { Trash } from 'lucide-react';
import FontStyles from '../Sharable/FontStyles';

function TextSettingsNavBar() {
  const { canvasEditor } = useCanvasHook();

  const onDelete = () => {
    if (!canvasEditor) return;

    const activeObjects = canvasEditor.getActiveObjects();
    if (activeObjects.length > 0) {
      canvasEditor.discardActiveObject();
      activeObjects.forEach(obj => canvasEditor.remove(obj));
      canvasEditor.requestRenderAll();
    }
  };



  if (!canvasEditor) return null;

  return (
    <div className='flex gap-4'>
      {TextSettingsList.map((shape, index) => (
        <div key={index} className='hover:scale-105 transition-all cursor-pointer'>
          <Popover>
            <PopoverTrigger asChild>
              <shape.icon aria-label={`Open ${shape.icon.name} settings`} />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              {shape.component}
            </PopoverContent>
          </Popover>
        </div>
      ))}

      <FontStyles />



      <Trash
        onClick={onDelete}
        className='hover:scale-105 transition-all cursor-pointer'
        aria-label="Delete selected text"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onDelete()}
      />
    </div>
  );


}

export default TextSettingsNavBar;