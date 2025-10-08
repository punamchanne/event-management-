"use client";

import Loading from "@/components/Loading";
import { Event, Program } from "@/Types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconCalendar,
  IconLocation,
  IconMail,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import ProgramCard from "./ProgramCard";
import formatDate from "@/helper/FormatDate";
import Timer from "@/helper/Timer";

export default function EventReadMorePage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState<{
    event: Event;
    programs: Program[];
  }>();

  const fetchEventDetails = async (slug: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/events/event?slug=${slug}`);
      setEventData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchEventDetails(slug as string);
  }, [slug]);

  if (loading || !eventData) return <Loading />;

  const { event, programs } = eventData;

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="border border-accent shadow-md rounded-2xl">
        <figure className="relative h-64 w-full overflow-hidden rounded-t-xl">
          <Image
            src={event.coverImage || "/placeholder.jpg"}
            alt={event.title}
            fill
            className="object-contain bg-base-300/20 backdrop-blur-lg"
          />
        </figure>

        <div className="card-body bg-base-300/40 backdrop-blur-lg rounded-b-xl">
          <h1 className="card-title text-2xl font-semibold text-base-content">
            {event.title}
          </h1>
          <hr />

          <p className="text-base text-base-content/80 leading-relaxed whitespace-pre-line">
            {event.description || "No description available."}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {event.tags?.map((tag, i) => (
              <div key={i} className="badge badge-outline capitalize">
                {tag.split("_").join(" ")}
              </div>
            ))}
          </div>

          {/* College Details */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-base-content mb-2">
              Organized By
            </h2>
            <hr />
            <div className="flex items-center gap-4 mt-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-base-200">
                <img
                  src={event.college.profileImage || "/college-placeholder.png"}
                  alt={event.college.name}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-row gap-6">
                <div className="space-y-1">
                  <h3 className="text-md font-medium text-base-content">
                    {event.college.name}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    <IconMail size={16} className="inline mr-1" />
                    {event.college.email || "Email not specified"}
                  </p>
                  <p className="text-sm text-base-content/70">
                    <IconPhone size={16} className="inline mr-1" />
                    {event.college.phone || "Phone not specified"}
                  </p>
                  <p className="text-sm text-base-content/70">
                    <IconLocation size={16} className="inline mr-1" />
                    {event.college.address?.street ||
                      "Address not specified"},{" "}
                    {event.college.address?.taluka || "City not specified"},{" "}
                    {event.college.address?.state || "State not specified"},{" "}
                    {event.college.address?.pincode || "ZIP not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <h2 className="text-md font-medium text-base-content">
                    Organizer
                  </h2>
                  <p className="text-sm text-base-content/70">
                    <IconUser size={16} className="inline mr-1" />
                    {event.organizer.name || "Name not specified"}
                  </p>
                  <p className="text-sm text-base-content/70">
                    <IconMail size={16} className="inline mr-1" />
                    {event.organizer.email || "Email not specified"}
                  </p>
                  <p className="text-sm text-base-content/70">
                    <IconPhone size={16} className="inline mr-1" />
                    {event.organizer.phone || "Phone not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-base-content/70">
            <div className="flex items-center gap-1">
              <IconCalendar size={16} />
              <span className="whitespace-nowrap text-base">
                {event.startDate ? formatDate(event.startDate) : "TBD"} →{" "}
                {event.endDate ? formatDate(event.endDate) : "TBD"}
              </span>
            </div>
            <div>
              <Timer deadLine={new Date(event.startDate!)} />
            </div>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <section>
        <h2 className="text-xl font-semibold text-base-content mb-3 uppercase">
          Programs under this event
        </h2>
        <hr className="mb-2" />

        {programs && programs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => (
              <ProgramCard key={program._id} program={program} />
            ))}
          </div>
        ) : (
          <div className="text-center text-base-content/60 italic py-6">
            No programs found for this event.
          </div>
        )}
      </section>
    </div>
  );
}
