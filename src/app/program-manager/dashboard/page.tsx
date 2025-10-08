"use client";

import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import {
  IconUsers,
  IconClipboardList,
  IconTrophy,
  IconChartBar,
} from "@tabler/icons-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const participantData = [
  { month: "Jan", participants: 120 },
  { month: "Feb", participants: 190 },
  { month: "Mar", participants: 240 },
  { month: "Apr", participants: 300 },
  { month: "May", participants: 450 },
  { month: "Jun", participants: 500 },
];

const progressData = [
  { round: "Round 1", avgScore: 60 },
  { round: "Round 2", avgScore: 72 },
  { round: "Round 3", avgScore: 85 },
  { round: "Final", avgScore: 91 },
];

export default function ProgramManagerDashboard() {
  const stats = [
    {
      title: "Total Participants",
      value: "500+",
      icon: IconUsers,
      color: "text-primary",
      desc: "+25 new this week",
    },
    {
      title: "Active Submissions",
      value: "132",
      icon: IconClipboardList,
      color: "text-secondary",
      desc: "8 awaiting review",
    },
    {
      title: "Completed Rounds",
      value: "3 / 4",
      icon: IconTrophy,
      color: "text-accent",
      desc: "Final round ongoing",
    },
    {
      title: "Average Score",
      value: "84%",
      icon: IconChartBar,
      color: "text-success",
      desc: "↑ 6% from last event",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Title
        title="Program Manager Dashboard"
        subtitle="Monitor participant engagement, progress, and performance"
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participants Growth Chart */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Participant Growth
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={participantData}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="participants"
                fill="#00bcd4"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend Chart */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-lg font-semibold mb-4">
            Average Score Progress per Round
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="round" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#4ade80"
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
