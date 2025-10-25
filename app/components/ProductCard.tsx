'use client';

import React, { useRef } from 'react';

type ProductCardProps = {
  imgSrc: string;
  name: string;
  caption?: string;
  onCaptionChange: (v: string) => void;
  onSave: () => void;
  saving?: boolean;
  attachRef?: (el: HTMLTextAreaElement | null) => void;
};

export default function ProductCard({
  imgSrc,
  name,
  caption,
  onCaptionChange,
  onSave,
  saving,
  attachRef,
}: ProductCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div className="overflow-hidden shadow-sm bg-white rounded-sm h-103">
      <div className="py-4">
        <img src={imgSrc} alt={name} className="h-56 w-full object-contain" />
      </div>

      <div className="group space-y-2 px-4">
        <div className="text-xs text-gray-500 truncate">{name}</div>

        <textarea
          ref={(el) => {
            textareaRef.current = el;
            attachRef?.(el);
          }}
          value={caption ?? ''}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Write a caption or create a task…"
          className="h-20 w-full resize-none rounded-sm text-sm outline-none focus:ring-1 focus:ring-gray-300"
        />

        <div className="hidden group-focus-within:flex justify-end">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={onSave}
            disabled={!!saving}
            className="rounded-sm bg-blue-600 px-3 py-1.5 text-xs text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
