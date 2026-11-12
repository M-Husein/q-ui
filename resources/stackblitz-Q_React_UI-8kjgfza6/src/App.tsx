import { useState, useEffect } from 'react';
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css';

// import './components/Modal.css';
import { Button } from './components/Button';
// import { Textarea } from './components/Textarea';
import { Textarea as Textarea2 } from './components/Textarea2';
import { Modal } from './components/Modal';
import { Accordion } from './components/Accordion';
import { Collapse } from './components/Collapse';
import { Tabs } from './components/Tabs';
import { Popover } from './components/Popover';
import { Tooltip } from './components/Tooltip';
import { Toast, type ToastPosition } from './components/Toast';
import { Carousel, type CarouselItemProps } from './components/Carousel';
import { Checkbox } from './components/Checkbox';
import { Radio } from './components/Radio';
import { Select } from './components/Select';
import { Select as SelectNative } from './components/SelectNative';
import { Combobox, type ComboboxOption } from './components/Combobox';
import { Progress } from './components/Progress';
import { Drawer } from './components/Drawer';

import { RangeSlider, type RangeSliderValue } from './components/RangeSlider';

import { Range } from './components/Range';
import { useInputMask } from './hooks/useInputMask';

const DateField = () => {
  const date = useInputMask({
    format: 'dd/mm/yyyy',
    inputMode: 'numeric',
    placeholder: 'DD/MM/YYYY',
    onValueChange: (value, unmaskedValue) => {
      // "13/10/2026"
      // "13102026"
      console.log({ value, unmaskedValue });
    },
  });

  return <input type="text" {...date.fieldProps} />;
};

const toggleInert = (isInert: boolean) => {
  const root = document.getElementById('root') as HTMLDivElement;
  // console.log({ root });
  if (root) {
    isInert ? root.setAttribute('inert', '') : root.removeAttribute('inert');
  }
};

const countryOptions = [
  { value: 'us', label: 'United States', flag: '🇺🇸', desc: 'North America' },
  { value: 'jp', label: 'Japan', flag: '🇯🇵', desc: 'East Asia' },
  { value: 'de', label: 'Germany', flag: '🇩🇪', desc: 'Central Europe' },
];
const cityOptions = [
  { value: 'jack', label: 'Jack (2026)' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'disabled', label: 'Disabled Option', disabled: true },
  { value: 'yiminghe', label: 'Yiminghe' },
];
const frameworkOptions = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
];

