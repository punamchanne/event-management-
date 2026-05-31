import { Event } from "@/Types";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const handleStatusChange = (newStatus: string) => {
    try {
      const res = axios.post("/api/events/update-event-status", {
        eventId: event._id,
        status: newStatus,
      });
      toast.promise(res, {
        loading: "Updating status...",
        success: (data) => {
          return "Event status updated successfully.";
        },
        error: (err) => "Error updating event status.",
      });
    } catch (error) {
      console.log("Error updating event status:", error);
      toast.error("Failed to update event status.");
    }
  };
  return (
    <div className="card bg-base-300/90 w-96 shadow-lg transition-transform duration-200 hover:scale-105">
      <figure>
        <img
          src={event.coverImage || "/event-placeholder.png"}
          alt={event.title}
          className="rounded-t-lg w-full h-48 object-contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl font-semibold">{event.title}</h2>

        {/* Event Details */}
        <div className="space-y-2">
          <p className="text-sm text-base-content/60">
            <strong>Description: </strong>
            {event.description || "No description available."}
          </p>
          <div className="text-sm text-base-content/60">
            <strong>Slug: </strong>
            {event.slug || "N/A"}
          </div>
          <div className="flex flex-col text-sm text-base-content/60">
            <span>
              <strong>Start Date: </strong>
              {new Date(event.startDate as Date).toLocaleString()}
            </span>
            <br />
            <span>
              <strong>End Date: </strong>
              {new Date(event.endDate as Date).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="my-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Status</legend>
            <select
              className="select select-bordered w-full"
              value={event.status}
              onChange={() => {
                handleStatusChange(
                  event.status === "draft"
                    ? "published"
                    : event.status === "published"
                    ? "archived"
                    : "draft"
                );
              }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </fieldset>
        </div>

        {/* Tags Section */}
        {event.tags!.length > 0 && (
          <div className="mt-4 space-x-2 space-y-2">
            {event.tags!.map((tag, index) => (
              <span key={index} className="badge badge-primary text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Organizer Section */}
        {event.organizer && (
          <div className="mt-4 space-y-2 flex flex-col">
            <div className="flex flex-col">
              <span className="text-sm text-base-content/60">
                <strong>Organizer Name: </strong>
                {event.organizer.name || "Not Provided"}
              </span>
            </div>
            <span className="text-sm text-base-content/60">
              <strong>Organizer Email: </strong>
              {event.organizer.email ? (
                <a
                  href={`mailto:${event.organizer.email}`}
                  className="link link-primary"
                >
                  {event.organizer.email}
                </a>
              ) : (
                "Not Provided"
              )}
            </span>
            <span className="text-sm text-base-content/60">
              <strong>Organizer Phone: </strong>
              {event.organizer.phone || "Not Provided"}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="card-actions mt-4 space-x-2">
          <Link href={`/student/ongoing-events/${event.slug}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
          <button onClick={onEdit} className="btn btn-secondary btn-sm">Edit</button>
          <button onClick={onDelete} className="btn btn-error btn-sm">Cancel Event</button>
        </div>
      </div>
    </div>
  );
}
