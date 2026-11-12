import React, { useState, useId } from 'react';

export interface TabItem {
  id: string | number;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  openTab?: string | number; // defaultTabId
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  openTab,
  className = '',
}) => {
  const baseId = useId();
  const [activeTabId, setActiveTabId] = useState<string | number>(
    openTab || items[0]?.id || ''
  );

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = items[nextIndex];
    if (nextTab) {
      setActiveTabId(nextTab.id);
      const nextButton = document.getElementById(`${baseId}-tab-${nextTab.id}`);
      nextButton?.focus();
    }
  };

  return (
    <div className={`tabs-container ${className}`.trim()}>
      <div role="tablist" className="tabs-list" aria-label="Tabs">
        {items.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`tab-trigger ${isActive ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {items.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            id={`${baseId}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            hidden={!isActive}
            tabIndex={0}
            className="tab-panel"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};
