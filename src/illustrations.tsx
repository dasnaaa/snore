import { useId } from 'react';
import type { Visual } from './program';

type Point = { x: number; y: number };
type Target = { cx: number; cy: number; rx: number; ry: number };
type Arrow = { from: Point; to: Point } | null;

const tonguePaths: Record<Visual, string> = {
  // Broad tongue body lifted into full contact with the hard palate.
  'tongue-up':
    'M218 142 C210 128 201 116 188 110 C176 104 163 103 151 107 C145 112 143 123 145 136 C148 149 157 157 171 159 C190 160 207 154 218 142 Z',
  // Tip is visibly retracted along the palate while the body stays controlled.
  'tongue-slide':
    'M218 145 C207 141 198 133 191 123 C184 114 177 107 166 105 C157 105 149 112 146 124 C143 138 150 151 163 156 C181 162 204 156 218 145 Z',
  // Tip remains low and anterior; posterior tongue is depressed toward the floor.
  'cheek-press':
    'M219 149 C205 148 194 148 182 151 C171 155 159 158 148 156 C144 151 144 143 149 137 C156 132 165 133 174 137 C188 143 203 146 219 149 Z',
  // Neutral-low tongue for an open “Aaaah”, leaving the soft palate visually dominant.
  vowel:
    'M218 149 C204 146 190 145 176 147 C164 149 154 153 147 157 C154 166 168 170 184 168 C199 166 211 159 218 149 Z',
  // Mid-tongue is domed and the posterior body is elevated for the swallow sequence.
  swallow:
    'M218 144 C207 132 196 121 182 114 C169 108 157 109 149 116 C144 125 146 139 154 149 C164 159 179 162 194 157 C205 154 213 149 218 144 Z',
  // Resting tongue stays low while the mandible is the active structure.
  jaw:
    'M218 150 C204 146 188 146 174 149 C162 151 153 155 147 160 C156 167 171 170 187 167 C201 164 212 158 218 150 Z',
};

const targets: Record<Visual, Target> = {
  'tongue-up': { cx: 181, cy: 104, rx: 43, ry: 20 },
  'tongue-slide': { cx: 157, cy: 104, rx: 29, ry: 22 },
  'cheek-press': { cx: 169, cy: 151, rx: 34, ry: 22 },
  vowel: { cx: 145, cy: 108, rx: 27, ry: 25 },
  swallow: { cx: 151, cy: 119, rx: 30, ry: 30 },
  jaw: { cx: 190, cy: 170, rx: 48, ry: 20 },
};

const arrows: Record<Visual, Arrow> = {
  'tongue-up': { from: { x: 184, y: 142 }, to: { x: 181, y: 113 } },
  'tongue-slide': { from: { x: 207, y: 119 }, to: { x: 169, y: 105 } },
  'cheek-press': { from: { x: 170, y: 126 }, to: { x: 170, y: 151 } },
  vowel: null,
  swallow: { from: { x: 195, y: 139 }, to: { x: 161, y: 116 } },
  jaw: { from: { x: 176, y: 174 }, to: { x: 220, y: 166 } },
};

const labels: Record<Visual, string> = {
  'tongue-up': 'Zunge flächig an den harten Gaumen anheben',
  'tongue-slide': 'Zungenspitze am Gaumen nach hinten führen',
  'cheek-press': 'Zungenspitze unten halten und Zungenrücken absenken',
  vowel: 'Weichen Gaumen beim gehaltenen A aktivieren',
  swallow: 'Zunge beim bewussten Schlucken am Gaumen führen',
  jaw: 'Unterkiefer kontrolliert nach vorn führen',
};

