'use client';

import React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import projects from "@/projects.json";
import venues from "@/venues.json";

// Utility: Debounce function
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

// Highlight matching query inside text
function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "ig");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200">{part}</mark>
    ) : (
      part
    )
  );
}

// Returns true if description contains the query
function shouldShowDescription(project, query) {
  if (!query) return false;
  return project.description?.toLowerCase().includes(query.toLowerCase());
}

const DescriptionToggle = React.memo(function DescriptionToggle({ description, query, highlight }) {
  const [isOpen, setIsOpen] = useState(false);

  const renderedDescription = isOpen && query
    ? highlightMatch(description, query)
    : description;

  return (
    <div className="text-sm text-neutral-700">
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
        className={`font-medium hover:underline ${
          highlight ? "text-yellow-600 bg-yellow-100 px-1 rounded" : "text-violet-600"
        }`}
      >
        {isOpen ? "Hide description" : "Show description"}
      </button>
      {isOpen && <p className="mt-2">{renderedDescription}</p>}
    </div>
  );
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(50);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(query);
      setVisibleCount(50); // Reset visible count when query changes
    }, 200);
    handler();
    return () => clearTimeout(handler);
  }, [query]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return projects;

    const lower = debouncedQuery.toLowerCase();
    return projects.filter((p) => {
      const nameMatch = p.project_name?.toLowerCase().includes(lower);
      const descMatch = p.description?.toLowerCase().includes(lower);
      const pitchMatch = p.elevator_pitch?.toLowerCase().includes(lower);
      const keywordMatch = p.keywords?.toLowerCase().includes(lower);
      const userMatch = p.users?.some((u) =>
        u.user_name?.toLowerCase().includes(lower)
      );
      const classMatch = p.classes?.some((c) =>
        c.class_name?.toLowerCase().includes(lower)
      );

      return (
        nameMatch ||
        descMatch ||
        pitchMatch ||
        keywordMatch ||
        userMatch ||
        classMatch
      );
    });
  }, [debouncedQuery]);

  const displayedProjects = useMemo(() => {
    return [...new Map(filtered.map(p => [p.project_id, p])).values()].slice(0, visibleCount);
  }, [filtered, visibleCount]);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects..."
        className="w-full p-2 border border-neutral-300 focus:outline-violet-500 rounded mb-4"
      />

      <p className="text-sm text-neutral-600 mb-2">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
      </p>


      <div className="space-y-4">
        {displayedProjects.map((project) => {
          const showDescription = shouldShowDescription(project, debouncedQuery);
          return (
            <div
              key={project.project_id}
              className="relative border border-neutral-200 p-4 rounded-md shadow hover:border-violet-300 transition-colors flex flex-col space-y-2"
            >
              <Link
                href={`/projects/${project.project_id}`}
                className="absolute top-4 right-4 px-3 py-1 text-sm bg-violet-600 text-white rounded hover:bg-violet-700 transition"
              >
                View
              </Link>

              <h2 className="text-xl font-semibold pr-20">
                {highlightMatch(project.project_name, debouncedQuery)}
              </h2>

              {venues[project.venue_id] && (
                <p className="text-sm text-neutral-500">
                  {highlightMatch(venues[project.venue_id], debouncedQuery)}
                </p>
              )}

              {project.users?.length > 0 && (
                <p className="text-sm text-neutral-700">
                  <strong>Users:</strong>{" "}
                  {project.users
                    .map((u) => highlightMatch(u.user_name, debouncedQuery))
                    .reduce((acc, val, i) => [
                      ...acc,
                      ...(i > 0 ? [", "] : []),
                      val,
                    ], [])}
                </p>
              )}

              {project.keywords && (
                <p className="text-sm text-neutral-700">
                  <strong>Keywords:</strong>{" "}
                  {highlightMatch(project.keywords, debouncedQuery)}
                </p>
              )}

              {project.elevator_pitch && (
                <p className="text-sm italic text-neutral-800">
                  {highlightMatch(`“${project.elevator_pitch}”`, debouncedQuery)}
                </p>
              )}

              {project.description && (
                <DescriptionToggle
                  description={project.description}
                  query={debouncedQuery}
                  highlight={showDescription}
                />
              )}
            </div>
          );
        })}
      </div>

      {filtered.length > visibleCount && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 50)}
            className="text-sm px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
          >
            Show more
          </button>
        </div>
      )}
    </main>
  );
}
