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

## Multi-framework roadmap (planning only, NOT implemented yet)

- [ ] Vue 3 wrapper (SFC + composables) consuming the same `q-*` CSS layer.
- [ ] Svelte 5 wrapper (runes) consuming the same `q-*` CSS layer.
- [ ] Angular wrapper (standalone components + signals) consuming the same `q-*` CSS layer.
- Each framework version re-uses `src/styles/q.css` verbatim; only the component
  implementation changes. No per-framework copy of styles.
- Refine core stays the shared headless auth/base primitive across frameworks.
