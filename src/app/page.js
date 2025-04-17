'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("/projectJSONs.json")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    if (!query) {
      setFiltered(projects);
    } else {
      const lower = query.toLowerCase();
      const results = projects.filter((p) =>
        p.description?.toLowerCase().includes(lower)
      );
      setFiltered(results);
    }
  }, [query, projects]);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search project descriptions..."
        className="w-full p-2 border rounded mb-4"
      />
      <div className="space-y-4">
        {filtered.map((project, i) => (
          <div key={i} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{project.project_name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}
