import React from 'react';

export interface AccordionItemProps {
  id?: string | number;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  name?: string;
  items: AccordionItemProps[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  name,
  items,
  className = '',
}) => (
  <div className={className}>
    {items.map((item, index) => (
      <details
        key={item.id ?? index}
        name={name}
        open={item.defaultOpen}
        className="q-accordion"
      >
        <summary>{item.title}</summary>
        <div className="q-accordion-body">{item.children}</div>
      </details>
    ))}
  </div>
);

export interface CollapseProps
  extends Omit<React.ComponentPropsWithoutRef<'details'>, 'title'> {
  title: React.ReactNode;
  children: React.ReactNode;
}

export const Collapse: React.FC<CollapseProps> = ({
  title,
  children,
  className = '',
  ...restProps
}) => (
  <details className={`q-collapse ${className}`.trim()} {...restProps}>
    <summary>{title}</summary>
    <div className="q-collapse-body">{children}</div>
  </details>
);
