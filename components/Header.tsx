import React from 'react';
import Search from './Search';

export default function Header() {
  return (
    <header
      style={{
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            margin: 0,
          }}
        >
          Tusome i Kifuliiru
        </h1>
        <nav
          style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          <Search />
          <a
            href="/"
            style={{
              color: '#374151',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            Ndondeero
          </a>
        </nav>
      </div>
    </header>
  );
}

