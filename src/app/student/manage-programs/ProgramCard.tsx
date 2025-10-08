import { Program } from "@/Types";
import toast from "react-hot-toast";

export default function ProgramCard({ program }: { program: Program }) {
  // Dummy handler for status change
  const handleStatusChange = (newStatus: string) => {
    toast.success(`Status changed to ${newStatus}`);
    // You can implement your actual update logic here (e.g. axios.post to backend)
  };

  return (
    <div className="card bg-base-300/90 w-96 shadow-lg transition-transform duration-200 hover:scale-105">
      <figure>
        <img
          src={program.coverImage || "/event-placeholder.png"}
          alt={program.title}
          className="rounded-t-lg w-full h-48 object-contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl font-semibold">{program.title}</h2>

        {/* Program Details */}
        <div className="space-y-2">
          <p className="text-sm text-base-content/60">
            <strong>Description: </strong>
            {program.description || "No description available."}
          </p>
          <div className="text-sm text-base-content/60">
            <strong>Slug: </strong>
            {program.slug || "N/A"}
          </div>
          <div className="text-sm text-base-content/60">
            <strong>Program Type: </strong>
            {program.programType}
          </div>
          <div className="text-sm text-base-content/60">
            <strong>Team Type: </strong>
            {program.type === "individual" ? "Individual" : "Team"}
          </div>
          {program.teamSize && (
            <div className="text-sm text-base-content/60">
              <strong>Team Size: </strong>
              {program.teamSize.min} - {program.teamSize.max}
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="my-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Status</legend>
            <select
              className="select select-bordered w-full"
              value={program.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </fieldset>
        </div>

        {/* Manager (instead of Organizer) Section */}
        {program.manager && (
          <div className="mt-4 space-y-2 text-sm text-base-content/60">
            <div>
              <strong>Manager Name: </strong>
              {program.manager.name || "Not Provided"}
            </div>
            <div>
              <strong>Manager Email: </strong>
              {program.manager.email ? (
                <a
                  href={`mailto:${program.manager.email}`}
                  className="link link-primary"
                >
                  {program.manager.email}
                </a>
              ) : (
                "Not Provided"
              )}
            </div>
            <div>
              <strong>Manager Phone: </strong>
              {program.manager.phone || "Not Provided"}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="card-actions mt-4 space-x-2">
          <button className="btn btn-primary btn-sm">View Details</button>
          <button className="btn btn-secondary btn-sm">Edit</button>
          <button className="btn btn-error btn-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}
