'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadFile, addToMediaLibrary } from '@/lib/admin-hooks';
import { useToast } from '@/hooks/use-toast';

export function ImageUpload({
  value,
  onChange,
  label,
  aspectRatio = 'aspect-video',
}: {
  value: string | null;
  onChange: (url: string) => void;
  label: string;
  aspectRatio?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      await addToMediaLibrary(url, file.name, file.type.startsWith('video') ? 'video' : 'image', file.size);
      onChange(url);
      toast({ title: 'Upload successful' });
    } else {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
  };

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {value ? (
        <div className={`relative ${aspectRatio} overflow-hidden rounded-sm border border-border bg-secondary`}>
          <Image src={value} alt="Preview" fill className="object-cover" sizes="400px" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`flex ${aspectRatio} w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-secondary/50 transition-all hover:border-accent/50`}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-accent" />
          ) : (
            <>
              <Upload size={20} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Click to upload</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}

export function VideoUrlInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
        placeholder="https://example.com/video.mp4"
      />
    </div>
  );
}
