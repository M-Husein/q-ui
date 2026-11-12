import React, { useState, useId } from 'react';

export interface TabItem {
  id: string | number;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  openTab?: string | number;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, openTab, className = '' }) => {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | number>(
    openTab ?? items[0]?.id ?? ''
  );

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (e.key === 'ArrowLeft')
      next = (index - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else return;
    e.preventDefault();
    const tab = items[next];
    if (tab) {
      setActiveId(tab.id);
      document.getElementById(`${baseId}-tab-${tab.id}`)?.focus();
    }
  };

  return (
    <div className={className}>
      <div role="tablist" className="tabs tabs-bordered" aria-label="Tabs">
        {items.map((tab, index) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`tab ${isActive ? 'tab-active' : ''}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <div
            key={tab.id}
            id={`${baseId}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            hidden={!isActive}
            tabIndex={0}
            className="tab-content"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};
