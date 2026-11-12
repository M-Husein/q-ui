import React from 'react';

export const PageHeader = ({ title, description }: { title: string; description?: string }) => (
  <header className="q-section">
    <h1 className="text-3xl font-extrabold">{title}</h1>
    {description && <p className="q-muted">{description}</p>}
  </header>
);

export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="q-section">
    <h2>{title}</h2>
    {children}
  </section>
);
