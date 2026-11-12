import { createContext, useContext } from 'react';
import type { QUser } from './authTypes';

export interface QAuthContextValue {
  user: QUser | null;
  isLoading: boolean;
}

const QAuthContext = createContext<QAuthContextValue>({ user: null, isLoading: false });

export const useQAuth = () => useContext(QAuthContext);