function App() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [position, setPosition] = useState<ToastPosition>('bottomLeft');
  const [singleVal, setSingleVal] = useState<RangeSliderValue>(70);
  const [dualVal, setDualVal] = useState<RangeSliderValue>([10, 70]);

  const [checked, setChecked] = useState<boolean>(true);
  const [indeterminate, setIndeterminate] = useState<boolean>(true);

  const [selectedValue, setSelectedValue] = useState<string>('a');
  const [selectVal, setSelectVal] = useState<string>('');

  const [progressVal, setProgressVal] = useState<number>(45);

  const [userOptions, setUserOptions] = useState<ComboboxOption[]>([
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
  ]);
  const [username, setUsername] = useState('');

  const addItem = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setUserOptions((prev) => [
      ...prev,
      { value: username.toLowerCase(), label: username },
    ]);
    setUsername('');
  };

  const slides: CarouselItemProps[] = [
    {
      id: 'slide-1',
      children: (
        <div
          style={{
            background: '#2563eb',
            color: '#fff',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
          }}
        >
          <h2>Slide 1</h2>
        </div>
      ),
    },
    {
      id: 'slide-2',
      children: (
        <div
          style={{
            background: '#059669',
            color: '#fff',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
          }}
        >
          <h2>Slide 2</h2>
        </div>
      ),
    },
    {
      id: 'slide-3',
      children: (
        <div
          style={{
            background: '#7c3aed',
            color: '#fff',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
          }}
        >
          <h2>Slide 3</h2>
        </div>
      ),
    },
  ];

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    toggleInert(false);
    console.log('Modal close');
  };

  const handleModalOpened = () => {
    toggleInert(true);
    console.log('Modal opened successfully!');
  };

  const triggerToast = (pos: ToastPosition) => {
    setPosition(pos);
    setShowToast(true);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>{'<Button />'}</h2>
      {/* 1. Kinds */}
      <section style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button kind="main">Main</Button>
        <Button kind="success">Success</Button>
        <Button kind="error">Error</Button>
        <Button kind="warn">Warn</Button>
        <Button kind="info">Info</Button>
      </section>
      {/* 2. Sizes */}
      <section style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button size="sm">Small (btn-sm)</Button>
        <Button size="md">Medium (default, no size class)</Button>
        <Button size="lg">Large (btn-lg)</Button>
      </section>
      <section style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button outline kind="main">
          Main Outline
        </Button>
        <Button outline kind="success">
          Success Outline
        </Button>
        <Button outline kind="error">
          Error Outline
        </Button>
        <Button outline kind="warn">
          Warn Outline
        </Button>
        <Button outline kind="info">
          Info Outline
        </Button>
      </section>
      <section style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button as="a" href="#">
          Link
        </Button>
        <Button type="submit">Button</Button>
        <Button as="input" value="Input" />
        <Button as="div" onClick={() => console.log('click Button as div')}>
          Div
        </Button>
        <Button as="span">Span</Button>
        <Button as="b">B</Button>
        <Button as="i">I</Button>

        <Button as="label">
          <input type="file" hidden />
          File input
        </Button>
      </section>
      {/* 3. Native Attributes extended from HTMLButtonElement */}
      <section style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button type="submit" onClick={() => alert('Submitted!')}>
          Submit Form
        </Button>
        <Button disabled kind="error">
          Disabled Button
        </Button>
      </section>
      <hr />
      <section>
        <h2>{'<DateField />'} using useInputMask hook</h2>
        <p>
          <strong>Reference: </strong>
          <a
            href="https://ui.nuxt.com/docs/components/input-date#as-a-date-picker"
            target="_blank"
          >
            https://ui.nuxt.com/docs/components/input-date#as-a-date-picker
          </a>
        </p>
        <DateField />
      </section>
      <hr />
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          width: '400px',
        }}
      >
        <h2>{'<Textarea />'}</h2>

        {/* <p>Dev autoSize</p>
        <div>
          <textarea className="form-control" />
        </div> */}

        {/* Standard Textarea */}
        {/* <Textarea placeholder="Standard fixed textarea (3 rows)..." /> */}

        {/* Auto-sizing with minRows and maxRows */}
        {/* <Textarea
          autosize
          minRows={2}
          maxRows={6}
          placeholder="Auto-sizing: grows from 2 to 6 rows..."
        /> */}

        {/* Custom Resize Handles */}
        {/* <Textarea
          resize="vertical"
          placeholder="Manually resizable vertically only..."
        />

        <Textarea
          resize={false}
          placeholder="Manual resize handle disabled completely..."
        /> */}

        <div>
          <h3>
            {'<Textarea2 /> with fallback autoSize field-sizing no support'}
          </h3>
          <Textarea2
            autosize
            minRows={2}
            maxRows={6}
            placeholder="Auto-sizing: grows from 2 to 6 rows..."
          />
        </div>
      </section>
      <hr />
      <h2>Modal with dialog</h2>
      <Button onClick={handleOpen}>Open Modal</Button>{' '}
      <Button onClick={() => setOpenModal(!openModal)}>
        Toggle Modal (open: {openModal + ''})
      </Button>{' '}
      {/* 1. Popover Example */}
      <Popover
        trigger={<Button className="CUSTOM_CLASS">Open Popover Menu</Button>}
      >
        <h3>Account Settings</h3>
        <p>Manage your top-layer overlay preferences.</p>
      </Popover>{' '}
      {/* 2. Tooltip Example */}
      <Tooltip content="Saves changes to the database">
        <Button>Hover Me</Button>
      </Tooltip>{' '}
      {/* 3. Toast Notification Example */}
      <Button onClick={() => triggerToast('bottomLeft')}>
        Bottom Left (Default)
      </Button>{' '}
      <Button onClick={() => triggerToast('bottomRight')}>Bottom Right</Button>{' '}
      <Button onClick={() => triggerToast('top')}>Top Center</Button>{' '}
      <Button onClick={() => triggerToast('bottom')}>Bottom Center</Button>{' '}
      <Button onClick={() => triggerToast('topLeft')}>Top Left</Button>{' '}
      <Button onClick={() => triggerToast('topRight')}>Top Right</Button>
      <Toast
        open={showToast}
        onClose={() => setShowToast(false)}
        position={position}
        duration={3000}
      >
        <span>
          Notification at position: <strong>{position}</strong>
        </span>
      </Toast>
      <hr />
      <h2>{'<Drawer />'}</h2>
      <h3>Basic Controlled Drawer</h3>
      <BasicDrawerDemo />
      <br />
      <h3>Navigation Sidebar (position="end")</h3>
      <NavigationDrawerDemo />
      <h3>Mobile Bottom Sheet (position="bottom")</h3>
      <BottomSheetDemo />
      <br />
      <h3>Custom Header & Non-Backdrop Close</h3>
      <CustomHeaderDrawerDemo />
      <hr />
      <h2>{'<Checkbox />'}</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        {/* 1. Basic Direct Prop Usage */}
        <Checkbox onChange={(e) => console.log('checked =', e.target.checked)}>
          Checkbox
        </Checkbox>
        {/* 2. Controlled State */}
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        >
          Controlled: {checked ? 'Checked' : 'Unchecked'}
        </Checkbox>
        {/* 3. Indeterminate State */}
        <Checkbox
          indeterminate={indeterminate}
          checked={checked}
          onChange={(e) => {
            setIndeterminate(false);
            setChecked(e.target.checked);
          }}
        >
          Indeterminate State
        </Checkbox>
        {/* 4. Disabled State */}
        <Checkbox disabled defaultChecked>
          Disabled Checked
        </Checkbox>
      </div>
      <hr />
      <h2>{'<Radio />'}</h2>
      {/* 1. Basic Radio Group using Native "name" attribute */}
      <section style={{ display: 'flex', gap: '1.5rem' }}>
        <Radio
          name="optionGroup"
          value="a"
          checked={selectedValue === 'a'}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          Option A
        </Radio>

        <Radio
          name="optionGroup"
          value="b"
          checked={selectedValue === 'b'}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          Option B
        </Radio>

        <Radio
          name="optionGroup"
          value="c"
          checked={selectedValue === 'c'}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          Option C
        </Radio>
      </section>
      {/* 2. Disabled States */}
      <section style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
        <Radio disabled>Disabled Unchecked</Radio>
        <Radio disabled defaultChecked>
          Disabled Checked
        </Radio>
      </section>
      <hr />
      <h2>{'<Select />'}</h2>
      <p>1. Controlled Select with Placeholder & Clear button</p>
      <Select
        placeholder="Select a person"
        canClear
        value={selectVal}
        options={cityOptions}
        onChange={(value) => setSelectVal(value)}
      />
      <p>2. Uncontrolled with Children Options</p>
      <Select placeholder="Choose Framework" canClear defaultValue="react">
        <option value="react">React 19</option>
        <option value="vue">Vue 3</option>
        <option value="svelte">Svelte 5</option>
      </Select>
      <p>3. Disabled State</p>
      <Select placeholder="Disabled select" disabled options={cityOptions} />
      <hr />
      <h2>{'<SelectNative />'}</h2>
      <SelectNative options={frameworkOptions} />
      <hr />
      <h2>{'<Combobox />'}</h2>
      <Combobox options={frameworkOptions} />
      <h3>disabled: true</h3>
      <Combobox disabled options={frameworkOptions} />
      <br />
      <h3>
        autoFocusSearch: false
        <br />
        placeholder
      </h3>
      <Combobox
        autoFocusSearch={false}
        placeholder="Select an option"
        options={frameworkOptions}
      />
      <br />
      <h3>canSearch: false</h3>
      <Combobox
        canSearch={false}
        placeholder="Select an option"
        options={frameworkOptions}
      />
      <br />
      <h3>multiple: true</h3>
      <Combobox multiple options={frameworkOptions} />
      <br />
      <h3>canClear: true</h3>
      <Combobox canClear options={frameworkOptions} placeholder="canClear" />
      <br />
      <Combobox
        canClear
        multiple
        options={frameworkOptions}
        placeholder="Multiple canClear"
      />
      <br />
      <h3>Group</h3>
      <Combobox
        options={[
          {
            title: 'Manager',
            label: <span>Manager</span>,
            options: [
              { label: 'Jack', value: 'jack' },
              { label: 'Lucy', value: 'lucy' },
            ],
          },
          {
            title: 'Engineer',
            label: <span>Engineer</span>,
            options: [{ label: 'Yimming', value: 'yiming' }],
          },
        ]}
      />
      <br />
      <h3>renderOption props</h3>
      <Combobox
        options={countryOptions}
        placeholder="Select country..."
        renderOption={(option, { isSelected }) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            <span style={{ fontSize: '18px' }}>{option.flag}</span>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontWeight: 500 }}>{option.label}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {option.desc}
              </span>
            </div>
            {isSelected && <span style={{ color: '#2563eb' }}>✓</span>}
          </div>
        )}
      />
      <br />
      <h3>renderTag props</h3>
      <Combobox
        options={[
          { value: 'gold', label: 'Gold', color: '#eab308' },
          { value: 'cyan', label: 'Cyan', color: '#06b6d4' },
          { value: 'magenta', label: 'Magenta', color: '#d946ef' },
          { value: 'lime', label: 'Lime', color: '#84cc16' },
        ]}
        multiple
        defaultValue={['gold', 'cyan']}
        placeholder="Select colors..."
        renderTag={({ label, option, onClose }) => (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: `${option.color}20`,
              color: option.color,
              border: `1px solid ${option.color}`,
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: 600,
              marginRight: '4px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span>{label}</span>
            <b style={{ cursor: 'pointer', marginLeft: 4 }} onClick={onClose}>
              ×
            </b>
          </span>
        )}
      />
      <br />
      <h3>renderPopup props</h3>
      <Combobox
        options={userOptions}
        placeholder="Select or add item..."
        renderPopup={(menu) => (
          <>
            {menu}
            <div
              style={{
                padding: 8,
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: 8,
              }}
            >
              <input
                type="text"
                placeholder="Please enter item"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: '1px solid #cbd5e1',
                }}
              />
              <Button onClick={addItem}>+ Add item</Button>
            </div>
          </>
        )}
      />
      <br />
      <h3>max props</h3>
      <MaxCountExample />
      <br />
      <h3>renderLabel props</h3>
      <CustomLabelExample />
      <br />
      <h3>filterKeys props</h3>
      <ComboboxMultiFieldSearch />
      <br />
      <h3>virtual</h3>
      <VirtualizedDummyDataExample />
      <hr />
      {/* 1. Single Handle Controlled */}
      <section>
        <h3>Single Handle (Controlled): {singleVal as number}</h3>
        <RangeSlider value={singleVal} onChange={(v) => setSingleVal(v)} />
      </section>
      {/* 2. Dual Handle Controlled */}
      <section style={{ marginTop: '2rem' }}>
        <h3>
          Dual Handle (Controlled): {(dualVal as [number, number])[0]} -{' '}
          {(dualVal as [number, number])[1]}
        </h3>
        <RangeSlider value={dualVal} onChange={(v) => setDualVal(v)} />
      </section>
      {/* 3. Uncontrolled Examples */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Single Handle (Uncontrolled)</h3>
        <RangeSlider defaultValue={40} />

        <h3>Dual Handle (Uncontrolled)</h3>
        <RangeSlider defaultValue={[20, 80]} />
      </section>
      <hr />
      <h2>{'<Range />'} - with tootlip value</h2>
      <Range />
      <p>{'showTooltip={false}'}</p>
      <Range showTooltip={false} />
      <hr />
      <h2>{'<Progress />'}</h2>
      {/* 1. Basic Progress Bar */}
      <section>
        <h4>Basic</h4>
        <Progress value={progressVal} />
        <br />
        <p>No transition</p>
        <Progress value={progressVal} transition={false} />
        <br />
        <RangeSlider value={progressVal} onChange={setProgressVal} />
      </section>
      {/* 2. Custom Height & Labels */}
      <section>
        <h4>With Label & Custom Height</h4>
        <Progress value={75} height="1.5rem" label="75%" variant="success" />
      </section>
      {/* 3. Striped & Animated */}
      <section>
        <h4>Animated Striped Progress</h4>
        <Progress value={60} variant="warning" striped animated label="60%" />
      </section>
      {/* 4. Multiple / Stacked Progress Bars */}
      {/* <section>
        <h4>Stacked Progress Bars</h4>
        <Progress
          height="1.25rem"
          stacked={[
            { value: 15, variant: 'primary', label: '15%' },
            { value: 30, variant: 'success', label: '30%', striped: true },
            { value: 20, variant: 'danger', label: '20%' },
          ]}
        />
      </section> */}
      <hr />
      <h2>{'<Accordion />'}</h2>
      <Accordion
        name="accordion-1"
        items={[
          {
            id: 1,
            title: 'Accordion 1',
            children: (
              <div>
                <p>Accordion content 1</p>
              </div>
            ),
          },
          {
            id: 2,
            title: 'Accordion 2',
            children: (
              <div>
                <p>Accordion content 2</p>
              </div>
            ),
          },
        ]}
      />
      <hr />
      <h2>{'<Collapse />'}</h2>
      <Collapse title="Collapse 1">
        <p>Collapse content 1</p>
      </Collapse>
      <Collapse title="Collapse 2">
        <p>Collapse content 2</p>
      </Collapse>
      <hr />
      <h2>{'<Tabs />'}</h2>
      <Tabs
        items={[
          {
            id: 1,
            label: 'Tab 1',
            content: (
              <div>
                <p>Tab content 1</p>
              </div>
            ),
          },
          {
            id: 2,
            label: 'Tab 2',
            content: (
              <div>
                <p>Tab content 2</p>
              </div>
            ),
          },
        ]}
      />
      <hr />
      <h2>{'<Carousel />'}</h2>
      <Carousel items={slides} />
      <br />
      <h3>autoPlay: true</h3>
      <Carousel autoPlay items={slides} />
      {/* <br />
      <h3>autoPlay: true, showProgress: true</h3>
      <Carousel autoPlay showProgress items={slides} /> */}
      <hr />
      <Modal
        open={openModal}
        // keyboard={false}
        // backdrop={false} // false | "lock"
        onOpen={handleModalOpened}
        onClose={handleClose}
        id="user-settings-modal"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        data-testid="settings-modal"
      >
        <Button
          outline
          kind="error"
          // className="x"
          title="❌ Close"
          aria-label="Close"
          onClick={handleClose}
        >
          ✕
        </Button>
        <h2 id="modal-title">UserSettings</h2>
        <p id="modal-description">
          This modal now supports native HTML attributes like aria accessibility
          props, custom IDs, data attributes, and fires the <code>onOpen</code>{' '}
          event.
        </p>
        <input autoFocus />
      </Modal>
    </div>
  );
}

const BasicDrawerDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Shopping Cart</Button>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Your Cart (2 items)"
        footer={
          <>
            <Button kind="info" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </Button>
            <Button
              kind="success"
              onClick={() => alert('Proceeding to checkout!')}
            >
              Checkout ($149.00)
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}
          >
            <strong>Wireless Headphones</strong>
            <p style={{ margin: 0, color: '#666' }}>Qty: 1 — $99.00</p>
          </div>
          <div
            style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}
          >
            <strong>Ergonomic Mouse Pad</strong>
            <p style={{ margin: 0, color: '#666' }}>Qty: 1 — $50.00</p>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

const NavigationDrawerDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button outline onClick={() => setIsOpen(true)}>
        ☰ Open Menu
      </Button>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        position="end"
        title="Application Navigation"
      >
        <nav>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <li>
              <a
                href="#dashboard"
                style={{
                  textDecoration: 'none',
                  color: '#0d6efd',
                  fontWeight: 600,
                }}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#analytics"
                style={{ textDecoration: 'none', color: '#333' }}
              >
                Analytics
              </a>
            </li>
            <li>
              <a
                href="#settings"
                style={{ textDecoration: 'none', color: '#333' }}
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#profile"
                style={{ textDecoration: 'none', color: '#333' }}
              >
                Profile
              </a>
            </li>
          </ul>
        </nav>
      </Drawer>
    </div>
  );
};

const BottomSheetDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button kind="error" onClick={() => setIsOpen(true)}>
        Share Options
      </Button>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        position="bottom"
        title="Share this article"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            textAlign: 'center',
          }}
        >
          <Button kind="outline-primary" onClick={() => setIsOpen(false)}>
            Copy Link
          </Button>
          <Button kind="outline-primary" onClick={() => setIsOpen(false)}>
            Email
          </Button>
          <Button kind="outline-primary" onClick={() => setIsOpen(false)}>
            Twitter / X
          </Button>
          <Button kind="outline-primary" onClick={() => setIsOpen(false)}>
            LinkedIn
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

const CustomHeaderDrawerDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button kind="warn" onClick={() => setIsOpen(true)}>
        View Unsaved Changes
      </Button>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnBackdropClick={false} // User must explicitly accept or cancel
        header={
          <div
            style={{
              padding: '1rem 1.25rem',
              background: '#fff3cd',
              borderBottom: '1px solid #ffe69c',
              color: '#664d03',
            }}
          >
            <h5 style={{ margin: 0 }}>⚠️ Warning: Unsaved Form Data</h5>
          </div>
        }
        footer={
          <>
            <Button kind="info" onClick={() => setIsOpen(false)}>
              Discard
            </Button>
            <Button kind="primary" onClick={() => setIsOpen(false)}>
              Save & Exit
            </Button>
          </>
        }
      >
        <p>
          You have pending modifications in your current session. Do you want to
          save before leaving?
        </p>
      </Drawer>
    </div>
  );
};

