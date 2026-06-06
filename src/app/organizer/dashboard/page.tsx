"use client";

import Title from "@/components/Title";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { Event } from "@/Types";
import {
  IconUsersGroup,
  IconCalendarEvent,
  IconCoinRupee,
  IconBellRinging,
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

export default function OrganizerDashboard() {
  const { user } = useAuth() as { user: Event };
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [data, setData] = useState({
    stats: {
      activePrograms: 0,
      totalParticipants: 0,
      totalRevenue: 0,
    },
    programStats: [] as { name: string; programs: number }[],
    participantStats: [] as { month: string; participants: number; revenue: number }[],
  });

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("/api/organizer/dashboard-analytics");
      if (res.data.success) {
        setData({
          stats: res.data.stats,
          programStats: res.data.programStats,
          participantStats: res.data.participantStats,
        });
      }
    } catch (error) {
      console.error("Error fetching organizer analytics:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleSendReminders = async () => {
    setSendingEmails(true);
    try {
      const res = axios.post("/api/cron/reminders");
      toast.promise(res, {
        loading: "Scanning registrations and dispatching daily reminders...",
        success: (response: any) => {
          return response.data.message || "Event reminder emails sent successfully!";
        },
        error: (err: any) => err.response?.data?.message || "Failed to dispatch email reminders.",
      });
      await res;
    } catch (error) {
      console.error("Error sending reminders:", error);
    } finally {
      setSendingEmails(false);
    }
  };

  if (loading) return <Loading />;

  const statsList = [
    {
      title: "Active Programs",
      value: data.stats.activePrograms.toString(),
      icon: IconCalendarEvent,
      color: "text-primary",
      desc: "Currently running/planned",
    },
    {
      title: "Total Participants",
      value: data.stats.totalParticipants.toLocaleString(),
      icon: IconUsersGroup,
      color: "text-secondary",
      desc: "Registrants & team members",
    },
  ];

  return (
    <>
      {/* Header and Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Title
          title="Organizer Dashboard"
          subtitle="Manage your events, participants, and revenue at a glance"
        />
        <button
          onClick={handleSendReminders}
          disabled={sendingEmails}
          className="btn btn-outline btn-primary rounded-xl flex items-center gap-2 font-bold transition hover:scale-[1.02] shadow no-print"
        >
          <IconBellRinging size={18} className="animate-bounce" />
          Send 1-Day Event Reminders
        </button>
      </div>

      {/* Stats Section */}
      <div className="stats shadow w-full bg-base-200">
        {statsList.map((stat, index) => (
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
              <div className="w-16 rounded-full border border-base-300">
                <img src={user?.coverImage || "/placeholder.jpg"} alt="Event Banner" />
              </div>
            </div>
          </div>
          <div className="stat-value text-success">₹{data.stats.totalRevenue.toLocaleString("en-IN")}</div>
          <div className="stat-title font-bold">Total Revenue</div>
          <div className="stat-desc text-success">Ticket sales collections</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart - Programs */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-xl font-bold font-outfit uppercase mb-4 text-primary tracking-wide">Programs Organized</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.programStats}>
              <XAxis dataKey="name" stroke="currentColor" opacity={0.6} />
              <YAxis stroke="currentColor" opacity={0.6} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="programs" fill="var(--p, #ff8f00)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Participants vs Revenue */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-xl font-bold font-outfit uppercase mb-4 text-secondary tracking-wide font-outfit">
            Participants vs Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.participantStats}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" stroke="currentColor" opacity={0.6} />
              <YAxis stroke="currentColor" opacity={0.6} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="participants"
                stroke="var(--wa, #FFBB28)"
                strokeWidth={3}
                name="Participants"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--su, #00C49F)"
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
