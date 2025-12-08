import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <p className="footer-text">
              Tusome i Kifuliiru {new Date().getFullYear()} ©{' '}
              <a href="https://kifuliiru.net/" className="footer-link">
                Tumenye Ibufuliiru
              </a>
            </p>
          </div>
          <div className="footer-section">
            <a
              href="https://ayivugwekabemba.me"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              By Ayivugwe Kabemba Mukome
            </a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .site-footer {
          border-top: 1px solid var(--color-border);
          background: linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg) 100%);
          margin-top: auto;
          padding: var(--spacing-8) 0;
        }

        .footer-container {
          max-width: var(--content-max-width);
          margin: 0 auto;
          padding: 0 var(--spacing-6);
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          align-items: center;
          text-align: center;
        }

        .footer-section {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
        }

        .footer-text {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .footer-link {
          color: var(--color-primary);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          transition: all var(--transition-base);
          border-bottom: 1px solid transparent;
          padding-bottom: 1px;
        }

        .footer-link:hover {
          color: var(--color-primary-dark);
          border-bottom-color: var(--color-primary);
        }

        @media (min-width: 640px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        @media (max-width: 640px) {
          .footer-container {
            padding: 0 var(--spacing-4);
          }

          .footer-content {
            gap: var(--spacing-2);
          }
        }
      `}</style>
    </footer>
  );
}