export function Illustration({ kind, className }: { kind: Visual; className?: string }) {
  const target = targets[kind];
  const arrow = arrows[kind];
  const id = useId().replace(/:/g, '');
  const markerId = `exercise-arrow-${kind}-${id}`;

  return (
    <svg
      viewBox="0 0 320 220"
      className={`illustration ${className ?? ''}`}
      role="img"
      aria-label={labels[kind]}
      preserveAspectRatio="xMidYMid meet"
      style={{ color: 'var(--ink)' }}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="6.5"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0 0 L8 4 L0 8 Z" fill="var(--blue)" />
        </marker>
      </defs>

      {/* Human profile: forehead → nose → lips → chin → jaw/neck. */}
      <path
        d="M82 197 C54 187 36 166 31 137 C25 102 34 69 56 45 C77 22 107 12 138 13 C169 14 196 27 211 48 C219 59 221 70 221 80 C221 88 229 92 242 94 L259 99 L248 108 C243 112 243 116 249 120 C254 123 254 128 248 132 C243 135 243 139 248 142 C253 145 252 150 246 154 C240 158 232 160 224 160 C224 179 217 194 205 207 L174 207 C177 197 177 187 173 178 C149 193 111 201 82 197 Z"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.56"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Nose / nostril and lips – enough detail to read as a profile even at thumbnail size. */}
      <path
        d="M242 101 C244 104 244 106 241 108 M244 121 C237 120 232 122 228 126 M228 126 C233 131 239 132 245 130"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Teeth and hard palate. */}
      <path
        d="M226 113 C207 104 184 99 160 100 C151 100 144 102 137 105"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.62"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M224 114 L220 123 M215 110 L212 120"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.42"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      {/* Soft palate and uvula. */}
      <path
        d="M137 105 C130 109 128 116 132 121 C135 125 140 125 143 121 C146 118 145 114 142 112"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M142 112 C143 117 143 121 140 125"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Posterior pharyngeal wall / airway. */}
      <path
        d="M116 101 C112 122 113 149 120 177"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.42"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M124 105 C121 126 122 149 128 171"
        fill="none"
        stroke="var(--blue)"
        strokeOpacity="0.28"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Mouth floor and inner mandible. */}
      <path
        d="M222 154 C205 165 183 171 160 170 C145 169 134 165 126 159"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.56"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M224 158 C210 174 190 184 166 188"
        fill="none"
        stroke="currentColor"
        strokeOpacity={kind === 'jaw' ? 0.82 : 0.32}
        strokeWidth={kind === 'jaw' ? 4.4 : 2.7}
        strokeLinecap="round"
      />

      {/* Exercise target, deliberately behind the active structure. */}
      <ellipse
        cx={target.cx}
        cy={target.cy}
        rx={target.rx}
        ry={target.ry}
        fill="var(--blue)"
        fillOpacity="0.08"
        stroke="var(--blue)"
        strokeOpacity="0.78"
        strokeWidth="2.2"
        strokeDasharray="5 5"
      />

      {/* Tongue – one distinct posture per exercise. */}
      <path
        d={tonguePaths[kind]}
        fill="var(--blue)"
        fillOpacity="0.18"
        stroke="var(--blue)"
        strokeOpacity="0.88"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Vowel exercise: activation waves at the soft palate instead of a movement arrow. */}
      {kind === 'vowel' && (
        <g
          fill="none"
          stroke="var(--blue)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeOpacity="0.9"
        >
          <path d="M143 91 C151 94 155 100 155 107" />
          <path d="M149 84 C162 89 169 98 169 108" strokeOpacity="0.56" />
        </g>
      )}

      {/* Swallow exercise: subtle posterior contraction cue. */}
      {kind === 'swallow' && (
        <path
          d="M132 130 C126 135 124 142 126 149"
          fill="none"
          stroke="var(--blue)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeOpacity="0.72"
        />
      )}

      {/* Direction of movement. */}
      {arrow && (
        <line
          x1={arrow.from.x}
          y1={arrow.from.y}
          x2={arrow.to.x}
          y2={arrow.to.y}
          stroke="var(--blue)"
          strokeWidth="3.4"
          strokeLinecap="round"
          markerEnd={`url(#${markerId})`}
        />
      )}
    </svg>
  );
}
