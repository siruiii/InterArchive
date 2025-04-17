import projects from "@/projects.json";
import venues from "@/venues.json";

export async function generateStaticParams() {
  return projects.map((proj) => ({ id: proj.project_id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = projects.find((p) => p.project_id === id);
  return {
    title: project.project_name,
    description: project.elevator_pitch,
  };
}

const listFormatter = new Intl.ListFormat("en-US", {
  style: "short",
  type: "conjunction",
});

export default async function Page({ params }) {
  const { id } = await params;
  const cloudinaryBase = "https://res.cloudinary.com/dgo1cif3i/image/upload";
  const fullImageUrl = `${cloudinaryBase}/projectImages/${id}`;
  const project = projects.find((p) => p.project_id === id);
  const venue = venues[project.venue_id];
  let urlDomain = "";
  try {
    urlDomain = new URL(project.url).hostname;
  } catch (e) {}

  return (
    <article class="container py-12 mx-auto max-w-6xl grid md:grid-cols-[2fr_3fr] gap-4 md:gap-8">
      <div>
        <img
          src={fullImageUrl}
          alt={project.project_name}
          className="rounded-xl"
        />
        {project.video && (
          <iframe
            src={project.video.replace("/view", "/preview")}
            className="w-full h-64 rounded-xl mt-4"
          />
        )}
      </div>
      <div>
        <h1 className="text-4xl font-bold mb-2">{project.project_name}</h1>
        <p>
          By {listFormatter.format(project.users.map((user) => user.user_name))}
        </p>
        <p>{venue}</p>
        <dl class="mb-6">
          <dt className="font-bold mt-4">Elevator pitch</dt>
          <dd className="text-pretty">{project.elevator_pitch}</dd>

          <dt className="font-bold mt-4">Keywords</dt>
          <dd class="flex flex-wrap gap-2">
            {project.keywords.split(",").map((kword) => (
              <span
                key={kword}
                className="bg-gray-200 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded whitespace-nowrap"
              >
                {kword.trim()}
              </span>
            ))}
          </dd>

          <dt className="font-bold mt-4">
            Class{project.classes.length > 1 ? "es" : ""}
          </dt>
          <dd class="flex flex-wrap gap-2">
            {project.classes.map((cls) => (
              <span
                key={cls.class_name}
                className="bg-gray-200 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded whitespace-nowrap"
              >
                {cls.class_name}
              </span>
            ))}
          </dd>
          <dt className="font-bold mt-4">Description</dt>
          <dd className="text-pretty">{project.description}</dd>

          <dt className="font-bold mt-4">User scenario</dt>
          <dd className="text-pretty whitespace-pre-wrap">
            {project.user_scenario}
          </dd>

          <dt className="font-bold mt-4">Technical system</dt>
          <dd className="text-pretty whitespace-pre-wrap">
            {project.technical_system}
          </dd>
        </dl>
        {project.url.length > 8 && (
          <a
            href={project.url}
            className="bg-black text-white py-2 px-4 font-semibold rounded-md hover:bg-neutral-800 transition-colors"
          >
            Open project on {urlDomain}
          </a>
        )}
      </div>
    </article>
  );
}
