"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import venues from "@/venues.json";
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


  useEffect(() => {
    if (!query) {
      setFiltered(projects);
    } else {
      const lower = query.toLowerCase();
      const results = projects.filter((p) =>
        p.description?.toLowerCase().includes(lower),
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
        className="w-full p-2 border border-neutral-300 focus:outline-violet-500 rounded mb-4"
      />
      <div className="space-y-4">
        {filtered.map((project) => (
          <Link
            key={project.project_id}
            href={`/projects/${project.project_id}`}
            className="border border-neutral-200 p-4 rounded-md shadow hover:border-violet-300 transition-colors flex flex-col"
          >

        onChange={handleSearch}
        placeholder="Search project names, creators, descriptions..."
        className="w-full p-2 border rounded mb-4"
      />
      <div className="space-y-4">
        {results.map((project, i) => (
          <div key={i} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{project.project_name}</h2>
            <p className="text-sm text-neutral-500">
              {venues[project.venue_id]}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
