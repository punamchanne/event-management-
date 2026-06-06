"use client";

import Title from "@/components/Title";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { College } from "@/Types";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  IconCalendarEvent,
  IconUsersGroup,
  IconCoinRupee,
  IconTrophy,
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

export default function CollegeDashboard() {
  const { user } = useAuth() as { user: College };
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [data, setData] = useState({
    stats: {
      totalEvents: 0,
      totalPrograms: 0,
      totalParticipants: 0,
      totalRevenue: 0,
    },
    eventStats: [] as { name: string; events: number }[],
    revenueStats: [] as { month: string; revenue: number; participants: number }[],
  });

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("/api/college/dashboard-analytics");
      if (res.data.success) {
        setData({
          stats: res.data.stats,
          eventStats: res.data.eventStats,
          revenueStats: res.data.revenueStats,
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
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
      title: "Total Events",
      value: data.stats.totalEvents.toString(),
      icon: IconCalendarEvent,
      color: "text-primary",
      desc: "Hosted on UniSync",
    },
    {
      title: "Total Participants",
      value: data.stats.totalParticipants.toLocaleString(),
      icon: IconUsersGroup,
      color: "text-secondary",
      desc: "Registered students",
    },
    {
      title: "Programs Hosted",
      value: data.stats.totalPrograms.toString(),
      icon: IconTrophy,
      color: "text-accent",
      desc: "Sub-events & fests",
    },
  ];

  return (
    <>
      {/* Header and Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Title
          title="College Dashboard"
          subtitle="Manage your college events, participants, and performance analytics"
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
                <img src={user?.profileImage || "/raisoni_nagpur_logo_1779596234411.png"} alt="college-profile" />
              </div>
            </div>
          </div>
          <div className="stat-value text-success">₹{data.stats.totalRevenue.toLocaleString("en-IN")}</div>
          <div className="stat-title font-bold">Total Revenue</div>
          <div className="stat-desc text-success">Gross collections</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart - Event Growth */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-xl font-bold font-outfit uppercase mb-4 text-primary tracking-wide">Monthly Event Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.eventStats}>
              <XAxis dataKey="name" stroke="currentColor" opacity={0.6} />
              <YAxis stroke="currentColor" opacity={0.6} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="events" fill="var(--p, #ff8f00)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Revenue vs Participants */}
        <div className="bg-base-200 p-6 rounded-box shadow-md border border-base-300">
          <h2 className="text-xl font-bold font-outfit uppercase mb-4 text-secondary tracking-wide">
            Revenue vs Participants
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenueStats}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" stroke="currentColor" opacity={0.6} />
              <YAxis stroke="currentColor" opacity={0.6} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--su, #00C49F)"
                strokeWidth={3}
                name="Revenue (₹)"
              />
              <Line
                type="monotone"
                dataKey="participants"
                stroke="var(--wa, #FFBB28)"
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
