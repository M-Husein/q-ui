import { Input, Textarea, useInputMask } from '../index';
import { PageHeader, Section } from '../layout/demo';

function DateField() {
  const date = useInputMask({
    format: 'dd/mm/yyyy',
    inputMode: 'numeric',
    placeholder: 'DD/MM/YYYY',
    onValueChange: (value, unmasked) => console.log({ value, unmasked }),
  });
  return <Input {...date.fieldProps} />;
}

export const InputPage = () => (
  <>
    <PageHeader title="Input & Textarea" description="DaisyUI input/textarea. Textarea autosize uses field-sizing when supported." />
    <Section title="Input">
      <div className="q-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: '40rem' }}>
        <Input placeholder="Standard input" />
        <DateField />
      </div>
    </Section>
    <Section title="Textarea">
      <div className="q-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: '40rem' }}>
        <Textarea placeholder="Auto-size textarea..." autosize minRows={2} maxRows={6} />
        <Textarea placeholder="Fixed textarea" rows={4} />
      </div>
    </Section>
  </>
);
