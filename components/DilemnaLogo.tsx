'use client';

import React, { useId } from 'react';

interface DilemnaLogoProps {
  /** 'emblem' renders the full square badge with DILEMNΛ — AI — typography; 'mark' renders a compact icon version */
  variant?: 'emblem' | 'mark';
  /** Pixel width/height or Tailwind size class */
  className?: string;
}

/**
 * Official Dilemna AI Emblem — Brushed 24K Gold "D" Crossroads & Thinker Silhouette
 * on an obsidian rounded-square plaque with metallic DILEMNΛ — AI — wordmark.
 */
export function DilemnaLogo({
  variant = 'emblem',
  className = 'w-12 h-12',
}: DilemnaLogoProps) {
  const uid = useId().replace(/:/g, '');
  const goldGradId = `gold-grad-${uid}`;
  const goldBrightId = `gold-bright-${uid}`;
  const silverGoldId = `silver-gold-${uid}`;
  const bgGradId = `bg-grad-${uid}`;
  const borderGradId = `border-grad-${uid}`;
  const glowFilterId = `gold-glow-${uid}`;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${className}`}
      role="img"
      aria-label="Dilemna AI Logo"
    >
      <defs>
        {/* Deep Obsidian Background Gradient */}
        <radialGradient id={bgGradId} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#141109" />
          <stop offset="55%" stopColor="#070707" />
          <stop offset="100%" stopColor="#020202" />
        </radialGradient>

        {/* Outer Frame Metallic Gold Rim */}
        <linearGradient id={borderGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCE79C" />
          <stop offset="28%" stopColor="#D4AF37" />
          <stop offset="55%" stopColor="#7A5813" />
          <stop offset="80%" stopColor="#E6C35C" />
          <stop offset="100%" stopColor="#6E4E0E" />
        </linearGradient>

        {/* Primary Brushed 24K Gold Gradient for the 'D' & Crossroads */}
        <linearGradient id={goldGradId} x1="15%" y1="5%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="18%" stopColor="#F3CA52" />
          <stop offset="42%" stopColor="#D4A528" />
          <stop offset="68%" stopColor="#9C6F10" />
          <stop offset="85%" stopColor="#E5BC46" />
          <stop offset="100%" stopColor="#785208" />
        </linearGradient>

        {/* Specular Rim Gold for Thinker Silhouette & Highlights */}
        <linearGradient id={goldBrightId} x1="0%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#FFE885" />
          <stop offset="65%" stopColor="#D8A628" />
          <stop offset="100%" stopColor="#8F630B" />
        </linearGradient>

        {/* Metallic Silver-Champagne to Gold Gradient for DILEMNΛ */}
        <linearGradient id={silverGoldId} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="38%" stopColor="#F9E8B2" />
          <stop offset="72%" stopColor="#D7AD3B" />
          <stop offset="100%" stopColor="#8E6514" />
        </linearGradient>

        {/* Subtle Specular Glow */}
        <filter id={glowFilterId} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Rounded Square Obsidian Plaque */}
      <rect
        x="18"
        y="18"
        width="476"
        height="476"
        rx="96"
        fill={`url(#${bgGradId})`}
        stroke={`url(#${borderGradId})`}
        strokeWidth="4.5"
      />

      {/* Subtle Inner Bezel Highlight */}
      <rect
        x="26"
        y="26"
        width="460"
        height="460"
        rx="88"
        stroke="#F6D365"
        strokeOpacity="0.14"
        strokeWidth="1.5"
      />

      {/* ============================================================
          THE MONUMENTAL 'D' WITH CROSSROADS ARROWS & THINKER PROFILE
          ============================================================ */}
      <g transform={variant === 'mark' ? 'translate(0, 32) scale(1.04)' : 'translate(0, 0)'}>
        {/* Faint Left Vertical Guide Hairline of the D */}
        <line
          x1="136"
          y1="108"
          x2="136"
          y2="245"
          stroke={`url(#${goldGradId})`}
          strokeWidth="2.5"
          strokeOpacity="0.55"
        />

        {/* Main Outer 'D' Arch + Top Bar + Bottom Bar + Lower Stem */}
        <path
          d="
            M 135 66
            H 258
            C 338 66, 386 116, 386 192
            C 386 268, 338 318, 258 318
            H 135
            V 276
            L 184 232
            V 280
            H 254
            C 312 280, 344 245, 344 192
            C 344 139, 312 104, 254 104
            H 135
            Z
          "
          fill={`url(#${goldGradId})`}
          stroke={`url(#${goldBrightId})`}
          strokeWidth="2"
          filter={`url(#${glowFilterId})`}
        />

        {/* Crossroads Stem & 3-Way Branching Arrows (Left, Center, Right) */}
        <path
          d="
            M 184 282
            V 195
            C 184 176, 170 162, 152 156
            L 156 168
            L 132 148
            L 162 135
            L 157 146
            C 172 151, 181 160, 185 172
            V 136
            H 171
            L 193 103
            L 215 136
            H 201
            V 174
            C 206 161, 217 151, 232 146
            L 227 135
            L 257 148
            L 233 168
            L 237 156
            C 217 163, 202 178, 202 198
            V 282
            Z
          "
          fill={`url(#${goldGradId})`}
          stroke={`url(#${goldBrightId})`}
          strokeWidth="1.5"
        />

        {/* Golden Rim-Lit Thinker Silhouette Profile (Inside Right Counter of 'D') */}
        {/* Forehead, Nose, Lips, Chin, and Neck Rim Line */}
        <path
          d="
            M 282 106
            C 296 115, 303 132, 301 148
            C 300 155, 305 162, 312 173
            C 314 177, 311 181, 305 183
            C 308 187, 310 191, 306 194
            C 309 197, 307 202, 302 204
            C 305 210, 303 219, 294 222
            C 281 226, 265 220, 250 212
            L 214 268
          "
          fill="none"
          stroke={`url(#${goldBrightId})`}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Contemplative Hand & Fingers Resting Under Chin */}
        <path
          d="
            M 294 274
            C 291 258, 293 245, 300 236
            C 295 231, 296 224, 304 222
            C 312 220, 319 225, 323 234
            C 327 244, 330 256, 326 272
          "
          fill="none"
          stroke={`url(#${goldBrightId})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner Finger Detail Creases */}
        <path
          d="
            M 303 234 C 310 233, 315 237, 316 243
            M 301 244 C 308 243, 313 247, 314 253
          "
          fill="none"
          stroke={`url(#${goldGradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Top Specular Glint on the 'D' Arch */}
        <ellipse
          cx="295"
          cy="72"
          rx="28"
          ry="3.5"
          transform="rotate(14 295 72)"
          fill="#FFFDF0"
          fillOpacity="0.85"
        />
        {/* Bottom Specular Glint under the 'D' */}
        <ellipse
          cx="260"
          cy="318"
          rx="32"
          ry="3.5"
          fill="#FFE885"
          fillOpacity="0.8"
        />
      </g>

      {/* ============================================================
          WORDMARK: DILEMNΛ  &  — AI —
          ============================================================ */}
      {variant === 'emblem' && (
        <g>
          {/* DILEMNΛ Geometric Custom Wordmark */}
          <g fill={`url(#${silverGoldId})`} stroke="#70500D" strokeWidth="0.8">
            {/* D (with signature open middle-left notch) */}
            <path d="M 66 340 H 104 C 120 340, 130 350, 130 364 C 130 378, 120 388, 104 388 H 66 V 366 H 80 V 376 H 102 C 110 376, 116 371, 116 364 C 116 357, 110 352, 102 352 H 66 Z" />
            {/* I */}
            <rect x="142" y="340" width="14" height="48" />
            {/* L */}
            <path d="M 170 340 H 184 V 375 H 218 V 388 H 170 Z" />
            {/* E */}
            <path d="M 230 340 H 282 V 352 H 244 V 358 H 276 V 370 H 244 V 376 H 282 V 388 H 230 Z" />
            {/* M */}
            <path d="M 296 388 V 340 H 311 L 330 364 L 349 340 H 364 V 388 H 350 V 361 L 330 385 L 310 361 V 388 Z" />
            {/* N */}
            <path d="M 378 388 V 340 H 392 L 420 369 V 340 H 434 V 388 H 420 L 392 359 V 388 Z" />
            {/* Λ (Stylized crossbar-free A) */}
            <path d="M 444 388 L 468 340 H 482 L 506 388 H 491 L 475 355 L 459 388 Z" transform="translate(-58, 0)" />
          </g>

          {/* Left Tapered Gold Line */}
          <path
            d="M 104 426 L 204 424.5 L 204 427.5 Z"
            fill={`url(#${goldBrightId})`}
          />

          {/* AI Sub-Wordmark */}
          <g fill={`url(#${goldGradId})`} stroke={`url(#${goldBrightId})`} strokeWidth="0.8">
            {/* A */}
            <path d="M 220 444 L 240 404 H 253 L 273 444 H 260 L 256 435 H 237 L 233 444 Z M 241 425 H 252 L 246.5 413 Z" />
            {/* I */}
            <rect x="282" y="404" width="12" height="40" />
          </g>

          {/* Right Tapered Gold Line */}
          <path
            d="M 408 426 L 308 424.5 L 308 427.5 Z"
            fill={`url(#${goldBrightId})`}
          />
        </g>
      )}
    </svg>
  );
}
