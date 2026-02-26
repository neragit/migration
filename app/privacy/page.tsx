// app/privacy/page.tsx
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Politika privatnosti",
  description: "Politika privatnosti stranice o migracijama i digitalnim tragovima u Hrvatskoj.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl min-w-0 mx-auto px-5 mt-20 mb-30 text-gray-700   ">
      <h1 className="text-3xl font-bold mb-8">Politika privatnosti</h1>
      <p className="mb-6 text-sm text-gray-600">
        Datum posljednje izmjene: 25. veljače 2026.
      </p>

      <p className="mb-6">
        Kako bi poboljšali iskustvo pregledavanja, uz Vaš pristanak prikupljamo podatke o korištenju ove stranice.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4">1. Koje podatke prikupljamo</h3>
      <ul className="list-disc list-inside mb-6">
        <li>Osobni podaci koje sami dajete (npr. ime i email ako šaljete upit).</li>
        <li>Podaci o korištenju stranice: klikovi, vrijeme provedeno na stranici, pregledani sadržaj.</li>
        <li>Kolačići i alati trećih strana: Hotjar / Contentsquare za analizu korištenja stranice i poboljšanje UX-a.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-8 mb-4">2. Kako koristimo podatke</h3>
      <p className="mb-6">
        Podaci se koriste za praćenje interakcija korisnika, poboljšanje sadržaja i navigacije te razumijevanje kako se informacije koriste. 
        <b> Napomena:</b> ne prikupljamo niti prodajemo osobne podatke trećim stranama za marketing.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4">3. Kolačići i treće strane</h3>
      <p className="mb-6">
        Stranica koristi Hotjar / Contentsquare za snimanje anonimnih podataka o interakciji s webom (scroll, klikovi) te tehničke kolačiće za funkcioniranje stranice. Kolačići se aktiviraju tek nakon što korisnik prihvati u skladu s EU GDPR-om.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4">4. Pohrana i zaštita podataka</h3>
      <p className="mb-6">
        Podaci se pohranjuju sigurno i koriste se isključivo za analitičke i funkcionalne svrhe. Nikada ne dijelimo osobne podatke trećim stranama za marketing.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4">5. Vaša prava</h3>
      <p className="mb-6">
        Korisnici imaju pravo pristupiti svojim podacima, zahtijevati brisanje svojih podataka i odbiti praćenje i analitiku (npr. odbijanjem kolačića). Za ostvarenje prava, kontaktirajte nas putem emaila: <b>info@tvoja-stranica.hr</b>.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4">6. Kontakt</h3>
      <p>
        Ako imate pitanja u vezi privatnosti ili želite uložiti prigovor, kontaktirajte nas na:
        <br/>
        Email: <b>info@tvoja-stranica.hr</b>
      </p>
    </div>
  );
}