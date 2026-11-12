import { Carousel } from '../index';
import { PageHeader, Section } from '../layout/demo';

const Slide = ({ bg, title }: { bg: string; title: string }) => (
  <div style={{ background: bg, color: '#fff', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
    <h2>{title}</h2>
  </div>
);

const slides = [
  { id: 's1', children: <Slide bg="#2563eb" title="Slide 1" /> },
  { id: 's2', children: <Slide bg="#059669" title="Slide 2" /> },
  { id: 's3', children: <Slide bg="#7c3aed" title="Slide 3" /> },
];

export const CarouselPage = () => (
  <>
    <PageHeader title="Carousel" description="DaisyUI carousel with optional autoplay." />
    <Section title="Manual">
      <Carousel items={slides} />
    </Section>
    <Section title="Autoplay">
      <Carousel items={slides} autoPlay autoPlayInterval={2500} />
    </Section>
  </>
);
