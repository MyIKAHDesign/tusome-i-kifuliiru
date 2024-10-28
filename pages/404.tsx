import React from "react";

// SVG Icons as components
const AlertIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const NotFound404 = () => {
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .container-404 {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background-color: #fff;
        color: #111827;
        transition: background-color 0.2s, color 0.2s;
      }

      .content-wrapper {
        max-width: 42rem;
        width: 100%;
        text-align: center;
      }

      .error-container {
        position: relative;
        height: 12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 3rem;
      }

      .error-number {
        font-size: 8rem;
        font-weight: bold;
        color: #2563eb;
      }

      .error-icon {
        position: absolute;
        top: -0.5rem;
        left: 50%;
        transform: translateX(-50%);
        color: #ef4444;
        animation: bounce 1s infinite;
        width: 64px;
        height: 64px;
      }

      .main-heading {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 1rem 0;
        padding: 0 1rem;
      }

      .support-text {
        color: #4b5563;
        margin-bottom: 2rem;
        padding: 0 1rem;
        font-size: 1rem;
      }

      .buttons-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        padding: 0 1rem;
      }

      .button {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        text-decoration: none;
        transition: all 0.2s;
        font-size: 1rem;
      }

      .button svg {
        width: 20px;
        height: 20px;
      }

      .button-primary {
        background-color: #2563eb;
        color: white;
      }

      .button-primary:hover {
        background-color: #1d4ed8;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .button-secondary {
        background-color: #e5e7eb;
        color: #111827;
      }

      .button-secondary:hover {
        background-color: #d1d5db;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #2563eb;
        text-decoration: none;
        margin-top: 2rem;
        font-size: 1rem;
      }

      .back-link svg {
        width: 20px;
        height: 20px;
      }

      .back-link:hover {
        color: #1d4ed8;
      }

      .icon {
        transition: transform 0.2s;
      }

      .button-primary:hover .icon-right {
        transform: translateX(4px);
      }

      .button-primary:hover .icon-left {
        transform: translateX(-4px);
      }

      .back-link:hover .icon-left {
        transform: translateX(-4px);
      }

      @keyframes bounce {
        0%, 100% {
          transform: translateY(0) translateX(-50%);
        }
        50% {
          transform: translateY(-10px) translateX(-50%);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }

      @media (prefers-color-scheme: dark) {
        .container-404 {
          background-color: #111827;
          color: white;
        }

        .support-text {
          color: #9ca3af;
        }

        .button-secondary {
          background-color: #374151;
          color: white;
        }

        .button-secondary:hover {
          background-color: #4b5563;
        }
      }

      @media (min-width: 640px) {
        .buttons-container {
          flex-direction: row;
        }

        .error-number {
          font-size: 9rem;
        }

        .main-heading {
          font-size: 2rem;
        }
      }

      @media (max-width: 640px) {
        .error-container {
          height: 8rem;
        }

        .error-number {
          font-size: 6rem;
        }

        .main-heading {
          font-size: 1.25rem;
        }

        .error-icon {
          width: 48px;
          height: 48px;
        }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="container-404">
      <div className="content-wrapper">
        <div className="error-container">
          <h1 className="error-number">404</h1>
          <div className="error-icon">
            <AlertIcon />
          </div>
        </div>

        <h2 className="main-heading fade-in">
          Ngisi biindu ushuba mulooza ndabyo twaloonga
        </h2>

        <p className="support-text fade-in">
          Haliko bigaba bikahamikizibwa mu kindi kibaaja, looza kandi li
          uhinduule ku ndondeero
        </p>

        <div className="buttons-container fade-in">
          <a href="/" className="button button-primary">
            <span className="icon icon-left">
              <HomeIcon />
            </span>
            <span>Hindula ku ndondeero</span>
            <span className="icon icon-right">
              <ChevronRightIcon />
            </span>
          </a>

          <a href="/search" className="button button-secondary">
            <span className="icon">
              <SearchIcon />
            </span>
            <span>Looza hano</span>
          </a>
        </div>

        <a href="/" className="back-link fade-in">
          <span className="icon icon-left">
            <ArrowLeftIcon />
          </span>
          <span>Garuka inyuma</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound404;
