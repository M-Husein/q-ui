import type { ComponentType } from 'react';
import { AccordionPage, CollapsePage, TabsPage } from './DisclosurePage';
import { ButtonPage } from './ButtonPage';
import { CarouselPage } from './CarouselPage';
import { CheckboxPage } from './CheckboxPage';
import { ComboboxPage } from './ComboboxPage';
import { InputPage } from './InputPage';
import { ModalDrawerPage } from './ModalDrawerPage';
import { OverlayPage } from './OverlayPage';
import { ProgressPage, RangePage } from './ProgressPage';
import { SelectPage } from './SelectPage';

export interface DemoRoute {
  id: string;
  label: string;
  /** Two-letter glyph shown in the collapsed (icon-only) sidebar. */
  short: string;
  component: ComponentType;
}

export const demoRoutes: DemoRoute[] = [
  { id: 'accordion', label: 'Accordion', short: 'Ac', component: AccordionPage },
  { id: 'button', label: 'Button', short: 'Bt', component: ButtonPage },
  { id: 'carousel', label: 'Carousel', short: 'Ca', component: CarouselPage },
  { id: 'checkbox', label: 'Checkbox & Radio', short: 'Ch', component: CheckboxPage },
  { id: 'collapse', label: 'Collapse', short: 'Co', component: CollapsePage },
  { id: 'combobox', label: 'Combobox', short: 'Cb', component: ComboboxPage },
  { id: 'input', label: 'Input & Textarea', short: 'In', component: InputPage },
  { id: 'modal-drawer', label: 'Modal & Drawer', short: 'Md', component: ModalDrawerPage },
  { id: 'overlay', label: 'Popover, Tooltip & Toast', short: 'Po', component: OverlayPage },
  { id: 'progress', label: 'Progress', short: 'Pr', component: ProgressPage },
  { id: 'range', label: 'Range & Slider', short: 'Rg', component: RangePage },
  { id: 'select', label: 'Select', short: 'Se', component: SelectPage },
  { id: 'tabs', label: 'Tabs', short: 'Tb', component: TabsPage },
];

export const findRoute = (id: string) => demoRoutes.find((r) => r.id === id);
