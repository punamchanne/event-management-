"use client";

import Title from "@/components/Title";
import {
  IconCalendarEvent,
  IconTrophy,
  IconRocket,
  IconUser,
} from "@tabler/icons-react";

export default function StudentDashboard() {
  const events = [
    { name: "Hackathon 2025", date: "10 Oct 2025", status: "Ongoing" },
    { name: "AI Challenge", date: "20 Oct 2025", status: "Upcoming" },
    { name: "Code Wars", date: "05 Sep 2025", status: "Completed" },
  ];

  const stats = [
    {
      title: "Ongoing Events",
      value: "03",
      icon: IconCalendarEvent,
      color: "text-primary",
      desc: "+1 new this week",
    },
    {
      title: "Completed Events",
      value: "12",
      icon: IconTrophy,
      color: "text-secondary",
      desc: "+2 new this week",
    },
    {
      title: "Achievements",
      value: "05",
      icon: IconUser,
      color: "text-accent",
      desc: "+1 new this week",
    },
  ];

  return (
    <div className="space-y-6">
      <Title
        title="Student Dashboard"
        subtitle="Overview of your activities and events"
      />
      {/* Stats Section */}
      <div className="stats shadow w-full bg-base-200/80 backdrop-blur-lg">
        {stats.map((stat, index) => (
          <div key={index} className="stat">
            <div className="stat-figure text-3xl">
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="stat-title">{stat.title}</div>
            <div className={`stat-value ${stat.color}`}>{stat.value}</div>
            <div className="stat-desc">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Events Table */}
      <div className="bg-base-300 backdrop-blur-md rounded-xl p-6 shadow border border-base-300">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          Event Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="text-primary">
                <th>#</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{event.name}</td>
                  <td>{event.date}</td>
                  <td>
                    <span
                      className={`badge ${
                        event.status === "Ongoing"
                          ? "badge-primary"
                          : event.status === "Upcoming"
                          ? "badge-secondary"
                          : "badge-success"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
