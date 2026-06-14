"use client";

import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { Event, Program } from "@/Types";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  IconMapPin,
  IconDirections,
  IconPhone,
  IconMail,
  IconUser,
  IconBuilding,
  IconNavigation,
  IconCompass,
} from "@tabler/icons-react";

interface VenueDetails {
  name: string;
  block: string;
  coordinates: { x: number; y: number };
  steps: string[];
}

export default function LocationFinderPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  // Helper to resolve simulated venues based on program title/type
  const getSimulatedVenue = (programType: string = "other", title: string = ""): VenueDetails => {
    const type = programType.toLowerCase();
    const lowerTitle = title.toLowerCase();
    if (type === "hackathon" || lowerTitle.includes("hack")) {
      return {
        name: "Main Auditorium & Innovation Center",
        block: "A Block - Ground Floor",
        coordinates: { x: 160, y: 110 },
        steps: [
          "Enter through the Main Campus Gate.",
          "Take a right turn past the fountain.",
          "Walk straight into Block A (Admin & Auditorium Building).",
          "The registration desks are right inside the central lobby."
        ]
      };
    } else if (type === "coding" || lowerTitle.includes("code") || lowerTitle.includes("compile")) {
      return {
        name: "Advanced Programming Lab (CS-3)",
        block: "B Block - 2nd Floor, Room 204",
        coordinates: { x: 300, y: 130 },
        steps: [
          "Enter the campus and walk straight past the library.",
          "Enter Block B (Science & Engineering Block).",
          "Take the central stairs or elevator to the 2nd Floor.",
          "Turn left; Lab CS-3 is at the end of the corridor."
        ]
      };
    } else if (type === "quiz" || lowerTitle.includes("quiz") || lowerTitle.includes("trivia")) {
      return {
        name: "Sir MV Seminar Hall",
        block: "C Block - 1st Floor",
        coordinates: { x: 100, y: 220 },
        steps: [
          "From the main gate, follow the left pathway.",
          "Locate Block C (Academic Block).",
          "Go up one flight of stairs to the 1st Floor.",
          "Seminar Hall A is adjacent to the department office."
        ]
      };
    } else if (type === "workshop" || lowerTitle.includes("workshop") || lowerTitle.includes("learn")) {
      return {
        name: "Research Seminar Hall",
        block: "D Block - 1st Floor",
        coordinates: { x: 260, y: 260 },
        steps: [
          "Head straight towards the central lawn.",
          "Walk past the cafeteria to Block D.",
          "Take the staircase on the right to the 1st Floor.",
          "The Research Seminar Hall is the double doors on the left."
        ]
      };
    } else if (type === "puzzle" || lowerTitle.includes("puzzle") || lowerTitle.includes("treasure")) {
      return {
        name: "Recreation Hub & Outdoor Lawns",
        block: "Campus Main Grounds",
        coordinates: { x: 210, y: 190 },
        steps: [
          "Enter through the Main Campus Gate.",
          "The briefing starts at the Main Plaza Fountain.",
          "Clues and coordinates will be distributed at the desk."
        ]
      };
    } else {
      return {
        name: "Conference Hall & Presentation Room",
        block: "A Block - 1st Floor, Room 102",
        coordinates: { x: 160, y: 70 },
        steps: [
          "Enter through the Main Campus Gate.",
          "Head into Block A (Admin & Auditorium Building).",
          "Take the stairs to the 1st Floor.",
          "Conference Hall is next to the board room."
        ]
      };
    }
  };

  // Fetch initial ongoing/published events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/events/ongoing");
        if (res.data && res.data.events) {
          setEvents(res.data.events);
          if (res.data.events.length > 0) {
            setSelectedEventId(res.data.events[0]._id);
            setSelectedEvent(res.data.events[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching events for location finder:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch programs when selectedEventId changes
  useEffect(() => {
    if (!selectedEventId) {
      setPrograms([]);
      setSelectedProgramId("");
      setSelectedProgram(null);
      return;
    }

    const matchedEvent = events.find((e) => e._id === selectedEventId) || null;
    setSelectedEvent(matchedEvent);

    if (matchedEvent) {
      const fetchPrograms = async () => {
        setLoadingPrograms(true);
        try {
          const res = await axios.get(`/api/events/event?slug=${matchedEvent.slug}`);
          if (res.data && res.data.programs) {
            setPrograms(res.data.programs);
            if (res.data.programs.length > 0) {
              setSelectedProgramId(res.data.programs[0]._id);
              setSelectedProgram(res.data.programs[0]);
            } else {
              setSelectedProgramId("");
              setSelectedProgram(null);
            }
          }
        } catch (error) {
          console.error("Error fetching programs for event details:", error);
        } finally {
          setLoadingPrograms(false);
        }
      };
      fetchPrograms();
    }
  }, [selectedEventId, events]);

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const progId = e.target.value;
    setSelectedProgramId(progId);
    const matchedProg = programs.find((p) => p._id === progId) || null;
    setSelectedProgram(matchedProg);
  };

  const getGoogleMapsLink = (college: any) => {
    if (!college || !college.address) return "#";
    const addr = college.address;
    const query = encodeURIComponent(
      `${college.name}, ${addr.street || ""}, ${addr.taluka || ""}, ${addr.district || ""}, ${addr.state || ""} ${addr.pincode || ""}`
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  if (loading) return <Loading />;

  const activeVenue = selectedProgram
    ? getSimulatedVenue(selectedProgram.programType, selectedProgram.title)
    : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-0">
      <Title
        title="Event Location Finder"
        subtitle="Find venues, view walking routes, and navigate to ongoing events"
      />

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-base-300/30 border border-accent/20 backdrop-blur-md">
        <div>
          <label className="label font-semibold text-base-content/90">Select Event / Fest</label>
          <select
            className="select select-bordered w-full bg-base-200"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {events.length === 0 ? (
              <option value="">No ongoing events found</option>
            ) : (
              events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title} ({ev.college?.name})
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="label font-semibold text-base-content/90">Select Program / Track</label>
          <select
            className="select select-bordered w-full bg-base-200"
            value={selectedProgramId}
            onChange={handleProgramChange}
            disabled={loadingPrograms || programs.length === 0}
          >
            {loadingPrograms ? (
              <option>Loading programs...</option>
            ) : programs.length === 0 ? (
              <option value="">No programs available for this event</option>
            ) : (
              programs.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} ({p.programType?.toUpperCase()})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {selectedEvent && selectedProgram && activeVenue ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Details & Steps - Left 5 Columns */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Event / Program Info Card */}
              <div className="p-6 rounded-2xl bg-base-300/20 border border-accent/30 backdrop-blur-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20 mt-1">
                    <IconBuilding size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-base-content">{selectedProgram.title}</h3>
                    <p className="text-sm text-primary font-medium mt-0.5 capitalize">
                      {selectedProgram.programType} Event
                    </p>
                  </div>
                </div>

                <div className="divider my-2"></div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-base-content/80">
                    <IconMapPin className="text-primary flex-shrink-0" size={18} />
                    <div>
                      <p className="font-semibold text-base-content">{activeVenue.name}</p>
                      <p className="text-xs text-base-content/60">{activeVenue.block}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-base-content/80">
                    <IconCompass className="text-primary flex-shrink-0" size={18} />
                    <div>
                      <p className="font-semibold text-base-content">{selectedEvent.college?.name}</p>
                      <p className="text-xs text-base-content/60">
                        {[
                          selectedEvent.college?.address?.street,
                          selectedEvent.college?.address?.taluka,
                          selectedEvent.college?.address?.district,
                          selectedEvent.college?.address?.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={getGoogleMapsLink(selectedEvent.college)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-outline btn-block mt-4 flex items-center justify-center gap-2"
                >
                  <IconNavigation size={18} />
                  Get Google Maps Directions
                </a>
              </div>

              {/* Step-by-Step Walking Directions */}
              <div className="p-6 rounded-2xl bg-base-300/20 border border-accent/30 backdrop-blur-sm space-y-4">
                <h4 className="text-md font-bold text-base-content flex items-center gap-2 uppercase tracking-wide">
                  <IconDirections className="text-secondary" size={20} />
                  Campus Walking Route
                </h4>
                <div className="relative border-l border-base-content/10 pl-5 ml-2.5 space-y-4">
                  {activeVenue.steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Bullet Number */}
                      <span className="absolute -left-[31px] top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-white text-[11px] font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-base-content/90 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coordinator Details */}
            <div className="p-6 rounded-2xl bg-base-300/20 border border-accent/30 backdrop-blur-sm space-y-3">
              <h4 className="text-sm font-bold text-base-content uppercase tracking-wide flex items-center gap-2">
                <IconUser size={18} className="text-primary" />
                Venue Coordinator
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-full text-accent font-semibold text-md">
                  {selectedProgram.manager?.name ? selectedProgram.manager.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    {selectedProgram.manager?.name || "Event Coordinator"}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-base-content/60 mt-0.5">
                    {selectedProgram.manager?.phone && (
                      <span className="flex items-center gap-1">
                        <IconPhone size={12} /> {selectedProgram.manager.phone}
                      </span>
                    )}
                    {selectedProgram.manager?.email && (
                      <span className="flex items-center gap-1">
                        <IconMail size={12} /> {selectedProgram.manager.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive SVG Campus Map - Right 7 Columns */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="p-6 rounded-2xl bg-base-300/20 border border-accent/30 backdrop-blur-sm flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-md font-bold text-base-content uppercase tracking-wide mb-1 flex items-center gap-2">
                  <IconDirections size={20} className="text-primary" />
                  Campus Layout Locator
                </h4>
                <p className="text-xs text-base-content/60 mb-4">
                  Visual layout highlighting {activeVenue.name}.
                </p>
              </div>

              {/* SVG Map Container */}
              <div className="relative w-full aspect-[4/3] max-w-lg mx-auto bg-base-200/50 rounded-xl border border-accent/20 overflow-hidden shadow-inner flex items-center justify-center">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full text-base-content"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.03" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Paths / Roads */}
                  <path
                    d="M 200 290 L 200 190 M 200 190 L 100 190 L 100 220 M 200 190 L 300 190 L 300 130 M 200 190 L 200 110 L 160 110 M 200 110 L 160 70 M 200 190 L 260 190 L 260 260"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 200 290 L 200 190 M 200 190 L 100 190 L 100 220 M 200 190 L 300 190 L 300 130 M 200 190 L 200 110 L 160 110 M 200 110 L 160 70 M 200 190 L 260 190 L 260 260"
                    fill="none"
                    stroke="var(--color-primary, #4f46e5)"
                    strokeOpacity="0.3"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Main Gate */}
                  <g transform="translate(200, 280)">
                    <circle r="8" className="fill-secondary stroke-base-100" strokeWidth="2" />
                    <text y="20" textAnchor="middle" className="text-[10px] font-bold fill-base-content/70">Main Gate</text>
                  </g>

                  {/* Block A (Auditorium & Admin) */}
                  <g transform="translate(160, 90)">
                    <rect
                      x="-35"
                      y="-25"
                      width="70"
                      height="50"
                      rx="6"
                      className={`transition-all duration-300 stroke-2 ${
                        activeVenue.name.includes("Auditorium") || activeVenue.name.includes("Conference")
                          ? "fill-primary/20 stroke-primary"
                          : "fill-base-300/40 stroke-base-content/20"
                      }`}
                    />
                    <text textAnchor="middle" className="text-[10px] font-bold fill-base-content">Block A</text>
                    <text y="12" textAnchor="middle" className="text-[8px] fill-base-content/60">Auditorium / Admin</text>
                  </g>

                  {/* Block B (Computer Labs) */}
                  <g transform="translate(300, 110)">
                    <rect
                      x="-35"
                      y="-25"
                      width="70"
                      height="50"
                      rx="6"
                      className={`transition-all duration-300 stroke-2 ${
                        activeVenue.name.includes("Lab")
                          ? "fill-primary/20 stroke-primary animate-pulse"
                          : "fill-base-300/40 stroke-base-content/20"
                      }`}
                    />
                    <text textAnchor="middle" className="text-[10px] font-bold fill-base-content">Block B</text>
                    <text y="12" textAnchor="middle" className="text-[8px] fill-base-content/60">CS & IT Labs</text>
                  </g>

                  {/* Block C (Academic) */}
                  <g transform="translate(100, 200)">
                    <rect
                      x="-35"
                      y="-25"
                      width="70"
                      height="50"
                      rx="6"
                      className={`transition-all duration-300 stroke-2 ${
                        activeVenue.name.includes("Sir MV")
                          ? "fill-primary/20 stroke-primary"
                          : "fill-base-300/40 stroke-base-content/20"
                      }`}
                    />
                    <text textAnchor="middle" className="text-[10px] font-bold fill-base-content">Block C</text>
                    <text y="12" textAnchor="middle" className="text-[8px] fill-base-content/60">Academic Block</text>
                  </g>

                  {/* Block D (Seminar & Research) */}
                  <g transform="translate(260, 240)">
                    <rect
                      x="-35"
                      y="-25"
                      width="70"
                      height="50"
                      rx="6"
                      className={`transition-all duration-300 stroke-2 ${
                        activeVenue.name.includes("Research")
                          ? "fill-primary/20 stroke-primary"
                          : "fill-base-300/40 stroke-base-content/20"
                      }`}
                    />
                    <text textAnchor="middle" className="text-[10px] font-bold fill-base-content">Block D</text>
                    <text y="12" textAnchor="middle" className="text-[8px] fill-base-content/60">Research Hub</text>
                  </g>

                  {/* Central Lawn / Fountain */}
                  <g transform="translate(200, 180)">
                    <circle
                      r="16"
                      className={`transition-all duration-300 ${
                        activeVenue.name.includes("Recreation")
                          ? "fill-primary/20 stroke-primary stroke-2"
                          : "fill-success/10 stroke-success/20 stroke-1"
                      }`}
                    />
                    <text textAnchor="middle" y="3" className="text-[8px] fill-base-content/60 font-semibold">Lawn</text>
                  </g>

                  {/* Active Venue Pulse Pin */}
                  <g transform={`translate(${activeVenue.coordinates.x}, ${activeVenue.coordinates.y})`}>
                    <circle r="12" className="fill-secondary/30 animate-ping" />
                    <circle r="6" className="fill-secondary stroke-base-100" strokeWidth="2" />
                  </g>
                </svg>

                {/* Glowing Overlay label */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-base-300/80 border border-secondary/30 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-xs font-bold text-base-content/90">{activeVenue.name}</span>
                </div>
              </div>

              <div className="text-center text-xs text-base-content/50 mt-4 italic">
                *The layout map is stylized to help locate rooms and halls relative to the Main Entrance gate.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-base-300/20 border border-accent/20 rounded-2xl">
          <div className="flex flex-col items-center justify-center space-y-3">
            <IconMapPin size={48} className="text-base-content/40" />
            <h3 className="text-xl font-bold text-base-content/80">No Ongoing Programs Found</h3>
            <p className="text-sm text-base-content/60 max-w-md">
              There are no published ongoing programs at this moment to find. Please check back when registration or event fests start!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
