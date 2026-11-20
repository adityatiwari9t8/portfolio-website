import './preview.css';

const treatments = [
  { id: 'archivo', name: 'Archivo Black' },
  { id: 'barlow', name: 'Barlow Condensed' },
  { id: 'bodoni', name: 'Bodoni Moda' },
  { id: 'bricolage', name: 'Bricolage Grotesque' },
  { id: 'fraunces', name: 'Fraunces' },
  { id: 'plex', name: 'IBM Plex Mono' },
  { id: 'instrument', name: 'Instrument Serif' },
  { id: 'manrope', name: 'Manrope' },
  { id: 'space', name: 'Space Grotesk' },
  { id: 'syne', name: 'Syne' },
];

type TypographyPreviewProps = {
  selected: string;
  onSelect: (id: string) => void;
};

export default function TypographyPreview({ selected, onSelect }: TypographyPreviewProps) {
  return (
    <label className="hero-typography-control">
      Headline typography
      <select value={selected} onChange={(event) => onSelect(event.target.value)}>
        <option value="current">Current homepage style</option>
        {treatments.map(({ id, name }, index) => (
          <option key={id} value={id}>{index + 1}. {name}</option>
        ))}
      </select>
    </label>
  );
}
