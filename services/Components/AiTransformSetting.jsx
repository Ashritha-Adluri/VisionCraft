'use client';
import React, { useState } from 'react';
import { AITransformationSettings } from '../Options';
import Image from 'next/image';
import CustomImageUpload from '../Sharable/CustomImageUpload';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

async function uploadBlobToImageKit(blob, fileName) {
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    const res = await imagekit.upload({
        file: `data:${blob.type};base64,${base64}`,
        fileName,
        isPublished: true,
    });

    return res.url;
}

function AiTransformSetting() {
    const [selectedAi, setSelectedAi] = useState();
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputText, setInputText] = useState('');
    const [processedImage, setProcessedImage] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [transformationChain, setTransformationChain] = useState([]); // 🧠 important

    const handleAiSelection = (option) => {
        setSelectedAi(option);
        if (option.needsInput) {
            setShowInputModal(true);
        } else {
            if (option.command === 'original') {
                // Reset transformations and go back to base image
                if (generatedImage) {
                    setCurrentImage(generatedImage); // From text-to-image
                } else if (processedImage) {
                    setCurrentImage(processedImage); // From background replace
                } else {
                    // It's a user-uploaded image
                    setCurrentImage(currentImage);
                }
                setTransformationChain([]); // Remove all transformations
                return;
            }

            if (option.command === 'resize') {
                // Add resize parameters (update as per UI controls or default size)
                const resizeCommand = 'w-400,h-300'; // customize or prompt user
                setTransformationChain((prev) => [...prev, resizeCommand]);
                return;
            }

            // Default case: add command normally
            if (
                option.command !== 'text-to-image' &&
                option.command !== 'replace-background'
            ) {
                setTransformationChain((prev) => [...prev, option.command]);
            }

        }
    };

    const handleBackgroundReplace = async () => {
        if (!inputText.trim() || !uploadedFile) {
            alert('No file uploaded or no prompt entered');
            return;
        }

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('image_file', uploadedFile);
            formData.append('prompt', inputText);

            const response = await fetch('https://clipdrop-api.co/replace-background/v1', {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_CLIPDROP_API_KEY,
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Background replacement failed');

            const imageBlob = await response.blob();
            const uploadedUrl = await uploadBlobToImageKit(imageBlob, `replacebg-${Date.now()}.png`);

            setProcessedImage(uploadedUrl);
            setCurrentImage(uploadedUrl);
            setTransformationChain([]); // reset chain
            setShowInputModal(false);
        } catch (error) {
            console.error('Background replacement error:', error);
            alert('Error replacing background: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextToImage = async () => {
        if (!inputText.trim()) {
            alert('Please enter a prompt');
            return;
        }

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('prompt', inputText);

            const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_CLIPDROP_API_KEY,
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Image generation failed');

            const imageBlob = await response.blob();
            const uploadedUrl = await uploadBlobToImageKit(imageBlob, `text2img-${Date.now()}.png`);

            setGeneratedImage(uploadedUrl);
            setCurrentImage(uploadedUrl);
            setTransformationChain([]); // reset chain
            setShowInputModal(false);
        } catch (error) {
            console.error('Text-to-image error:', error);
            alert('Error generating image: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const getModalTitle = () => {
        switch (selectedAi?.command) {
            case 'replace-background':
                return 'Describe the new background';
            case 'text-to-image':
                return 'Describe the image you want to generate';
            default:
                return 'Enter your prompt';
        }
    };

    const getPlaceholderText = () => {
        switch (selectedAi?.command) {
            case 'replace-background':
                return 'e.g., "a cozy marble kitchen with wine glasses"';
            case 'text-to-image':
                return 'e.g., "a futuristic cityscape at sunset"';
            default:
                return 'Describe what you want to generate...';
        }
    };

    const handleProcess = () => {
        if (selectedAi?.command === 'text-to-image') {
            handleTextToImage();
        } else if (selectedAi?.command === 'replace-background') {
            handleBackgroundReplace();
        }
    };

    return (
        <div>
            <CustomImageUpload
                selectedAi={selectedAi}
                processedImage={processedImage}
                generatedImage={generatedImage}
                setProcessedImage={setProcessedImage}
                setGeneratedImage={setGeneratedImage}
                setUploadedFile={setUploadedFile}
                currentImage={currentImage}
                setCurrentImage={setCurrentImage}
                transformationChain={transformationChain}
                setTransformationChain={setTransformationChain}
            />

            {showInputModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">{getModalTitle()}</h3>

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            rows={4}
                            placeholder={getPlaceholderText()}
                        />

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowInputModal(false)}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProcess}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                disabled={!inputText.trim() || isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Process'}
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <h2 className="my-2 font-bold">AI Transformation</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 overflow-auto h-[75vh]">
                {AITransformationSettings.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => handleAiSelection(option)}
                        className={`cursor-pointer p-2 rounded-lg transition-all ${selectedAi?.command === option.command
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        <Image
                            src={option.image}
                            alt={option.name}
                            width={100}
                            height={100}
                            className="w-full h-[70px] object-cover rounded-lg"
                        />
                        <h2 className="text-xs text-center mt-1">{option.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AiTransformSetting;
