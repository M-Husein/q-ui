import React from 'react';

export interface AccordionItemProps {
  id?: string | number;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  /** Sharing a name enables single-expand behavior across details items */
  name?: string;
  items: AccordionItemProps[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  name,
  items,
  className = '',
}) => {
  return (
    <div className={`accordion-container ${className}`.trim()}>
      {items.map((item, index) => (
        <details
          key={item.id ?? index}
          name={name}
          open={item.defaultOpen}
          className="accordion-item"
        >
          <summary className="accordion-summary">
            {item.title}
            <span className="accordion-icon" aria-hidden="true" />
          </summary>
          <div className="accordion-content">{item.children}</div>
        </details>
      ))}
    </div>
  );
};
