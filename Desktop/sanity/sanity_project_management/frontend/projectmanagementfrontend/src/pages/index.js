import { useState } from "react";
import { Inter } from "next/font/google";
import HomeComponent from "../components/HomeComponent";

import { client } from "../../lib/client";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ project }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = "fcbe10c2-6d49-4b79-8285-c45cfe331309";

  const createProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/createProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Project7", // Adjust based on your needs
          description: "Project description7", // Example field
          createdby: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Project created:", data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <HomeComponent />
      <button onClick={createProject} disabled={loading}>
        {loading ? "Creating..." : "Create project"}
      </button>
      {error && <p>Error: {error}</p>}
    </main>
  );
}

export const getServerSideProps = async () => {
  const query = '*[_type=="project"]';
  const project = await client.fetch(query);
  return {
    props: { project },
  };
};
