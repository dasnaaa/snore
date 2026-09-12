import type { Visual } from './program';

const assets: Record<Visual, { minimal: string; detail: string; alt: string }> = {
  'tongue-up': {
    minimal: '/exercises/01_zunge_ansaugen_minimal.png',
    detail: '/exercises/01_zunge_ansaugen_detail.png',
    alt: 'Seitenansicht von Mund und Rachen: Zunge flächig an den harten Gaumen angesaugt',
  },
  'tongue-slide': {
    minimal: '/exercises/02_zungenspitze_nach_hinten_minimal.png',
    detail: '/exercises/02_zungenspitze_nach_hinten_detail.png',
    alt: 'Seitenansicht von Mund und Rachen: Zungenspitze wird am Gaumen nach hinten geführt',
  },
  'cheek-press': {
    minimal: '/exercises/03_zungenruecken_absenken_minimal.png',
    detail: '/exercises/03_zungenruecken_absenken_detail.png',
    alt: 'Seitenansicht von Mund und Rachen: Zungenspitze bleibt unten, Zungenrücken senkt sich Richtung Rachen',
  },
  vowel: {
    minimal: '/exercises/04_weichen_gaumen_aktivieren_minimal.png',
    detail: '/exercises/04_weichen_gaumen_aktivieren_detail.png',
    alt: 'Seitenansicht von Mund und Rachen: weicher Gaumen und Zäpfchen werden beim gehaltenen A aktiviert',
  },
  swallow: {
    minimal: '/exercises/05_bewusst_schlucken_minimal.png',
    detail: '/exercises/05_bewusst_schlucken_detail.png',
    alt: 'Seitenansicht von Mund und Rachen: Zunge führt den bewussten Schluckvorgang am harten Gaumen',
  },
  jaw: {
    minimal: '/exercises/06_kiefer_stabilisieren_minimal.png',
    detail: '/exercises/06_kiefer_stabilisieren_detail.png',
    alt: 'Seitenansicht von Mund und Rachen: Unterkiefer wird kontrolliert nach vorn geführt',
  },
};

export function Illustration({ kind, className }: { kind: Visual; className?: string }) {
  const asset = assets[kind];
  const isMinimal = className === 'exercise-illustration';
  const src = isMinimal ? asset.minimal : asset.detail;

  return (
    <div className={`illustration-card ${isMinimal ? 'illustration-card-minimal' : 'illustration-card-detail'} ${className ?? ''}`}>
      <img src={src} alt={asset.alt} loading={isMinimal ? 'lazy' : 'eager'} />
    </div>
  );
}
