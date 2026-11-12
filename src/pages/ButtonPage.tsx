import { useState } from 'react';
import { Button } from '../index';
import { PageHeader, Section } from '../layout/demo';

const COLORS = ['Neutral', 'Primary', 'Secondary', 'Accent', 'Info', 'Success', 'Warning', 'Error'] as const;
const KINDS = ['neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'] as const;

export const ButtonPage = () => {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <PageHeader title="Button" description="DaisyUI btn classes. kind = DaisyUI color, variant = style." />

      <Section title="Colors">
        <div className="q-row">
          {KINDS.map((k, i) => (
            <Button key={k} kind={k}>{COLORS[i]}</Button>
          ))}
        </div>
      </Section>

      <Section title="Outline">
        <div className="q-row">
          {KINDS.map((k, i) => (
            <Button key={k} variant="outline" kind={k}>{COLORS[i]}</Button>
          ))}
        </div>
      </Section>

      <Section title="Soft">
        <div className="q-row">
          <Button variant="soft">Default</Button>
          {KINDS.slice(1).map((k, i) => (
            <Button key={k} variant="soft" kind={k}>{COLORS[i + 1]}</Button>
          ))}
        </div>
      </Section>

      <Section title="Dash">
        <div className="q-row">
          <Button variant="dash">Default</Button>
          {KINDS.slice(1).map((k, i) => (
            <Button key={k} variant="dash" kind={k}>{COLORS[i + 1]}</Button>
          ))}
        </div>
        <p className="q-muted" style={{ marginTop: '1rem' }}>
          Neutral with outline or dash (use on light backgrounds, dark text):
        </p>
        <div className="bg-white p-6 q-row" style={{ marginTop: '0.5rem' }}>
          <Button variant="outline" kind="neutral">Outline</Button>
          <Button variant="dash" kind="neutral">Dash</Button>
        </div>
      </Section>

      <Section title="Sizes">
        <div className="q-row">
          <Button size="xs">Xsmall</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Xlarge</Button>
        </div>
      </Section>

      <Section title="Ghost & link">
        <div className="q-row">
          <Button kind="ghost">Ghost</Button>
          <Button kind="link">Link</Button>
        </div>
      </Section>

      <Section title="Buttons with any HTML tags">
        <p className="q-muted">Button classes applied to native and non-button elements.</p>
        <div className="q-row" style={{ marginTop: '0.75rem' }}>
          <Button as="a" href="#button">Link</Button>
          <Button type="submit">Button</Button>
          <Button as="input" type="button" value="Input" />
          <Button as="input" type="submit" value="Submit" />
          <Button as="input" type="reset" value="Reset" />
          <Button as="input" type="radio" aria-label="Radio" name="any-tag-radio" />
          <Button as="input" type="checkbox" aria-label="Checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        </div>
      </Section>

      <Section title="Disabled">
        <div className="q-row">
          <Button disabled>Disabled using attribute</Button>
          <Button className="btn-disabled" role="button" aria-disabled="true" tabIndex={-1}>
            Disabled using class name
          </Button>
        </div>
      </Section>

      <Section title="Icon & square / circle">
        <div className="q-row">
          <Button className="btn-square" aria-label="Like">
            <HeartIcon />
          </Button>
          <Button className="btn-circle" aria-label="Like">
            <HeartIcon />
          </Button>
          <Button>
            <HeartIcon /> Like
          </Button>
          <Button>
            Like <HeartIcon />
          </Button>
        </div>
      </Section>

      <Section title="Loading & block">
        <div className="q-row">
          <Button className="btn-square" aria-label="Loading">
            <span className="loading loading-spinner" />
          </Button>
          <Button>
            <span className="loading loading-spinner" /> loading
          </Button>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <Button className="btn-block">Block</Button>
        </div>
      </Section>
    </>
  );
};

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);
