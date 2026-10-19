'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { X, Palette, Check } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSelectorModal({ isOpen, onClose }: ThemeSelectorModalProps) {
  const { theme, setThemeId, availableThemes } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12151c] text-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#242a38] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#242a38] flex items-center justify-between bg-[#0e1117]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00ff66]/15 text-[#00ff66] flex items-center justify-center border border-[#00ff66]/30">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Color Schemes</h3>
              <p className="text-xs text-[#9ca3af]">Grey, White, and Neon Green Theme Variants</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#9ca3af] hover:text-white hover:bg-[#1f2430] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Themes */}
        <div className="p-6 space-y-3 overflow-y-auto max-h-[75vh]">
          {availableThemes.map((t) => {
            const isActive = theme.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setThemeId(t.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                  isActive
                    ? 'border-[#00ff66] bg-[#00ff66]/10 shadow-sm shadow-[#00ff66]/20'
                    : 'border-[#242a38] hover:border-[#374151] bg-[#151922] hover:bg-[#1a1f2b]'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-[#00ff66] transition-colors">
                      {t.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1f2430] text-[#9ca3af]">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#9ca3af] leading-relaxed">
                    {t.description}
                  </p>
                </div>

                {/* Swatches preview & Checkmark */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#0c0e12] border border-[#242a38]">
                    {t.colors.preview.map((hex, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isActive
                        ? 'bg-[#00ff66] border-[#00ff66] text-black shadow-xs font-bold'
                        : 'border-[#374151] text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#242a38] bg-[#0e1117] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-black bg-[#00ff66] hover:bg-[#22ff77] rounded-lg transition-colors cursor-pointer shadow-sm shadow-[#00ff66]/20"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
}
