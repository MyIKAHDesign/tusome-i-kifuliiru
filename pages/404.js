import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="container">
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f8f9fa;
          text-align: center;
        }

        .error-title {
          font-size: 4rem;
          color: #dc3545; /* Bootstrap danger color */
          margin-bottom: 20px;
        }

        .error-message {
          font-size: 1.5rem;
          color: #6c757d; /* Bootstrap muted color */
          margin-bottom: 30px;
        }

        .home-button {
          padding: 10px 20px;
          font-size: 1.2rem;
          color: white;
          background-color: #007bff; /* Bootstrap primary color */
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .home-button:hover {
          background-color: #0056b3; /* Darker shade on hover */
        }
      `}</style>
      <h1 className="error-title">404.</h1>
      <p className="error-message">
        Ngisi biindu ushuba mulooza ndabyo twaloonga. Haliko bigaba
        bikahamikizibwa mu kindi kibaaja, looza kandi li uhinduule ku
        ndondeero. Kongwa.
      </p>
      <Link href="/index">
        <button className="home-button">Hinduula ku ndondeero</button>
      </Link>
    </div>
  );
}
