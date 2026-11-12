import { Accordion, Collapse, Tabs } from '../index';
import { PageHeader, Section } from '../layout/demo';

export const AccordionPage = () => (
  <>
    <PageHeader title="Accordion" description="DaisyUI collapse with collapse-arrow." />
    <Section title="Accordion">
      <Accordion items={[
        { id: 1, title: 'Accordion 1', children: <p>Content 1</p> },
        { id: 2, title: 'Accordion 2', children: <p>Content 2</p> },
      ]} />
    </Section>
  </>
);

export const CollapsePage = () => (
  <>
    <PageHeader title="Collapse" description="Single collapsible panel." />
    <Section title="Collapse">
      <Collapse title="Collapse 1"><p>Collapse content</p></Collapse>
    </Section>
  </>
);

export const TabsPage = () => (
  <>
    <PageHeader title="Tabs" description="DaisyUI tabs-bordered." />
    <Section title="Tabs">
      <Tabs items={[
        { id: 1, label: 'Tab 1', content: <p>Tab content 1</p> },
        { id: 2, label: 'Tab 2', content: <p>Tab content 2</p> },
      ]} />
    </Section>
  </>
);
