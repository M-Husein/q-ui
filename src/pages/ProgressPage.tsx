import { useState } from 'react';
import { Button, Progress, Range, RangeSlider } from '../index';
import { PageHeader, Section } from '../layout/demo';

export const ProgressPage = () => {
  const [progress, setProgress] = useState(45);
  return (
    <>
      <PageHeader title="Progress" description="DaisyUI progress with variants, striped and animated." />
      <Section title="Progress">
        <div className="q-grid" style={{ maxWidth: '30rem' }}>
          <Progress value={progress} />
          <Progress value={60} variant="success" striped />
          <Progress value={30} variant="error" striped animated />
          <Progress value={80} variant="warn" />
          <Progress value={50} variant="info" />
          <Button kind="info" onClick={() => setProgress((p) => Math.min(100, p + 10))}>Increase progress</Button>
        </div>
      </Section>
    </>
  );
};

export const RangePage = () => {
  const [single, setSingle] = useState<number>(70);
  const [dual, setDual] = useState<[number, number]>([10, 70]);
  return (
    <>
      <PageHeader title="Range & Slider" description="DaisyUI range plus a custom dual-thumb slider (DaisyUI has none)." />
      <Section title="Range">
        <div className="q-grid" style={{ maxWidth: '30rem', gap: '1.5rem' }}>
          <Range defaultValue={40} />
          <Range showTooltip={false} defaultValue={60} />
        </div>
      </Section>
      <Section title="Slider">
        <div className="q-grid" style={{ maxWidth: '30rem', gap: '1.5rem' }}>
          <RangeSlider value={single} onChange={(v) => setSingle(v as number)} />
          <RangeSlider value={dual} onChange={(v) => setDual(v as [number, number])} />
        </div>
      </Section>
    </>
  );
};
