"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    label: string;
    onFileSelect: (file: File | null) => void;
    accept?: string;
}

export default function FileUpload({ label, onFileSelect, accept = "image/*" }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            onFileSelect(e.target.files[0]);
        }
    };

    const clearFile = () => {
        setFile(null);
        onFileSelect(null);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className={cn(
                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer relative",
                file ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-blue-900/10"
            )}>
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept={accept}
                />

                {file ? (
                    <div className="text-center">
                        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); clearFile(); }}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 underline z-10 relative"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="text-center pointer-events-none">
                        {accept.includes("pdf") ? (
                            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        ) : (
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {accept.includes("pdf") ? "PDF files up to 10MB" : "PNG, JPG up to 10MB"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
