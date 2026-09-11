import type { Visual } from './program';

const tonguePaths: Record<Visual, string> = {
  // tongue drawn broad and pressed flat against the palate
  'tongue-up': 'M70 150 C100 118 150 108 190 112 C224 115 246 128 254 142 C226 150 190 154 156 152 C120 150 92 150 70 150 Z',
  // tongue tip pulled back along the palate toward the throat
  'tongue-slide': 'M70 156 C104 150 140 138 172 122 C198 110 222 106 252 112 C232 128 206 140 178 148 C144 158 106 160 70 156 Z',
  // back of tongue pressed down, tip stays low and forward
  'cheek-press': 'M66 162 C98 168 134 170 166 164 C176 148 176 128 168 112 C196 118 218 132 228 150 C198 162 156 170 118 170 C98 170 80 168 66 162 Z',
  // arched, activating the soft palate for a held vowel
  vowel: 'M68 158 C100 150 138 146 174 148 C204 150 226 158 236 168 C206 176 168 178 132 176 C104 174 82 168 68 158 Z',
  // resting against the palate mid-swallow
  swallow: 'M70 150 C102 128 146 116 188 118 C216 120 236 130 246 142 C220 152 182 158 146 156 C116 154 90 152 70 150 Z',
  // neutral tongue position, jaw guided forward
  jaw: 'M70 158 C102 150 142 146 178 148 C204 150 222 156 232 164 C204 172 166 176 130 174 C104 172 84 168 70 158 Z',
};

const targets: Record<Visual, { cx: number; cy: number; r: number }> = {
  'tongue-up': { cx: 190, cy: 96, r: 34 },
  'tongue-slide': { cx: 236, cy: 108, r: 30 },
  'cheek-press': { cx: 150, cy: 96, r: 30 },
  vowel: { cx: 260, cy: 150, r: 32 },
  swallow: { cx: 210, cy: 108, r: 28 },
  jaw: { cx: 96, cy: 168, r: 26 },
};

const arrows: Record<Visual, { x1: number; y1: number; x2: number; y2: number } | null> = {
  'tongue-up': { x1: 150, y1: 138, x2: 178, y2: 106 },
  'tongue-slide': { x1: 130, y1: 132, x2: 214, y2: 108 },
  'cheek-press': { x1: 150, y1: 150, x2: 156, y2: 112 },
  vowel: null,
  swallow: { x1: 150, y1: 132, x2: 196, y2: 112 },
  jaw: { x1: 70, y1: 176, x2: 100, y2: 168 },
};

export function Illustration({ kind, className }: { kind: Visual; className?: string }) {
  const target = targets[kind];
  const arrow = arrows[kind];
  return (
    <svg
      viewBox="0 0 300 220"
      className={`illustration ${className ?? ''}`}
      role="img"
      aria-label="Schematische Seitenansicht von Mund und Rachen mit Zielbereich der Übung"
    >
      <defs>
        <marker id={`arrow-${kind}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="illu-arrowhead" />
        </marker>
      </defs>

      {/* head / face profile */}
      <path
        className="illu-face"
        d="M52 78 C46 46 74 18 116 14 C150 11 180 20 198 38 C206 46 208 54 214 58 C226 62 236 72 240 84 C244 96 240 104 232 108 C236 116 236 124 230 130 C233 140 230 148 222 152 C224 162 218 172 206 176 L204 208 L178 208 L176 188 C158 194 136 194 118 186 C104 200 84 204 66 198 L72 178 C50 168 36 148 30 126 C25 110 27 92 34 96 C40 88 46 82 52 78 Z"
        fill="none"
      />
      {/* nostril */}
      <path className="illu-detail" d="M228 86 C232 90 232 96 228 100" fill="none" />
      {/* lips */}
      <path className="illu-detail" d="M222 116 C227 120 228 126 224 132 C220 137 212 139 206 136" fill="none" />

      {/* hard + soft palate (roof of mouth) */}
      <path className="illu-palate" d="M60 96 C110 78 170 74 214 88 C232 94 246 104 254 116" fill="none" />
      {/* pharyngeal wall */}
      <path className="illu-pharynx" d="M254 116 C258 138 252 160 236 178" fill="none" />
      {/* lower jaw / floor of mouth */}
      <path className="illu-jaw" d="M58 168 C96 186 150 190 196 180" fill="none" />

      {/* target zone for this exercise */}
      <circle className="illu-target" cx={target.cx} cy={target.cy} r={target.r} />

      {/* tongue */}
      <path className="illu-tongue" d={tonguePaths[kind]} />

      {/* movement arrow */}
      {arrow && (
        <line
          className="illu-arrow"
          x1={arrow.x1}
          y1={arrow.y1}
          x2={arrow.x2}
          y2={arrow.y2}
          markerEnd={`url(#arrow-${kind})`}
        />
      )}
    </svg>
  );
}
