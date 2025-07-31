import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { resumes } from "constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumelyzer" },
    { name: "description", content: "Smart Feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
          <div className="page-heading py-16">
          <h1>Track Your Application & Resume Ratings</h1>
          <h2>Review your submission and check feedback with AI-powered solutions</h2>
        </div>
      

    {Array.isArray(resumes) && resumes.length > 0 && (
  <div className="resume-section">
    {resumes.map((resume) => (
      <div key={resume.id}>
        <ResumeCard resume={resume} />
      </div>
    ))}
  </div>
)}
</section>

    </main>
  );
}
