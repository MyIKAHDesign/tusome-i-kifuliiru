import Link from 'next/link';
import './styles.css'; // Import your CSS file for styling

export default function Custom404() {
  return (
    <div className="container">
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
