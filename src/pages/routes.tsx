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
  /** URL path, e.g. `/button`. */
  path: string;
  label: string;
  /** Two-letter glyph shown in the collapsed (icon-only) sidebar. */
  short: string;
  component: ComponentType;
}

export const demoRoutes: DemoRoute[] = [
  { path: '/accordion', label: 'Accordion', short: 'Ac', component: AccordionPage },
  { path: '/button', label: 'Button', short: 'Bt', component: ButtonPage },
  { path: '/carousel', label: 'Carousel', short: 'Ca', component: CarouselPage },
  { path: '/checkbox', label: 'Checkbox & Radio', short: 'Ch', component: CheckboxPage },
  { path: '/collapse', label: 'Collapse', short: 'Co', component: CollapsePage },
  { path: '/combobox', label: 'Combobox', short: 'Cb', component: ComboboxPage },
  { path: '/input', label: 'Input & Textarea', short: 'In', component: InputPage },
  { path: '/modal-drawer', label: 'Modal & Drawer', short: 'Md', component: ModalDrawerPage },
  { path: '/overlay', label: 'Popover, Tooltip & Toast', short: 'Po', component: OverlayPage },
  { path: '/progress', label: 'Progress', short: 'Pr', component: ProgressPage },
  { path: '/range', label: 'Range & Slider', short: 'Rg', component: RangePage },
  { path: '/select', label: 'Select', short: 'Se', component: SelectPage },
  { path: '/tabs', label: 'Tabs', short: 'Tb', component: TabsPage },
];

export const DEFAULT_PATH = demoRoutes[1].path; // /button
