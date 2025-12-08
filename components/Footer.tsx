import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #e5e7eb',
        padding: '2rem',
        backgroundColor: '#f9fafb',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.875rem',
        }}
      >
        <div style={{ marginBottom: '0.5rem' }}>
          <span>
            Tusome i Kifuliiru {new Date().getFullYear()} ©{' '}
            <a
              href="https://kifuliiru.net/"
              style={{ color: '#2563eb', textDecoration: 'none' }}
            >
              Tumenye Ibufuliiru
            </a>
          </span>
        </div>
        <div>
          <a
            href="https://ayivugwekabemba.me"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', textDecoration: 'none' }}
          >
            By Ayivugwe Kabemba Mukome
          </a>
        </div>
      </div>
    </footer>
  );
}