const MaxCountExample = () => {
  return (
    <Combobox
      options={[
        { value: 'gold', label: 'Gold' },
        { value: 'cyan', label: 'Cyan' },
        { value: 'magenta', label: 'Magenta' },
        { value: 'lime', label: 'Lime' },
      ]}
      multiple
      max={2}
      defaultValue={['gold']}
      placeholder="Select up to 2 items..."
      onChange={(value) => console.log('Selected:', value)}
    />
  );
};

const CustomLabelExample = () => {
  const countryOptions = [
    { value: 'china', label: 'China', icon: '🇨🇳', desc: 'Beijing' },
    { value: 'usa', label: 'USA', icon: '🇺🇸', desc: 'Washington, D.C.' },
    { value: 'japan', label: 'Japan', icon: '🇯🇵', desc: 'Tokyo' },
  ];
  return (
    <Combobox
      options={countryOptions}
      defaultValue="china"
      placeholder="Select country..."
      // Render custom label inside the trigger input when closed
      renderLabel={(option) => (
        <span
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>{option.icon}</span>
          <span>{option.label}</span>
        </span>
      )}
      // Render custom dropdown items
      renderOption={(option) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{option.icon}</span>
          <span>
            {option.label} ({option.desc})
          </span>
        </div>
      )}
    />
  );
};

