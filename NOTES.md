## References, Resources, etc

1. https://daisyui.com
2. https://ant.design
3. https://mantine.dev
4. https://getbootstrap.com
5. https://astryx.atmeta.com
6. https://tailwindcss.com
7. https://vite.dev

## Architecture (framework-agnostic)

- `src/styles/q.css` is the framework-agnostic style layer. All components consume
  `q-*` classes that map to DaisyUI theme CSS variables, so dark mode and theming
  work without any JS framework.
- React is only one wrapper layer. The CSS layer must stay reusable by Vue/Svelte/Angular.
- Stack is fixed: Vite + TypeScript + React 19 + Refine core (headless, auth/base only) + Bun.

## Component -> DaisyUI mapping (authoritative)

Use DaisyUI's own classes whenever a component exists there. Only build custom
`q-*` CSS for things DaisyUI lacks. Browser APIs are preferred over JS libs;
fallbacks are minimal.

| Component        | Class(es) used                 | Source            |
|------------------|-------------------------------|-------------------|
| Button           | `btn btn-<color> btn-outline btn-sm/lg` (color = DaisyUI name: primary/success/error/warning/info/ghost/link) | DaisyUI     |
| Input            | `input`                       | DaisyUI           |
| Textarea         | `textarea` (+ `field-sizing` autosize; `q-textarea-autosize-wrapper` fallback) | DaisyUI + Browser API |
| Checkbox         | `checkbox` (+ `:indeterminate` fallback) | DaisyUI + Browser API |
| Radio            | `radio`                       | DaisyUI           |
| Select           | `select` (+ `q-select-wrap`/`q-select-clear`) | DaisyUI + custom |
| SelectNative     | `input`/`select` + `q-combobox-*` trigger/popover | DaisyUI + custom |
| Range            | `range` + `q-range-container`/`q-range-tip` tooltip | DaisyUI + custom |
| Progress         | `progress` + `progress-<color>` (+ `q-striped`/`q-animated`) | DaisyUI + custom |
| Tabs             | `tabs tabs-bordered`/`tab`/`tab-content` | DaisyUI     |
| Accordion        | `collapse collapse-arrow`      | DaisyUI           |
| Collapse         | `collapse collapse-arrow`      | DaisyUI           |
| Carousel         | `carousel rounded-box`/`carousel-item` (+ `q-carousel-*` controls) | DaisyUI + custom |
| Modal            | `modal`/`modal-box` (native `<dialog>`) | DaisyUI + Browser API |
| Drawer           | `q-drawer`/`q-drawer-*` (native `<dialog>`, DaisyUI `drawer` is checkbox-based) | custom |
| Popover          | native Popover API + Anchor Positioning (`@supports`); `q-popover` | Browser API + custom |
| Tooltip          | native Popover API (`popover=hint`); `q-tooltip` | Browser API + custom |
| Toast            | native Popover API (`popover=manual`); `q-toast` | Browser API + custom |
| Combobox         | `q-combobox-*` (DaisyUI has none) | custom          |
| RangeSlider      | `q-slider`/`q-slider-*`, dual `<input type=range>` (DaisyUI has none) | custom |

### Browser APIs in use
- `<dialog>` top layer: Modal, Drawer
- Popover API: Popover, Tooltip, Toast (with `q-no-popover-api` data-attr fallback)
- CSS Anchor Positioning: Popover/Tooltip positioning (`@supports (anchor-name: ...)`)
- `field-sizing: content`: Textarea autosize (grid `::after` wrapper fallback)
- `:indeterminate`: Checkbox (gradient fill fallback)


- [ ] Vue 3 wrapper (SFC + composables) consuming the same `q-*` CSS layer.
- [ ] Svelte 5 wrapper (runes) consuming the same `q-*` CSS layer.
- [ ] Angular wrapper (standalone components + signals) consuming the same `q-*` CSS layer.
- Each framework version re-uses `src/styles/q.css` verbatim; only the component
  implementation changes. No per-framework copy of styles.
- Refine core stays the shared headless auth/base primitive across frameworks.
