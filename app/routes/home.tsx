import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumer" },
    { name: "description", content: "Smart Feedback for your dream job" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <section className="main-section">
      <div className="page-header">
        <h1>Track Your Application & Resume Ratings</h1>
        <h2>Review your submission and check feedback with AI-powered solutions</h2>

      </div>
    </section>

  </main>
}
