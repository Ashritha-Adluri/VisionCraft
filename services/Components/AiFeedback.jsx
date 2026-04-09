'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

const AiFeedback = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const analyzeWithGemini = async () => {
        const imageFile = fileInputRef.current?.files[0];
        const userPrompt = prompt.trim(); // Ensure this variable exists in your scope

        if (!userPrompt) {
            toast.error("Please enter a prompt.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Analyzing...");

        try {
            const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            // Use the stable model name to avoid "Not Found" errors
            const MODEL_NAME = "gemini-2.5-flash";
            const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
            let parts = [{ text: userPrompt }];

            if (imageFile) {
                const base64Image = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(imageFile);
                });

                parts.push({
                    inline_data: {
                        mime_type: imageFile.type,
                        data: base64Image
                    }
                });
            }

            const apiResponse = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts }] })
            });

            const result = await apiResponse.json();

            if (result.error) {
                throw new Error(result.error.message);
            }

            const aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
            setResponse(aiText);
            toast.success("Success!", { id: toastId });

        } catch (error) {
            console.error("API Error:", error);
            setResponse("Error: " + error.message);
            toast.error("Model unavailable or request failed.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">1. Upload Image (Optional)</h3>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
                {imagePreview && (
                    <div className="mt-4">
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            width={300}
                            height={200}
                            className="rounded-lg border"
                        />
                    </div>
                )}
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">2. Enter Your Prompt</h3>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: 'What's in this image?' or 'Write a poem about this scene'"
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                />
            </div>

            <button
                onClick={analyzeWithGemini}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white font-medium ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>

            <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">3. AI Response</h3>
                <textarea
                    value={response}
                    readOnly
                    className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
                    rows={8}
                />

            </div>
        </div>
    );
};

export default AiFeedback;
