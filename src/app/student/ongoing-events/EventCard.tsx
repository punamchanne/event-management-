import Image from "next/image";
import { Event } from "@/Types";
import { IconCalendarEvent, IconUsers } from "@tabler/icons-react";
import Link from "next/link";

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="card bg-base-300 shadow-md hover:shadow-xl transition-all duration-200 border border-base-200">
      {/* Cover Image */}
      <figure className="relative h-48 w-full overflow-hidden rounded-t-xl">
        <Image
          src={event.coverImage || "/placeholder.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
      </figure>

      {/* Card Body */}
      <div className="card-body bg-base-200">
        <h2 className="card-title text-lg font-semibold text-base-content">
          {event.title}
        </h2>
        <hr />
        {event.description && (
          <p className="text-sm text-base-content/70 line-clamp-3">
            {event.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {event.tags?.slice(0, 3).map((tag, i) => (
            <div key={i} className="badge badge-outline capitalize">
              {tag.split("_").join(" ")}
            </div>
          ))}
        </div>

        {/* Dates & Info */}
        <div className="flex items-center justify-between text-xs mt-3 text-base-content/70">
          {event.startDate && (
            <div className="flex items-center gap-1">
              <IconCalendarEvent size={14} />
              <span>
                {new Date(event.startDate).toLocaleDateString()} →{" "}
                {event.endDate
                  ? new Date(event.endDate).toLocaleDateString()
                  : "TBD"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <IconUsers size={14} />
            <span>{event.programsCount ?? 0} programs</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4">
          <Link
            href={`/student/ongoing-events/${event.slug}`}
            className="btn btn-sm btn-secondary btn-outline w-full"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}
