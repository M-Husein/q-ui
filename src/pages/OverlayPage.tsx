import { useState } from 'react';
import { Button, Popover, Toast, Tooltip } from '../index';
import type { ToastPosition } from '../index';
import { PageHeader, Section } from '../layout/demo';

export const OverlayPage = () => {
  const [showToast, setShowToast] = useState(false);
  const [position, setPosition] = useState<ToastPosition>('bottomLeft');
  const triggerToast = (pos: ToastPosition) => {
    setPosition(pos);
    setShowToast(true);
  };
  return (
    <>
      <PageHeader title="Popover, Tooltip & Toast" description="Native Popover API with CSS anchor positioning." />
      <Section title="Popover & Tooltip">
        <div className="q-row">
          <Popover trigger={<Button>Open Popover</Button>}>
            <h3>Account Settings</h3>
            <p>Kelola preferensi overlay.</p>
          </Popover>
          <Tooltip content="Menyimpan perubahan ke database">
            <Button>Hover Me</Button>
          </Tooltip>
        </div>
      </Section>
      <Section title="Toast">
        <div className="q-row">
          <Button onClick={() => triggerToast('bottomLeft')}>Toast Bottom Left</Button>
          <Button onClick={() => triggerToast('topRight')}>Toast Top Right</Button>
        </div>
        <Toast open={showToast} onClose={() => setShowToast(false)} position={position} duration={3000}>
          Notifikasi di posisi: <strong>{position}</strong>
        </Toast>
      </Section>
    </>
  );
};
