import React from "react";
import {
  Search,
  Home,
  AlertCircle,
  MoveLeft,
  ChevronRight,
} from "lucide-react";

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
          <AlertCircle size={64} className="error-icon" />
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
            <Home size={20} className="icon icon-left" />
            <span>Hindula ku ndondeero</span>
            <ChevronRight size={20} className="icon icon-right" />
          </a>

          <a href="/search" className="button button-secondary">
            <Search size={20} className="icon" />
            <span>Looza hano</span>
          </a>
        </div>

        <a href="/" className="back-link fade-in">
          <MoveLeft size={20} className="icon icon-left" />
          <span>Garuka inyuma</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound404;
