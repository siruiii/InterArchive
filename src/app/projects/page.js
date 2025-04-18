"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ReactFlowWrapper = dynamic(
  () => import("@/components/ReactFlowWrapper"),
  { ssr: false },
);

// ✅ Modal component with project info
function ImageModal({ imageUrl, project, onClose, venueMap }) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-[1000px] h-[600px] bg-white rounded-xl overflow-hidden flex">
        {project?.project_id && (
          <Link
            href={`/projects/${project?.project_id}`}
            onClick={onClose}
            className="absolute top-3 right-12 w-8 h-8 rounded-full bg-white shadow text-xl font-bold flex items-center justify-center hover:bg-gray-200 transition"
          >
            ↗️
          </Link>
        )}
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow text-xl font-bold flex items-center justify-center hover:bg-gray-200 transition"
        >
          ×
        </button>

        {/* Left: Image */}
        <div className="w-1/2 h-full p-4 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Full Image"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        {/* Right: Info */}
        <div className="w-1/2 h-full p-6 overflow-y-auto space-y-3 text-left text-gray-800">
          {project ? (
            <>
              <h2 className="text-2xl font-semibold mb-2">
                {project.project_name}
              </h2>
              <p>
                {/* <span className="font-semibold">Elevator Pitch:</span>{" "} */}
                {project.elevator_pitch}
              </p>
              <details>
                <summary>More description</summary>
                <p>{project.description}</p>
              </details>
              <p>
                <span className="font-semibold">Venue:</span>{" "}
                {venueMap?.[project.venue_id?.toString()] ||
                  `Unknown (${project.venue_id})`}
              </p>
              <p>
                <span className="font-semibold">Users:</span>{" "}
                {project.users?.map((u) => u.user_name).join(", ")}
              </p>
              <p>
                <span className="font-semibold">Classes:</span>{" "}
                {project.classes?.map((c) => c.class_name).join(", ")}
              </p>
              <p>
                <span className="font-semibold">Keywords:</span>{" "}
                {project.keywords}
              </p>
              {project.url && (
                <p>
                  <span className="font-semibold">Project URL:</span>{" "}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {project.url}
                  </a>
                </p>
              )}
            </>
          ) : (
            <p>No project info available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [venueMap, setVenueMap] = useState({});

  const getImageUrls = (basePath, idWithoutExt) => {
    const extensions = [".jpeg"];
    return extensions.map((ext) => `${basePath}/${idWithoutExt}${ext}`);
  };

  const createNodesFromJson = useCallback(
    (data) => {
      const basePath = "/thumbnails";

      return data.map((item) => {
        const idWithoutExt = item.id.replace(/\..+$/, "");
        const imageUrls = getImageUrls(basePath, idWithoutExt);

        const imgEl = (
          <img
            key={item.id}
            src={imageUrls[0]}
            width={item.w}
            height={item.h}
            style={{ objectFit: "cover", borderRadius: 4, cursor: "pointer" }}
            loading="eager"
            onClick={() => {
              const cloudinaryBase =
                "https://res.cloudinary.com/dgo1cif3i/image/upload";
              const fullImageUrl = `${cloudinaryBase}/projectImages/${idWithoutExt}`;
              const matchedProject = projectData.find(
                (p) => p.project_id === idWithoutExt,
              );

              setSelectedImageUrl(fullImageUrl);
              setSelectedProject(matchedProject);
            }}
            onError={(e) => {
              let i = 1;
              const tryNext = () => {
                if (i < imageUrls.length) {
                  e.target.src = imageUrls[i++];
                }
              };
              tryNext();
              e.target.onerror = tryNext;
            }}
          />
        );

        return {
          id: item.id,
          type: "imageNode",
          position: { x: item.x, y: item.y },
          data: {
            label: imgEl,
          },
        };
      });
    },
    [projectData],
  );

  // Load project metadata
  useEffect(() => {
    Promise.all([
      fetch("/projectJSONs.json").then((res) => res.json()),
      fetch("/venue.json").then((res) => res.json()),
    ]).then(([projectData, venueMap]) => {
      setProjectData(projectData);
      setVenueMap(venueMap);
    });
  }, []);

  // Load nodes
  useEffect(() => {
    fetch("/tsne_image_data_final.json")
      .then((res) => res.json())
      .then((data) => {
        const nodes = createNodesFromJson(data);
        setNodes(nodes);
      });
  }, [createNodesFromJson]);

  const memoNodes = useMemo(() => nodes, [nodes]);
  const memoEdges = useMemo(() => edges, [edges]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowWrapper nodes={memoNodes} edges={memoEdges} />
      <ImageModal
        imageUrl={selectedImageUrl}
        project={selectedProject}
        onClose={() => {
          setSelectedImageUrl(null);
          setSelectedProject(null);
        }}
        venueMap={venueMap}
      />
    </div>
  );
}
