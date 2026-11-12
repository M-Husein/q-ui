import { useState } from 'react';
import { Combobox } from '../index';
import { PageHeader, Section } from '../layout/demo';

const frameworkOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
];

export const ComboboxPage = () => {
  const [val, setVal] = useState<string | string[]>('react');
  return (
    <>
      <PageHeader title="Combobox" description="Custom component (DaisyUI has none): searchable, single or multiple." />
      <Section title="Single">
        <div style={{ maxWidth: '24rem' }}>
          <Combobox options={frameworkOptions} value={val} onChange={(v) => setVal(v)} placeholder="Select framework" canClear canSearch />
        </div>
      </Section>
      <Section title="Multiple">
        <div style={{ maxWidth: '24rem' }}>
          <Combobox options={frameworkOptions} multiple placeholder="Multiple select" canClear />
        </div>
      </Section>
    </>
  );
};
