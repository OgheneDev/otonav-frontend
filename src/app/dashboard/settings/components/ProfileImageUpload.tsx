import React, { useRef, useState } from "react";
import { Upload, User, X, Loader2, Camera } from "lucide-react";

interface ProfileImageUploadProps {
  imagePreview: string | null;
  selectedFile: File | null;
  onImageChange: (file: File) => void;
  onRemoveImage: () => void;
  isLoading?: boolean;
}

export function ProfileImageUpload({
  imagePreview,
  selectedFile,
  onImageChange,
  onRemoveImage,
  isLoading = false,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      onImageChange(file);
    }
  };

  const onDragEvents = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
    },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto p-4 space-y-6">
      <div className="relative group">
        {/* Main Circle Container */}
        <div
          {...onDragEvents}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative w-32 h-32 md:w-40 md:h-40 rounded-full cursor-pointer 
            transition-all duration-300 ease-in-out
            border-4 shadow-sm
            ${
              isDragging
                ? "border-[#00A082] scale-105 bg-emerald-50 ring-4 ring-emerald-100"
                : "border-white bg-gray-50 hover:shadow-md"
            }
          `}
        >
          {/* Image / Fallback Logic */}
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <User size={40} strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* Hover/Active Overlay (Desktop and Mobile tap feedback) */}
          <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Upload className="text-white mb-1" size={24} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-white">
              Update
            </span>
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center z-20">
              <Loader2 className="w-8 h-8 text-[#00A082] animate-spin" />
            </div>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-1 right-1 flex flex-col gap-2">
          {/* Edit/Camera Button - Highly visible for mobile users */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-white text-gray-700 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Upload photo"
          >
            <Camera size={18} />
          </button>
        </div>

        {/* Remove Button - Top Right */}
        {imagePreview && !isLoading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage();
            }}
            className="absolute -top-1 -right-1 p-1.5 bg-white text-red-500 rounded-full shadow-md border border-gray-100 hover:bg-red-50 active:scale-90 transition-all z-30"
            aria-label="Remove photo"
          >
            <X size={16} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-center space-y-1 px-4">
        <h4 className="text-sm font-semibold text-gray-900">
          {selectedFile ? "New photo selected" : "Profile Picture"}
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Tap to upload or drag and drop.
          <br />
          PNG, JPG or WEBP (max. 5MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          e.target.files?.[0] && handleFileSelect(e.target.files[0])
        }
        disabled={isLoading}
      />
    </div>
  );
}
