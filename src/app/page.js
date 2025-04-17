"use client";

import { useEffect, useState } from "react";
import { useFuse } from "./use-fuse";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const { results, handleSearch, query, isPending } = useFuse({
    data: projects,
    options: {
      keys: [
        "project_name",
        "description",
        "keywords",
        "elevator_pitch",
        "classes.class_name",
        "users.user_name",
      ],
      threshold: 0.2,
    },
  });

  useEffect(() => {
    fetch("/projectJSONs.json")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });
  }, []);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Search</h1>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search project names, creators, descriptions..."
        className="w-full p-2 border rounded mb-4"
      />
      <div className="space-y-4">
        {results.map((project, i) => (
          <div key={i} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{project.project_name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}
