import { useState } from 'react';
import { Button, Progress, Range } from '../index';
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
  return (
    <>
      <PageHeader title="Range" description="DaisyUI range with optional value tooltip." />
      <Section title="Range">
        <div className="q-grid" style={{ maxWidth: '30rem', gap: '1.5rem' }}>
          <Range defaultValue={40} />
          <Range showTooltip={false} defaultValue={60} />
        </div>
      </Section>
    </>
  );
};
