import React, { useRef } from 'react';
import type { DemoRoute } from '../pages/routes';

export interface AppLayoutProps {
  routes: DemoRoute[];
  activeId: string;
  children: React.ReactNode;
}

const DRAWER_ID = 'q-app-drawer';

/* Responsive collapsible icon-only sidebar (DaisyUI drawer, is-drawer-open/close). */
export const AppLayout = ({ routes, activeId, children }: AppLayoutProps) => {
  const toggleRef = useRef<HTMLInputElement>(null);

  const closeMobileDrawer = () => {
    if (toggleRef.current) toggleRef.current.checked = false;
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id={DRAWER_ID} ref={toggleRef} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen min-w-0 flex-col">
        <nav className="navbar sticky top-0 z-10 w-full bg-base-300">
          <label
            htmlFor={DRAWER_ID}
            aria-label="open sidebar"
            className="btn btn-square btn-ghost drawer-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="my-1.5 inline-block size-4">
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
              <path d="M9 4v16" />
              <path d="M14 10l2 2l-2 2" />
            </svg>
          </label>
          <div className="px-4 font-bold">Q UI</div>
        </nav>

        <main className="q-app w-full">{children}</main>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor={DRAWER_ID} aria-label="close sidebar" className="drawer-overlay" />
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">
            <li className="menu-title is-drawer-close:hidden">Components</li>
            {routes.map((r) => (
              <li key={r.id}>
                <a
                  href={`#/${r.id}`}
                  className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${activeId === r.id ? 'menu-active' : ''}`}
                  data-tip={r.label}
                  aria-current={activeId === r.id ? 'page' : undefined}
                  onClick={closeMobileDrawer}
                >
                  <span className="inline-flex size-4 items-center justify-center text-xs font-bold">{r.short}</span>
                  <span className="is-drawer-close:hidden">{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
