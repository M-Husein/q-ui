import { Button } from '../index';
import { PageHeader, Section } from '../layout/demo';

export const ButtonPage = () => (
  <>
    <PageHeader title="Button" description="DaisyUI btn classes. kind = DaisyUI color name." />
    <Section title="Colors">
      <div className="q-row">
        <Button kind="primary">Primary</Button>
        <Button kind="secondary">Secondary</Button>
        <Button kind="accent">Accent</Button>
        <Button kind="neutral">Neutral</Button>
        <Button kind="info">Info</Button>
        <Button kind="success">Success</Button>
        <Button kind="warning">Warning</Button>
        <Button kind="error">Error</Button>
        <Button kind="ghost">Ghost</Button>
        <Button kind="link">Link</Button>
      </div>
    </Section>
    <Section title="Outline">
      <div className="q-row">
        <Button outline kind="primary">Primary</Button>
        <Button outline kind="success">Success</Button>
        <Button outline kind="error">Error</Button>
      </div>
    </Section>
    <Section title="Sizes">
      <div className="q-row">
        <Button size="xs" kind="primary">Extra small</Button>
        <Button size="sm" kind="primary">Small</Button>
        <Button size="md" kind="primary">Medium</Button>
        <Button size="lg" kind="primary">Large</Button>
        <Button size="xl" kind="primary">Extra large</Button>
      </div>
    </Section>
    <Section title="States & elements">
      <div className="q-row">
        <Button as="a" href="#button" kind="info">Link element</Button>
        <Button type="submit" kind="primary">Submit</Button>
        <Button disabled kind="error">Disabled</Button>
        <Button kind="success" onClick={() => alert('clicked')}>Click me</Button>
      </div>
    </Section>
  </>
);
