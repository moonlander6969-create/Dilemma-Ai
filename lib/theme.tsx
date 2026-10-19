'use client';

import React, { createContext, useContext, useState } from 'react';

export type ThemeId =
  | 'neon_graphite'
  | 'neon_matte_black'
  | 'neon_light_minimal';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  category: string;
  description: string;
  isDark: boolean;
  colors: {
    preview: [string, string, string]; // Grey, White, Neon Green
    pageBg: string;
    cardBg: string;
    cardBorder: string;
    cardHoverBorder: string;
    headerBg: string;
    headerBorder: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    heroBg: string;
    heroBorder: string;
    heroText: string;
    heroMuted: string;
    accentPrimary: string;
    accentHover: string;
    accentText: string;
    accentGlow: string;
    tagWinnerBg: string;
    tagWinnerText: string;
    tagWinnerBorder: string;
    inputBg: string;
    inputBorder: string;
    scoreBarBg: string;
    footerBg: string;
    footerBorder: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  neon_graphite: {
    id: 'neon_graphite',
    name: 'Graphite & Neon Green',
    category: 'Grey · White · Neon Green',
    description: 'Precision graphite grey, crisp bright white text, and electric neon green highlights.',
    isDark: true,
    colors: {
      preview: ['#12151c', '#ffffff', '#00ff66'],
      pageBg: 'bg-[#0c0e12]',
      cardBg: 'bg-[#151922]',
      cardBorder: 'border-[#242a38]',
      cardHoverBorder: 'hover:border-[#00ff66]/60',
      headerBg: 'bg-[#0c0e12]/92 backdrop-blur-md',
      headerBorder: 'border-[#1e2330]',
      textPrimary: 'text-white',
      textSecondary: 'text-[#d1d5db]',
      textMuted: 'text-[#9ca3af]',
      heroBg: 'bg-gradient-to-br from-[#161a24] via-[#11141c] to-[#0c1c14]',
      heroBorder: 'border-[#00ff66]/30 shadow-lg shadow-[#00ff66]/5',
      heroText: 'text-white',
      heroMuted: 'text-[#cbd5e1]',
      accentPrimary: 'bg-[#00ff66] hover:bg-[#22ff77] text-[#090b0e] font-bold shadow-md shadow-[#00ff66]/20',
      accentHover: 'hover:bg-[#22ff77]',
      accentText: 'text-[#00ff66]',
      accentGlow: 'shadow-[#00ff66]/25',
      tagWinnerBg: 'bg-[#00ff66]/15',
      tagWinnerText: 'text-[#00ff66]',
      tagWinnerBorder: 'border-[#00ff66]/40',
      inputBg: 'bg-[#0f1218]',
      inputBorder: 'border-[#262c3b] focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]/30',
      scoreBarBg: 'bg-[#1e2430]',
      footerBg: 'bg-[#0c0e12]',
      footerBorder: 'border-[#1e2330]',
    },
  },
  neon_matte_black: {
    id: 'neon_matte_black',
    name: 'Matte Obsidian & Neon Green',
    category: 'Ultra Dark Grey',
    description: 'Pitch carbon grey with stark white typography and high-voltage neon green lasers.',
    isDark: true,
    colors: {
      preview: ['#08090b', '#ffffff', '#10e668'],
      pageBg: 'bg-[#08090b]',
      cardBg: 'bg-[#101216]',
      cardBorder: 'border-[#1c2028]',
      cardHoverBorder: 'hover:border-[#00ff66]/70',
      headerBg: 'bg-[#08090b]/95 backdrop-blur-md',
      headerBorder: 'border-[#171a21]',
      textPrimary: 'text-white',
      textSecondary: 'text-[#d1d5db]',
      textMuted: 'text-[#858d9d]',
      heroBg: 'bg-gradient-to-b from-[#12141a] to-[#090a0d]',
      heroBorder: 'border-[#00ff66]/30',
      heroText: 'text-white',
      heroMuted: 'text-[#cbd5e1]',
      accentPrimary: 'bg-[#00ff66] hover:bg-[#24ff7b] text-black font-extrabold shadow-lg shadow-[#00ff66]/25',
      accentHover: 'hover:bg-[#24ff7b]',
      accentText: 'text-[#00ff66]',
      accentGlow: 'shadow-[#00ff66]/30',
      tagWinnerBg: 'bg-[#00ff66]/20',
      tagWinnerText: 'text-[#00ff66]',
      tagWinnerBorder: 'border-[#00ff66]/50',
      inputBg: 'bg-[#0b0d11]',
      inputBorder: 'border-[#212633] focus:border-[#00ff66]',
      scoreBarBg: 'bg-[#181c24]',
      footerBg: 'bg-[#08090b]',
      footerBorder: 'border-[#171a21]',
    },
  },
  neon_light_minimal: {
    id: 'neon_light_minimal',
    name: 'Ash Grey & White with Neon Green',
    category: 'Clean Grey & White',
    description: 'Soft mist grey and crisp white canvas accented by sharp neon green indicators.',
    isDark: false,
    colors: {
      preview: ['#f1f5f9', '#ffffff', '#05c455'],
      pageBg: 'bg-[#f4f6f8]',
      cardBg: 'bg-[#ffffff]',
      cardBorder: 'border-[#e2e8f0]',
      cardHoverBorder: 'hover:border-[#00ff66]',
      headerBg: 'bg-[#ffffff]/90 backdrop-blur-md',
      headerBorder: 'border-[#e2e8f0]',
      textPrimary: 'text-[#0f172a]',
      textSecondary: 'text-[#475569]',
      textMuted: 'text-[#64748b]',
      heroBg: 'bg-[#0f172a]',
      heroBorder: 'border-[#334155]',
      heroText: 'text-white',
      heroMuted: 'text-[#94a3b8]',
      accentPrimary: 'bg-[#00e65c] hover:bg-[#00c950] text-[#06140b] font-bold shadow-md shadow-[#00ff66]/20',
      accentHover: 'hover:bg-[#00c950]',
      accentText: 'text-[#00c950]',
      accentGlow: 'shadow-[#00ff66]/15',
      tagWinnerBg: 'bg-[#00ff66]/15',
      tagWinnerText: 'text-[#008f39]',
      tagWinnerBorder: 'border-[#00ff66]/50',
      inputBg: 'bg-[#f8fafc]',
      inputBorder: 'border-[#cbd5e1] focus:border-[#00e65c]',
      scoreBarBg: 'bg-[#e2e8f0]',
      footerBg: 'bg-[#ffffff]',
      footerBorder: 'border-[#e2e8f0]',
    },
  },
};

const THEME_STORAGE_KEY = 'dilemma_decider_active_theme_v2';

interface ThemeContextType {
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES.neon_graphite,
  setThemeId: () => {},
  availableThemes: Object.values(THEMES),
});

function subscribeTheme(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('dilemma-theme-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('dilemma-theme-change', callback);
  };
}

function getThemeSnapshot(): ThemeId {
  if (typeof window === 'undefined') return 'neon_graphite';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
    if (saved && THEMES[saved]) return saved;
  } catch (e) {
    console.error(e);
  }
  return 'neon_graphite';
}

function getServerThemeSnapshot(): ThemeId {
  return 'neon_graphite';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const activeId = React.useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const setThemeId = (id: ThemeId) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
      window.dispatchEvent(new Event('dilemma-theme-change'));
    } catch (e) {
      console.error(e);
    }
  };

  const currentTheme = THEMES[activeId] || THEMES.neon_graphite;

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setThemeId,
        availableThemes: Object.values(THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
