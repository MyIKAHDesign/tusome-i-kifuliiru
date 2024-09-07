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
      <button onClick={() => window.location.href = './index'}>
        Hinduula ku ndondeero
      </button>
    </>
  );
}
