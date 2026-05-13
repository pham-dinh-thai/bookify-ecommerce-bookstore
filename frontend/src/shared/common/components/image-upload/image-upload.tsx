'use client';

import { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function ImageUpload({
  value,
  onChange,
  error,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    onChange(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleClear = () => {
    onChange(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {preview ? (
        /* Preview state */
        <div
          className="relative rounded-xl overflow-hidden border"
          style={{
            borderColor: 'rgba(0,0,0,0.1)',
            background: 'rgba(0,0,0,0.03)',
            height: 180,
          }}
        >
          <img
            src={preview}
            alt="Cover preview"
            className="w-full h-full object-contain"
          />
          {/* Filename overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between"
            style={{
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span className="text-xs text-white truncate max-w-[80%]">
              {value?.name}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200"
          style={{
            height: 180,
            borderColor: dragOver ? '#4a7c59' : 'rgba(0,0,0,0.15)',
            background: dragOver ? 'rgba(74,124,89,0.05)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.06)' }}
          >
            {dragOver ? (
              <ImageIcon className="w-5 h-5" style={{ color: '#4a7c59' }} />
            ) : (
              <Upload className="w-5 h-5" style={{ color: '#58615b' }} />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: '#3d4540' }}>
              {dragOver ? 'Drop image here' : 'Click or drag to upload'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
              PNG, JPG, WEBP — max 5MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
    </div>
  );
}