const ComboboxMultiFieldSearch = () => {
  return (
    <Combobox
      options={[
        { value: 'apple', label: 'Apple', color: 'red' },
        { value: 'melon', label: 'Melon', color: 'green' },
        { value: 'orange', label: 'Orange', color: 'orange' },
      ]}
      filterKeys={['label', 'color']}
      renderOption={(option) => (
        <>
          {option.label}
          <div>Color: {option.color}</div>
        </>
      )}
      placeholder="Select fruit..."
    />
  );
};

interface DummyPhoto {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const VirtualizedDummyDataExample = () => {
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState<string | string[]>([]);

  useEffect(() => {
    const fetchLargeDataset = async () => {
      try {
        setLoading(true);
        // JSONPlaceholder returns 5,000 photo records
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/photos'
        );
        const data: DummyPhoto[] = await response.json();

        // Transform data into options format
        const formattedOptions: ComboboxOption[] = data.map((item) => ({
          ...item,
          value: String(item.id),
          label: `#${item.id} - ${item.title}`,
          // thumbnail: item.thumbnailUrl,
        }));

        setOptions(formattedOptions);
      } catch (err) {
        console.error('Failed to load dummy photos', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLargeDataset();
  }, []);

  return (
    <>
      <h5 style={{ marginBottom: 6 }}>
        Select Photo (5,000 Items Virtualized)
      </h5>
      <Combobox
        options={options}
        value={selectedValue}
        onChange={setSelectedValue} // (val) => setSelectedValue(val)
        placeholder={
          loading ? 'Fetching 5,000 photos...' : 'Search photo title or ID...'
        }
        disabled={loading}
        // Enable virtualizer for smooth 60fps scrolling across 5,000 items
        virtual={true}
        itemHeight={36}
        multiple
        canClear
      />
    </>
  );
};

export default App;
