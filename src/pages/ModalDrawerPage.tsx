import { useState } from 'react';
import { Button, Drawer, Input, Modal } from '../index';
import { PageHeader, Section } from '../layout/demo';

const toggleInert = (isInert: boolean) => {
  const root = document.getElementById('root') as HTMLDivElement | null;
  if (root) isInert ? root.setAttribute('inert', '') : root.removeAttribute('inert');
};

export const ModalDrawerPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
    toggleInert(false);
  };
  return (
    <>
      <PageHeader title="Modal & Drawer" description="Native <dialog> based modal and drawer." />
      <Section title="Modal">
        <Button onClick={() => { setOpenModal(true); toggleInert(true); }}>Open Modal</Button>
        <Modal open={openModal} onClose={handleClose} aria-labelledby="q-modal-title">
          <h2 id="q-modal-title">User Settings</h2>
          <p>Modal berbasis native &lt;dialog&gt; dengan backdrop.</p>
          <Input placeholder="Nama" autoFocus />
        </Modal>
      </Section>
      <Section title="Drawer">
        <div className="q-row">
          <Button onClick={() => setOpenStart(true)}>Open Start Drawer</Button>
          <Button outline onClick={() => setOpenEnd(true)}>Open End Drawer</Button>
        </div>
        <Drawer open={openStart} onClose={() => setOpenStart(false)} title="Your Cart" footer={<Button kind="success" onClick={() => setOpenStart(false)}>Checkout</Button>}>
          <p>Item 1 — $99.00</p>
        </Drawer>
        <Drawer open={openEnd} onClose={() => setOpenEnd(false)} position="end" title="Navigation">
          <p>Dashboard</p>
          <p>Settings</p>
        </Drawer>
      </Section>
    </>
  );
};
