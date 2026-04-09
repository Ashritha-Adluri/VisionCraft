import { Blend, BookType, Bot, Component, Eraser, Folder, Home, Image, LayoutDashboardIcon, LayoutTemplate, Minus, Palette, PanelTop, Settings, ShapesIcon, Sparkle, Square, SquareRoundCorner, Trash, Type, WalletCardsIcon } from "lucide-react";
import BackgroundSetting from "./Components/BackgroundSetting";
import AddImageSetting from "./Components/AddImageSetting";
import Elements from "./Components/Elements";
import FillColor from "./Sharable/FillColor";
import BorderColor from "./Sharable/BorderColor";
import BorderWidth from "./Sharable/BorderWidth";
import Opacity from "./Sharable/Opacity";
import AiTransformSetting from "./Components/AiTransformSetting";
import TextSettings from "./Components/TextSettings";
import FontFamily from "./Sharable/FontFamily";
import EraserTool from './Sharable/EraserTool';
import AiFeedback from "./Components/AiFeedback";
import Setting from "./Components/Setting";

export const WorkspaceMenu = [
    {
        name: 'Home',
        icon: Home,
        path: '/workspace'
    },
    {
        name: 'Projects',
        icon: Folder,
        path: '/workspace/projects',
    },
    {
        name: 'Templates',
        icon: PanelTop,
        path: '/workspace/templates',
    }
]

export const canvasSizeOptions = [
    {
        name: 'Instagram post',
        width: 378,
        height: 472.5,
        icon: '/instagram-logo.png'
    },
    {
        name: 'Youtube Thumbnail',
        width: 750,
        height: 550,
        icon: '/youtube-logo.png'
    },
    {
        name: 'Presentations',
        width: 800,
        height: 460,
        icon: '/pres.jpg'
    }
]

export const sideBarMenu = [
    {
        name: 'Elements',
        desc: 'Select shapes and stickers',
        icon: ShapesIcon,
        component: <Elements />
    },
    {
        name: 'Images',
        desc: 'Add Image or Upload your own',
        icon: Image,
        component: <AddImageSetting />
    },
    {
        name: 'Text',
        desc: 'Add Text and heading',
        icon: Type,
        component: <TextSettings />
    },
    {
        name: 'AI',
        desc: 'More AI to enhance your design',
        icon: Sparkle,
        component: <AiTransformSetting />
    },
    {
        name: 'Background',
        desc: 'Change Canvas Background',
        icon: Component,
        component: <BackgroundSetting />
    },
    {
        name: 'AI Feedback',
        desc: 'Feedback for your creations',
        icon: Bot,
        component: <AiFeedback />
    },
    {
        name: 'Settings',
        desc: 'Before changing canvas size save your work',
        icon: Settings,
        component: <Setting />
    }
]

export const ShapeList = [
    {
        name: 'Circle',
        icon: '/circle.png'
    },
    {
        name: 'Line',
        icon: '/line.png'
    },
    {
        name: 'Square',
        icon: '/square.webp'
    },
    {
        name: 'Ellipse',
        icon: '/ellipse.jpeg'
    },
    {
        name: 'Rectangle',
        icon: '/rectangle.png'
    },
    {
        name: 'Triangle',
        icon: '/triangle.jpg'
    }
]

export const shapesSettingsList = [
    {
        name: 'Fill',
        icon: Palette,
        component: <FillColor />
    },
    {
        name: 'Stroke Color',
        icon: Square,
        component: <BorderColor />
    },
    {
        name: 'Stroke Width',
        icon: Minus,
        component: <BorderWidth />
    },
    {
        name: 'Opacity',
        icon: Blend,
        component: <Opacity />
    }
]

export const AITransformationSettings = [
    {
        name: 'Remove Background',
        command: 'e-bgremove',
        image: '/remove-bg.png'
    },
    {
        name: 'Text to Image',
        command: 'text-to-image',
        image: '/text2image.jpeg',
        needsInput: true  // This will trigger the text input modal
    },
    {
        name: 'Replace Background',
        command: 'replace-background',
        image: '/replace-bg.jpg',
        needsInput: true  // This will require a text prompt
    },
    {
        name: 'Gray Scale',
        command: 'e-grayscale',
        image: '/Gray.jpeg'
    },
    {
        name: 'Face crop',
        command: 'fo-face',
        image: '/face-crop.jpg'
    },
    {
        name: 'Contrast',
        command: 'e-contrast',
        image: '/contrast.jpg'
    },
    {
        name: 'Blur',
        command: 'bl-5',
        image: '/blur.jpg'
    },
    {
        name: 'Sharpen',
        command: 'e-sharpen-10',
        image: '/sharpen.jpg'
    },
    {
        name: 'Opacity',
        command: 'o-60',
        image: '/opacity.png'
    },
    {
        name: 'Radius',
        command: 'r-max',
        image: '/radius.png'
    },
    {
        name: 'Flip',
        command: 'fl-h',
        image: '/shadow.jpeg'
    },
    {
        name: 'Original',
        command: 'original',
        image: '/original.jpg'
    },
    {
        name: 'Resize',
        command: 'resize',
        image: '/resize.jpg',
        needsInput: false
    }
]

export const TextSettingsList = [
    {
        name: 'Fill',
        icon: Palette,
        component: <FillColor />
    },
    {
        name: 'Stroke Color',
        icon: Square,
        component: <BorderColor />
    },
    {
        name: 'Stroke Width',
        icon: Minus,
        component: <BorderWidth />
    },
    {
        name: 'Opacity',
        icon: Blend,
        component: <Opacity />
    },
    {
        name: 'Font Family',
        icon: BookType,
        component: <FontFamily />
    },
    {
        name: 'Eraser',
        icon: Eraser,
        component: <EraserTool />,
    },
]

export const FontFamilyList = [
    'Arial',
    'Arial Black',
    'Bookman',
    'Candara',
    'Century Gothic',
    'Courier New',
    'Garamond',
    'Georgia',
    'Impact',
    'Lucida Console',
    'Lucida Sans Unicode',
    'Palatino Linotype',
    'Segoe UI',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana'
]