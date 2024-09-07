import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <h1>
        404.
      </h1>
      <p>
        Ngisi biindu ushuba mulooza ndabyo twaloonga. Haliko bigaba
        bikahamikizibwa mu kindi kibaaja, looza kandi li uhinduule ku
        ndondeero. Kongwa.
      </p>
      <Link href="/index">
        <button>
          Hinduula ku ndondeero
        </button>
      </Link>
    </>
  );
}
