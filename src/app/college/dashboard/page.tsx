"use client";

import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import { College } from "@/Types";
import {
  IconCalendarEvent,
  IconUsersGroup,
  IconCoinRupee,
  IconTrophy,
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

const eventStats = [
  { name: "Jan", events: 5 },
  { name: "Feb", events: 8 },
  { name: "Mar", events: 12 },
  { name: "Apr", events: 9 },
  { name: "May", events: 14 },
  { name: "Jun", events: 18 },
];

const revenueStats = [
  { month: "Jan", revenue: 20000, participants: 120 },
  { month: "Feb", revenue: 28000, participants: 160 },
  { month: "Mar", revenue: 34000, participants: 220 },
  { month: "Apr", revenue: 31000, participants: 210 },
  { month: "May", revenue: 40000, participants: 260 },
  { month: "Jun", revenue: 45000, participants: 300 },
];

export default function CollegeDashboard() {
  const { user } = useAuth() as { user: College };

  const stats = [
    {
      title: "Total Events",
      value: "28",
      icon: IconCalendarEvent,
      color: "text-primary",
      desc: "+3 new this month",
    },
    {
      title: "Total Participants",
      value: "1,240",
      icon: IconUsersGroup,
      color: "text-secondary",
      desc: "+180 active this week",
    },
    {
      title: "Programs Hosted",
      value: "76",
      icon: IconTrophy,
      color: "text-accent",
      desc: "+12 new programs",
    },
  ];

  return (
    <>
      {/* Header */}
      <Title
        title="College Dashboard"
        subtitle="Manage your college events, participants, and performance analytics"
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
                <img src={user.profileImage} alt="college-profile" />
              </div>
            </div>
          </div>
          <div className="stat-value text-success">₹1.25L</div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-desc text-success">+15% vs last month</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart - Event Growth */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-xl font-semibold mb-4">Monthly Event Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventStats}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="events" fill="#3ABEF9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Revenue vs Participants */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-xl font-semibold mb-4">
            Revenue vs Participants
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#00C49F"
                strokeWidth={3}
                name="Revenue (₹)"
              />
              <Line
                type="monotone"
                dataKey="participants"
                stroke="#FFBB28"
                strokeWidth={3}
                name="Participants"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
