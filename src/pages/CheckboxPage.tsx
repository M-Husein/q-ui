import { useState } from 'react';
import { Checkbox, Radio } from '../index';
import { PageHeader, Section } from '../layout/demo';

export const CheckboxPage = () => {
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(true);
  const [selected, setSelected] = useState('a');
  return (
    <>
      <PageHeader title="Checkbox & Radio" description="DaisyUI checkbox/radio with indeterminate fallback." />
      <Section title="Checkbox">
        <div className="q-row">
          <Checkbox onChange={(e) => console.log('checked', e.target.checked)}>Checkbox</Checkbox>
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
            Controlled: {checked ? 'Checked' : 'Unchecked'}
          </Checkbox>
          <Checkbox indeterminate={indeterminate} checked={checked} onChange={(e) => { setIndeterminate(false); setChecked(e.target.checked); }}>
            Indeterminate
          </Checkbox>
          <Checkbox disabled defaultChecked>Disabled Checked</Checkbox>
        </div>
      </Section>
      <Section title="Radio">
        <div className="q-row">
          {(['a', 'b', 'c'] as const).map((v) => (
            <Radio key={v} name="opt" value={v} checked={selected === v} onChange={(e) => setSelected(e.target.value)}>
              Option {v.toUpperCase()}
            </Radio>
          ))}
        </div>
      </Section>
    </>
  );
};
