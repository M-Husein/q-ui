import React from 'react';
import {
  Authenticated,
  type Refine,
} from '@refinedev/core';

export interface QUIProviderProps {
  children: React.ReactNode;
}

/**
 * Thin wrapper that exposes Refine's headless core for Q UI.
 * It does NOT render any router, data table, or UI; it only provides
 * auth/state context so Q UI components and hooks (useQAuth, Authenticated)
 * can consume Refine primitives.
 */
export const QUIProvider: React.FC<QUIProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export { Authenticated };
export type { Refine };
