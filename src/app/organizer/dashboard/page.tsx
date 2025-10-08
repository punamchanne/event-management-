"use client";

import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import {
  IconPlus,
  IconUsersGroup,
  IconCalendarEvent,
  IconCoinRupee,
} from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { useState } from "react";
import toast from "react-hot-toast";
import { Event } from "@/Types";

const programStats = [
  { name: "Jan", programs: 2 },
  { name: "Feb", programs: 4 },
  { name: "Mar", programs: 6 },
  { name: "Apr", programs: 5 },
  { name: "May", programs: 7 },
  { name: "Jun", programs: 9 },
];

const participantStats = [
  { month: "Jan", participants: 80, revenue: 12000 },
  { month: "Feb", participants: 140, revenue: 19000 },
  { month: "Mar", participants: 200, revenue: 26000 },
  { month: "Apr", participants: 180, revenue: 23000 },
  { month: "May", participants: 240, revenue: 31000 },
  { month: "Jun", participants: 300, revenue: 40000 },
];

export default function OrganizerDashboard() {
  const { user } = useAuth() as { user: Event };
  const [openModal, setOpenModal] = useState(false);

  const stats = [
    {
      title: "Active Programs",
      value: "12",
      icon: IconCalendarEvent,
      color: "text-primary",
      desc: "+2 this week",
    },
    {
      title: "Total Participants",
      value: "2,340",
      icon: IconUsersGroup,
      color: "text-secondary",
      desc: "+340 joined recently",
    },
  ];

  return (
    <>
      {/* Header */}
      <Title
        title="Organizer Dashboard"
        subtitle="Manage your events, participants, and revenue at a glance"
      />

      {/* Stats Section */}
      <div className="stats shadow w-full bg-base-200">
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

        <div className="stat">
          <div className="stat-figure text-success">
            <div className="avatar avatar-online">
              <div className="w-16 rounded-full">
                <img src={user.coverImage} alt="Event Banner" />
              </div>
            </div>
          </div>
          <div className="stat-value text-success">₹1.8L</div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-desc text-success">+8% vs last month</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart - Programs */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-xl font-semibold mb-4">Programs Organized</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programStats}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="programs" fill="#3ABEF9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Participants vs Revenue */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-xl font-semibold mb-4">
            Participants vs Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={participantStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="participants"
                stroke="#FFBB28"
                strokeWidth={3}
                name="Participants"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#00C49F"
                strokeWidth={3}
                name="Revenue (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
