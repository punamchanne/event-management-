"use client";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { Event } from "@/Types";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";

export default function OngoingEventsPage() {
  const [onGoingEvents, setOngoingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    dateRange: "all",
    college: "all",
    search: "",
  });

  const fetchOngoingEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/events/ongoing");
      if (response.ok) {
        const data = await response.json();
        setOngoingEvents(data.events);
      } else {
        console.error("Failed to fetch ongoing events");
      }
    } catch (error) {
      console.error("Error fetching ongoing events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents: Event[] = onGoingEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.search.toLowerCase());
    const matchesCollege =
      search.college === "all" || event.college.name === search.college;
    let matchesDateRange = true;
    const now = new Date();
    if (search.dateRange === "this-week") {
      const weekFromNow = new Date();
      weekFromNow.setDate(now.getDate() + 7);
      matchesDateRange =
        event?.startDate! >= now && event.startDate! <= weekFromNow;
    }
    return matchesCollege && matchesSearch && matchesDateRange;
  });

  useEffect(() => {
    fetchOngoingEvents();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <Title
        title="Ongoing Events"
        subtitle="Participate and excel in ongoing events"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            Search By College/Event Name
          </legend>
          <input
            type="text"
            placeholder="Search events..."
            className="input input-bordered join-item w-full"
            value={search.search}
            onChange={(e) => setSearch({ ...search, search: e.target.value })}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Search By Date Range</legend>
          <select
            className="select select-bordered join-item w-full"
            value={search.dateRange}
            onChange={(e) =>
              setSearch({ ...search, dateRange: e.target.value })
            }
          >
            <option value="all">All Dates</option>
            <option value="this-week">This Week</option>
            <option value="next-week">Next Week</option>
            <option value="this-month">This Month</option>
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Search By College</legend>
          <select
            className="select select-bordered join-item w-full"
            value={search.college}
            onChange={(e) => setSearch({ ...search, college: e.target.value })}
          >
            <option value="all">All Colleges</option>
            {Array.from(
              new Set(onGoingEvents.map((event) => event.college.name))
            ).map((college, index) => (
              <option key={index} value={college}>
                {college}
              </option>
            ))}
          </select>
        </fieldset>
      </div>
      {filteredEvents.length === 0 ? (
        <div className="text-center text-base-content/70">
          No ongoing events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard event={event} key={event._id!} />
          ))}
        </div>
      )}
    </div>
  );
}
