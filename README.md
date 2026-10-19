# Dilemna Ai — Fate, Intuition & Crossroads Guidance

**Dilemna Ai** (by **PatCheeks LLC**) is an interactive decision-arbitration and trade-off analysis application built with Next.js 15, React 19, Tailwind CSS v4, D3.js, and the Google Gemini API (`@google/genai`).

When you stand at life's crossroads, Dilemna Ai evaluates competing options across risk tolerance, time horizon, and decision frameworks to deliver a structured verdict dossier, intuition score, multi-dimensional radar chart, and actionable roadmap.

---

## Key Features

- **Multi-Option Dilemma Arbitration**: Compare two or more competing choices with custom context, pros, cons, risk tolerance, time horizon, and analytical framework (*Comprehensive*, *First Principles*, *Regret Minimization*, *Expected Value*, or *Stoic*).
- **Definitive Verdict & Intuition Meter**: Produces a clear recommendation with confidence scoring, core reasoning, blindspot analysis, and decision tripwires.
- **Interactive D3 Visualizations**:
  - **Multi-Dimensional Radar Chart**: Compare options across Strategic Fit, Upside Potential, Risk Resilience, Execution Speed, and Emotional Alignment, or switch to a Pros-vs-Cons balance radar.
  - **Pros & Cons Weighting Chart**: Visual breakdown of argument impact weights (`1–10`) for every option.
- **Interactive Follow-Up Counsel**: Ask follow-up questions directly against your arbitrated dilemma dossier.
- **Subconscious Coin Toss**: Interactive 3D coin flip gut-check modal to surface your instinctive preference while the coin is in the air.
- **Export & Sharing**:
  - Formatted print/PDF dossier export.
  - CSV export of saved decision history.
  - Shareable compressed snapshot links with expiration support.

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and provide your Gemini API key:

```bash
cp .env.example .env.local
```

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## Responsibility Disclaimer

Dilemna Ai is an exploratory decision-support and cognitive reflection tool created by **PatCheeks LLC**. All outputs are informational and heuristic only; users retain 100% sole responsibility for their decisions and actions. See `/disclaimer` in the application for the full legal disclosure.
