"use client";

import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import { Admin } from "@/Types";
import {
  IconBuildingCommunity,
  IconCalendarEvent,
  IconUsers,
  IconCoinRupee,
} from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const eventData = [
  { name: "Jan", events: 12 },
  { name: "Feb", events: 18 },
  { name: "Mar", events: 25 },
  { name: "Apr", events: 30 },
  { name: "May", events: 22 },
  { name: "Jun", events: 27 },
];

export default function AdminDashboard() {
  const { user } = useAuth() as { user: Admin };
  const stats = [
    {
      title: "Total Colleges",
      value: "56",
      icon: IconBuildingCommunity,
      color: "text-primary",
      desc: "+4 new this month",
    },
    {
      title: "Total Events",
      value: "312",
      icon: IconCalendarEvent,
      color: "text-secondary",
      desc: "+18 active now",
    },
    {
      title: "Total Users",
      value: "12.5k",
      icon: IconUsers,
      color: "text-accent",
      desc: "+1.2k this month",
    },
  ];
  return (
    <>
      {/* Header */}
      <Title
        title="Admin Dashboard"
        subtitle="Overview of Opportune platform performance and analytics"
      />
      {/* Stats Section */}
      <div className="stats shadow w-full bg-base-200">
        {stats.map((stat, index) => (
          <div key={index} className="stat">
            <div className="stat-figure text-3xl">
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className={`stat-title`}>{stat.title}</div>
            <div className={`stat-value ${stat.color}`}>{stat.value}</div>
            <div className={`stat-desc`}>{stat.desc}</div>
          </div>
        ))}
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar avatar-online">
              <div className="w-16 rounded-full">
                <img src={user.profileImage} />
              </div>
            </div>
          </div>
          <div className="stat-value">₹2.4L</div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-desc text-secondary">+12% vs last month</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-base-200 mt-6 p-6 rounded-box shadow-md border border-base-300">
        <h2 className="text-xl font-semibold mb-4">Monthly Event Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventData}>
            <XAxis dataKey="name" stroke="#000" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="events"
              fill="#ff8f00"
              radius={[6, 6, 0, 0]}
              className="capitalize"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
