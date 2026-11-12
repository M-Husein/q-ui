import { useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { demoRoutes } from '../pages/routes';

const DRAWER_ID = 'q-app-drawer';
const DESKTOP_QUERY = '(min-width: 1024px)';

/*
 * DaisyUI "responsive collapsible icon-only drawer sidebar" pattern:
 * - lg and up: `lg:drawer-open` keeps the sidebar visible. The checkbox still
 *   controls the expanded (checked) / icon-rail (unchecked) state.
 * - below lg: the sidebar is an overlay drawer, closed by default.
 * The checkbox is `inline` so it is not hidden by `drawer-open`.
 *
 * Renders as a react-router layout route: child pages render in <Outlet />.
 */
export const AppLayout = () => {
  const toggleRef = useRef<HTMLInputElement>(null);
  // Desktop starts expanded, tablet/mobile starts with the overlay closed.
  const startExpanded = typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;

  // Close the overlay after navigating on small screens only.
  const closeOverlayOnSmall = () => {
    if (!window.matchMedia(DESKTOP_QUERY).matches && toggleRef.current) {
      toggleRef.current.checked = false;
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id={DRAWER_ID}
        ref={toggleRef}
        type="checkbox"
        className="drawer-toggle inline"
        defaultChecked={startExpanded}
      />

      <div className="drawer-content flex min-h-screen min-w-0 flex-col">
        <nav className="navbar sticky top-0 z-10 w-full bg-base-300">
          <label
            htmlFor={DRAWER_ID}
            aria-label="toggle sidebar"
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

        <main className="q-app w-full">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor={DRAWER_ID} aria-label="close sidebar" className="drawer-overlay" />
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">
            <li className="menu-title is-drawer-close:hidden">Components</li>
            {demoRoutes.map((r) => (
              <li key={r.path}>
                <NavLink
                  to={r.path}
                  onClick={closeOverlayOnSmall}
                  data-tip={r.label}
                  className={({ isActive }) =>
                    `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? 'menu-active' : ''}`
                  }
                >
                  <span className="inline-flex size-4 items-center justify-center text-xs font-bold">{r.short}</span>
                  <span className="is-drawer-close:hidden">{r.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
