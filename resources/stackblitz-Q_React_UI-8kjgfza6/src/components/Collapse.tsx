import React from 'react';

export interface CollapseProps
  extends React.ComponentPropsWithoutRef<'details'> {
  title: React.ReactNode;
  children: React.ReactNode;
}

export const Collapse: React.FC<CollapseProps> = ({
  title,
  children,
  className = '',
  ...restProps
}) => {
  return (
    <details className={`collapse-item ${className}`.trim()} {...restProps}>
      <summary className="collapse-summary">
        {title}
        <span className="collapse-icon" aria-hidden="true" />
      </summary>
      <div className="collapse-content">{children}</div>
    </details>
  );
};
