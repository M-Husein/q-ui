import { useState } from 'react';
import {
  Button,
  Checkbox,
  Radio,
  Input,
  Textarea,
  Accordion,
  Collapse,
  Tabs,
  Progress,
  Range,
  RangeSlider,
  Modal,
  Drawer,
  Popover,
  Tooltip,
  Toast,
  Select,
  SelectNative,
  Combobox,
  Carousel,
  useInputMask,
} from './index';

const toggleInert = (isInert: boolean) => {
  const root = document.getElementById('root') as HTMLDivElement | null;
  if (root) isInert ? root.setAttribute('inert', '') : root.removeAttribute('inert');
};

function DateField() {
  const date = useInputMask({
    format: 'dd/mm/yyyy',
    inputMode: 'numeric',
    placeholder: 'DD/MM/YYYY',
    onValueChange: (value, unmasked) => console.log({ value, unmasked }),
  });
  return <Input {...date.fieldProps} />;
}

export const App = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [position, setPosition] = useState<any>('bottomLeft');
  const [singleVal, setSingleVal] = useState<number>(70);
  const [dualVal, setDualVal] = useState<[number, number]>([10, 70]);
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(true);
  const [selectedValue, setSelectedValue] = useState('a');
  const [selectVal, setSelectVal] = useState('');
  const [progressVal, setProgressVal] = useState(45);
  const [comboboxVal, setComboboxVal] = useState<string | string[]>('react');

  const countryOptions = [
    { value: 'us', label: '🇺🇸 United States', desc: 'North America' },
    { value: 'jp', label: '🇯🇵 Japan', desc: 'East Asia' },
    { value: 'de', label: '🇩🇪 Germany', desc: 'Central Europe' },
  ];
  const frameworkOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'angular', label: 'Angular' },
  ];

  const slides = [
    { id: 's1', children: <Slide bg="#2563eb" title="Slide 1" /> },
    { id: 's2', children: <Slide bg="#059669" title="Slide 2" /> },
    { id: 's3', children: <Slide bg="#7c3aed" title="Slide 3" /> },
  ];

  const triggerToast = (pos: any) => {
    setPosition(pos);
    setShowToast(true);
  };
  const handleClose = () => {
    setOpenModal(false);
    toggleInert(false);
  };
  const handleOpened = () => toggleInert(true);

  return (
    <div className="q-app">
      <header className="q-section" style={{ borderBottom: '2px solid var(--q-border)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Q UI</h1>
        <p className="q-muted">Framework-agnostic Web UI · Tailwind CSS · DaisyUI · React</p>
      </header>

      <section className="q-section">
        <h2>Button</h2>
        <div className="q-row">
          <Button kind="primary">Primary</Button>
          <Button kind="success">Success</Button>
          <Button kind="error">Error</Button>
          <Button kind="warning">Warning</Button>
          <Button kind="info">Info</Button>
        </div>
        <div className="q-row" style={{ marginTop: '0.75rem' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="q-row" style={{ marginTop: '0.75rem' }}>
          <Button outline kind="primary">Outline Primary</Button>
          <Button outline kind="success">Outline Success</Button>
          <Button outline kind="error">Outline Error</Button>
        </div>
        <div className="q-row" style={{ marginTop: '0.75rem' }}>
          <Button as="a" href="#">Link</Button>
          <Button type="submit">Submit</Button>
          <Button disabled kind="error">Disabled</Button>
          <Button onClick={() => alert('clicked')}>Click me</Button>
        </div>
      </section>

      <section className="q-section">
        <h2>Inputs & Textarea</h2>
        <div className="q-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: '40rem' }}>
          <Input placeholder="Standard input" />
          <DateField />
          <Textarea placeholder="Auto-size textarea..." autosize minRows={2} maxRows={6} />
          <Textarea placeholder="Fixed textarea" rows={4} />
        </div>
      </section>

      <section className="q-section">
        <h2>Checkbox & Radio</h2>
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
        <div className="q-row" style={{ marginTop: '0.75rem' }}>
          <Radio name="opt" value="a" checked={selectedValue === 'a'} onChange={(e) => setSelectedValue(e.target.value)}>Option A</Radio>
          <Radio name="opt" value="b" checked={selectedValue === 'b'} onChange={(e) => setSelectedValue(e.target.value)}>Option B</Radio>
          <Radio name="opt" value="c" checked={selectedValue === 'c'} onChange={(e) => setSelectedValue(e.target.value)}>Option C</Radio>
        </div>
      </section>

      <section className="q-section">
        <h2>Select</h2>
        <div className="q-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: '40rem' }}>
          <Select placeholder="Select a person" canClear value={selectVal} options={countryOptions} onChange={(v) => setSelectVal(v)} />
          <SelectNative placeholder="Choose framework" options={frameworkOptions} />
          <Select defaultValue="react">
            <option value="react">React 19</option>
            <option value="vue">Vue 3</option>
            <option value="svelte">Svelte 5</option>
          </Select>
          <Select placeholder="Disabled" disabled options={countryOptions} />
        </div>
      </section>

      <section className="q-section">
        <h2>Combobox</h2>
        <div style={{ maxWidth: '24rem' }}>
          <Combobox options={frameworkOptions} value={comboboxVal} onChange={(v) => setComboboxVal(v)} placeholder="Select framework" canClear canSearch />
          <div style={{ height: '1rem' }} />
          <Combobox options={frameworkOptions} multiple placeholder="Multiple select" canClear />
        </div>
      </section>

      <section className="q-section">
        <h2>Accordion, Collapse & Tabs</h2>
        <Accordion items={[
          { id: 1, title: 'Accordion 1', children: <p>Content 1</p> },
          { id: 2, title: 'Accordion 2', children: <p>Content 2</p> },
        ]} />
        <Collapse title="Collapse 1"><p>Collapse content</p></Collapse>
        <div style={{ height: '1rem' }} />
        <Tabs items={[
          { id: 1, label: 'Tab 1', content: <p>Tab content 1</p> },
          { id: 2, label: 'Tab 2', content: <p>Tab content 2</p> },
        ]} />
      </section>

      <section className="q-section">
        <h2>Progress, Range & Slider</h2>
        <div className="q-grid" style={{ maxWidth: '30rem', gap: '1.5rem' }}>
          <Progress value={progressVal} />
          <RangeSlider value={singleVal} onChange={(v) => setSingleVal(v as number)} />
          <RangeSlider value={dualVal} onChange={(v) => setDualVal(v as [number, number])} />
          <Range defaultValue={40} />
          <Range showTooltip={false} defaultValue={60} />
          <Button kind="info" onClick={() => setProgressVal((p) => Math.min(100, p + 10))}>Increase progress</Button>
        </div>
      </section>

      <section className="q-section">
        <h2>Popover, Tooltip & Toast</h2>
        <div className="q-row">
          <Popover trigger={<Button>Cek Popover</Button>}>
            <h3>Account Settings</h3>
            <p>Kelola preferensi overlay.</p>
          </Popover>
          <Tooltip content="Menyimpan perubahan ke database">
            <Button>Hover Me</Button>
          </Tooltip>
          <Button onClick={() => triggerToast('bottomLeft')}>Toast Bottom Left</Button>
          <Button onClick={() => triggerToast('topRight')}>Toast Top Right</Button>
        </div>
        <Toast open={showToast} onClose={() => setShowToast(false)} position={position} duration={3000}>
          Notifikasi di posisi: <strong>{position}</strong>
        </Toast>
      </section>

      <section className="q-section">
        <h2>Modal & Drawer</h2>
        <div className="q-row">
          <Button onClick={() => setOpenModal(true)}>Open Modal</Button>
          <BasicDrawerDemo />
          <NavigationDrawerDemo />
        </div>
        <Modal open={openModal} onOpen={handleOpened} onClose={handleClose} aria-labelledby="q-modal-title">
          <Button outline kind="error" aria-label="Close" onClick={handleClose}>✕</Button>
          <h2 id="q-modal-title">User Settings</h2>
          <p>Modal berbasis native &lt;dialog&gt; dengan backdrop.</p>
          <Input placeholder="Nama" autoFocus />
        </Modal>
      </section>

      <section className="q-section">
        <h2>Carousel</h2>
        <Carousel items={slides} />
        <div style={{ height: '1rem' }} />
        <Carousel items={slides} autoPlay autoPlayInterval={2500} />
      </section>
    </div>
  );
};

const Slide = ({ bg, title }: { bg: string; title: string }) => (
  <div style={{ background: bg, color: '#fff', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
    <h2>{title}</h2>
  </div>
);

const BasicDrawerDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Your Cart (2 items)" footer={<>
        <Button kind="info" onClick={() => setOpen(false)}>Continue</Button>
        <Button kind="success" onClick={() => alert('Checkout')}>Checkout</Button>
      </>}>
        <p>Item 1 — $99.00</p>
        <p>Item 2 — $50.00</p>
      </Drawer>
    </>
  );
};

const NavigationDrawerDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button outline onClick={() => setOpen(true)}>☰ Menu</Button>
      <Drawer open={open} onClose={() => setOpen(false)} position="end" title="Navigation">
        <nav>
          <p>Dashboard</p>
          <p>Analytics</p>
          <p>Settings</p>
        </nav>
      </Drawer>
    </>
  );
};
