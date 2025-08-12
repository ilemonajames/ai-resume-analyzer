import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { resumes } from "constants/index";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumelyzer" },
    { name: "description", content: "Smart Feedback for your dream job!" },
  ];
}

export default function Home() {
  const {auth} = usePuterStore();
  const  navigate = useNavigate();

  useEffect(() => {
          if(!auth.isAuthenticated) navigate("/auth?next=/");
      }, [auth.isAuthenticated])

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
          <div className="page-heading py-16">
          <h1>Track Your Application & Resume Ratings</h1>
          <h2>Review your submission and check feedback with AI-powered solutions</h2>
        </div>
      

    {Array.isArray(resumes) && resumes.length > 0 && (
  <div className="resumes-section">
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
