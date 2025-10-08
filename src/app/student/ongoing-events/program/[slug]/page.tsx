"use client";

import Loading from "@/components/Loading";
import { Program } from "@/Types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconCalendar,
  IconMail,
  IconPhone,
  IconUser,
  IconTrophy,
  IconUsersGroup,
  IconClipboardList,
  IconClockHour4,
} from "@tabler/icons-react";
import formatDate from "@/helper/FormatDate";
import Timer from "@/helper/Timer";
import toast from "react-hot-toast";

export default function ProgramReadMorePage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState<Program | null>(null);

  const fetchProgramDetails = async (slug: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/programs/program?slug=${slug}`);
      setProgram(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchProgramDetails(slug as string);
  }, [slug]);

  if (loading || !program) return <Loading />;

  return (
    <div className="p-6 mx-auto border border-accent shadow-lg rounded-2xl bg-base-200/40 space-y-4">
      {/* Header Image */}
      <figure className="relative h-64 w-full overflow-hidden rounded-xl shadow-sm">
        <Image
          src={program.coverImage || "/placeholder.jpg"}
          alt={program.title}
          fill
          className="object-contain bg-base-300/30"
        />
      </figure>

      {/* Program Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-semibold text-base-content">
            {program.title}
          </h1>
          <div
            className={`badge capitalize ${
              program.status === "published"
                ? "badge-success"
                : program.status === "ongoing"
                ? "badge-info"
                : program.status === "completed"
                ? "badge-neutral"
                : program.status === "cancelled"
                ? "badge-error"
                : "badge-ghost"
            }`}
          >
            {program.status}
          </div>
        </div>

        <p className="text-base text-base-content/80 leading-relaxed whitespace-pre-line">
          {program.description || "No description available."}
        </p>

        <div className="badge badge-outline capitalize">
          {program.programType}
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <IconCalendar size={16} />
            <span>
              {program.registrationStart
                ? formatDate(program.registrationStart)
                : "TBD"}{" "}
              →{" "}
              {program.registrationEnd
                ? formatDate(program.registrationEnd)
                : "TBD"}
            </span>
          </div>
          <div>
            <Timer deadLine={new Date(program.registrationEnd!)} />
          </div>
        </div>
      </div>

      <hr className="border-base-300" />

      {/* Organizer Details */}
      <div className="card bg-base-200/40 shadow-sm p-5 rounded-xl">
        <h2 className="text-lg font-semibold text-base-content flex items-center gap-2 mb-3">
          <IconUser size={18} /> Organizer
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 rounded-full overflow-hidden bg-base-300">
            <Image
              src={
                program.event?.college?.profileImage ||
                "/college-placeholder.png"
              }
              alt={program.event?.college?.name || "College"}
              fill
              className="object-contain"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-base-content flex items-center gap-1">
              <IconUser size={14} /> {program.manager.name || "Not specified"}
            </p>
            <p className="text-sm text-base-content/70 flex items-center gap-1">
              <IconMail size={14} /> {program.manager.email || "Not specified"}
            </p>
            <p className="text-sm text-base-content/70 flex items-center gap-1">
              <IconPhone size={14} /> {program.manager.phone || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-base-300" />

      {/* Rounds Section */}
      <div className="card bg-base-200/40 shadow-sm p-5 rounded-xl">
        <h2 className="text-lg font-semibold text-base-content flex items-center gap-2 mb-3">
          <IconClipboardList size={18} /> Rounds
        </h2>
        {program.rounds && program.rounds.length > 0 ? (
          <div className="space-y-4">
            {program.rounds.map((round, idx) => (
              <div
                key={idx}
                className="border border-base-300 p-4 rounded-xl bg-base-200/30"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-base-content">
                    Round {round.order || idx + 1}: {round.name || "Untitled"}
                  </h3>
                  {round.scoringMethod && (
                    <span className="text-xs text-base-content/60">
                      Scoring: {round.scoringMethod}
                    </span>
                  )}
                </div>
                <div className="text-sm text-base-content/70 flex items-center gap-2">
                  <IconClockHour4 size={14} />
                  <span>
                    {round.startTime ? formatDate(round.startTime) : "TBD"} →{" "}
                    {round.endTime ? formatDate(round.endTime) : "TBD"}
                  </span>
                </div>
                {round.instructions && (
                  <p className="text-sm mt-2 text-base-content/80 whitespace-pre-line">
                    {round.instructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-base-content/60 italic">
            No rounds specified.
          </p>
        )}
      </div>

      <hr className="border-base-300" />

      {/* Prizes Section */}
      {program.prizes && program.prizes.length > 0 && (
        <div className="card bg-base-200/40 shadow-sm p-5 rounded-xl">
          <h2 className="text-lg font-semibold text-base-content flex items-center gap-2 mb-3">
            <IconTrophy size={18} /> Prizes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {program.prizes.map((prize, idx) => (
              <div
                key={idx}
                className="rounded-xl p-4 bg-base-200/40 border border-base-300"
              >
                <h3 className="font-medium text-base-content">{prize.title}</h3>
                <p className="text-sm text-base-content/70 mt-1">
                  ₹{prize.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="border-base-300" />

      {/* Team Info */}
      <div className="card bg-base-200/40 shadow-sm p-5 rounded-xl">
        <h2 className="text-lg font-semibold text-base-content flex items-center gap-2 mb-3">
          <IconUsersGroup size={18} /> Team Information
        </h2>
        <div className="space-y-2 text-sm text-base-content/80">
          <p>
            <strong>Type:</strong> {program.type}
          </p>
          <p>
            <strong>Team Size:</strong>{" "}
            {program.teamSize
              ? `${program.teamSize.min || 1} - ${program.teamSize.max || 1}`
              : "N/A"}
          </p>
          <p>
            <strong>Max Teams:</strong> {program.maxTeams || "Unlimited"}
          </p>
          <p>
            <strong>Price per Team:</strong> ₹{program.pricePerTeam || 0}
          </p>
        </div>
      </div>

      {/* Participate Button */}
      <div className="flex justify-center">
        <button
          className="btn btn-primary px-8"
          onClick={() => {
            toast("Participation feature coming soon!", { icon: "🚧" });
          }}
        >
          Participate
        </button>
      </div>
    </div>
  );
}
