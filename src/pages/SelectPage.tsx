import { useState } from 'react';
import { Select } from '../index';
import { PageHeader, Section } from '../layout/demo';

const countryOptions = [
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'jp', label: '🇯🇵 Japan' },
  { value: 'de', label: '🇩🇪 Germany' },
];

export const SelectPage = () => {
  const [country, setCountry] = useState('');
  return (
    <>
      <PageHeader title="Select" description="Native select (DaisyUI) and a searchable select built on the Popover API." />
      <Section title="Select">
        <div className="q-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: '40rem' }}>
          <Select placeholder="Select a country" canClear value={country} options={countryOptions} onChange={(v) => setCountry(v)} />
          <Select defaultValue="react">
            <option value="react">React 19</option>
            <option value="vue">Vue 3</option>
            <option value="svelte">Svelte 5</option>
          </Select>
          <Select placeholder="Disabled" disabled options={countryOptions} />
        </div>
      </Section>
    </>
  );
};
