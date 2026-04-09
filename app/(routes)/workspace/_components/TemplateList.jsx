"use client";

import React, { useEffect, useState, useContext } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { toast } from 'sonner';

function TemplateList() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCloneId, setLoadingCloneId] = useState(null);
    const convex = useConvex();
    const router = useRouter();
    const { userDetail } = useContext(UserDetailContext);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        const result = await convex.query(api.designs.GetTemplates, {});
        setTemplates(result);
        setLoading(false);
    };

    const handleUseTemplate = async (templateId) => {
        if (!userDetail?._id) {
            toast.error("Please login to your account before creating a design.");
            return;
        }
        setLoadingCloneId(templateId);
        try {
            const newId = await convex.mutation(api.designs.CloneDesign, {
                sourceId: templateId,
                uid: userDetail._id,
            });
            router.push("/design/" + newId);
        } catch (err) {
            console.error("Failed to use template", err);
        } finally {
            setLoadingCloneId(null);
        }
    };

    return (
        <div className="mt-7">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl">Available Templates</h2>
                {templates.length > 0 && (
                    <Button variant="outline" onClick={fetchTemplates}>
                        ⟳ Refresh
                    </Button>
                )}
            </div>

            {loading ? (
                <p className="text-center text-muted-foreground">
                    Loading templates...
                </p>
            ) : templates.length === 0 ? (
                <p className="text-center text-muted-foreground mt-5">
                    No templates available.
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template._id}
                            className="relative bg-secondary rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
                            onClick={() => handleUseTemplate(template._id)}
                        >
                            <Image
                                src={
                                    template.imagePreview?.startsWith("http")
                                        ? `${template.imagePreview}?t=${new Date(
                                            template._updatedAt || template._creationTime || Date.now()
                                        ).getTime()}`
                                        : "/fallback.png"
                                }
                                alt={template.name || "Template Preview"}
                                width={300}
                                height={200}
                                className="w-full h-[200px] object-contain rounded-lg"
                            />
                            <p className="text-center py-2 font-medium">
                                {template.name}
                            </p>
                            <div className="absolute bottom-3 left-0 right-0 opacity-0 group-hover:opacity-100 transition">
                                <p className="text-center text-sm text-blue-600 font-semibold">
                                    {loadingCloneId === template._id ? "Cloning..." : ""}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TemplateList;
