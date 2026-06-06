"use client";

import React, { useState, useEffect } from "react";
import {
  IconCircleChevronRight,
  IconGraph,
  IconMailOpened,
  IconRocket,
  IconSchool,
  IconTrophy,
  IconUser,
  IconUsers,
  IconCalendar,
  IconMapPin,
  IconArrowRight,
  IconBuilding,
} from "@tabler/icons-react";
import CountUp from "react-countup";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface EventItem {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  startDate?: string;
  endDate?: string;
  programsCount?: number;
  tags?: string[];
  college: {
    name: string;
    address?: {
      street?: string;
      taluka?: string;
      state?: string;
    };
  };
}

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [ongoingEvents, setOngoingEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events/ongoing");
        if (res.data && res.data.events) {
          setOngoingEvents(res.data.events);
        }
      } catch (error) {
        console.error("Error fetching homepage events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleParticipateClick = (event: EventItem) => {
    if (!user) {
      toast("Please register your student account first to participate in this event!", {
        icon: "🎓",
        duration: 4000,
      });
      // Redirect to student register flow
      router.push("/register");
    } else {
      // @ts-ignore
      if (user.role === "student") {
        router.push(`/student/ongoing-events/${event.slug}`);
      } else {
        // @ts-ignore
        toast.error(`Please login as a student to participate. Current role: ${user.role}`);
      }
    }
  };

  return (
    <div className="mx-auto Orbitron">
      {/* Hero Section */}
      <section className="hero min-h-screen bg-gradient-to-br from-primary via-neutral to-secondary text-base-content backdrop-blur-lg border-b border-border">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl text-base-content font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              Welcome to <span className="text-accent">Opportune</span>
            </h1>
            <p className="max-w-2xl mb-6 font-light text-base-content/70 lg:mb-8 md:text-lg lg:text-xl">
              The futuristic hub for cross-college{" "}
              <span className="text-primary font-bold">
                competitions, events, and hackathons
              </span>
              . Connect. Compete. Grow. 🚀
              <br /> One Platform. Infinite Opportunities. Discover, compete,
              and grow with students and colleges worldwide.{" "}
              <strong>Join us today!</strong>
            </p>
            <a
              href={user ? "/student/dashboard" : "#active-fests"}
              className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
            >
              Explore Events
              <IconCircleChevronRight />
            </a>
            <a
              href="/register"
              className="btn btn-outline text-base font-medium text-center rounded-lg mr-4"
            >
              Get Started for Free
            </a>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/background-image.png" alt="hero image" />
          </div>
        </div>
      </section>

      {/* NEW: Active & Upcoming Festivals Section */}
      <section className="w-full py-20 px-6 md:px-16 bg-base-100 border-b border-base-300" id="active-fests">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-4xl font-bold text-primary font-outfit uppercase tracking-wide">
              Active & Upcoming Festivals
            </h2>
            <p className="text-sm text-base-content/65 font-medium leading-relaxed font-sans">
              Explore dynamic events hosted across various premier college campuses. Select an event to register and claim your ticket!
            </p>
          </div>

          {loadingEvents ? (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-ring loading-lg text-primary"></span>
            </div>
          ) : ongoingEvents.length === 0 ? (
            <div className="text-center p-12 bg-base-200 rounded-2xl border border-dashed border-base-300">
              <p className="text-base-content/60 italic">No active fests or events found at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {ongoingEvents.map((event) => (
                <div
                  key={event._id}
                  className="card bg-base-200 border border-base-300 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Photo */}
                    <figure className="relative h-48 w-full overflow-hidden bg-base-300/40">
                      <img
                        src={event.coverImage || "/placeholder.jpg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 badge badge-primary font-extrabold text-[10px] py-2.5 px-3 uppercase tracking-wider">
                        {event.programsCount || 0} Programs
                      </span>
                    </figure>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-black text-base-content font-outfit line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-primary font-bold flex items-center gap-1.5 mt-0.5">
                          <IconBuilding size={14} />
                          {event.college.name}
                        </p>
                      </div>

                      <p className="text-xs text-base-content/70 line-clamp-3 font-sans leading-relaxed">
                        {event.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-1">
                        {event.tags?.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="badge badge-sm badge-outline text-[9px] capitalize">
                            {tag.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-5 pt-0 space-y-4">
                    <hr className="border-base-300" />
                    
                    <div className="flex justify-between items-center text-[10px] text-base-content/60 font-semibold">
                      <span className="flex items-center gap-1">
                        <IconCalendar size={13} className="text-secondary" />
                        {formatDate(event.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconMapPin size={13} className="text-secondary" />
                        {event.college.address?.taluka || "Campus"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleParticipateClick(event)}
                      className="btn btn-primary btn-block btn-sm rounded-xl text-white font-bold flex items-center justify-center gap-1 transition"
                    >
                      Participate Now
                      <IconArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section
        className="w-full py-20 px-6 md:px-16 bg-base-200 min-h-screen"
        id="about"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary">About Opportune</h2>
          <p className="mt-6 text-lg opacity-80 poppins">
            Opportune is the ultimate platform where colleges, clubs, and
            students come together to{" "}
            <span className="text-accent">
              create, discover, and participate{" "}
            </span>
            in life-changing competitions. Whether it’s hackathons, cultural
            fests, or skill challenges —{" "}
            <span className="text-secondary font-semibold">
              we’ve got it all
            </span>
            .
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 mt-16 max-w-6xl mx-auto">
          <div className="mt-12 max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <IconSchool className="text-4xl text-primary mr-4" />
              <h3 className="text-2xl font-bold">For Colleges & Clubs</h3>
            </div>
            <p className="opacity-80">
              Host and manage cross-college events with ease. From registrations
              to analytics, everything you need is at your fingertips.
            </p>
          </div>
          <div className="mt-12 max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <IconUsers className="text-4xl text-secondary mr-4" />
              <h3 className="text-2xl font-bold">For Students</h3>
            </div>
            <p className="opacity-80">
              Discover a world of opportunities. Join events, form teams,
              showcase your skills, and climb leaderboards — all in one place.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-10 mt-16 max-w-6xl mx-auto">
          {[
            {
              icon: <IconSchool className="text-4xl text-primary" size={25} />,
              number: 100,
              title: "Colleges",
              description: "Join a vast network of institutions worldwide.",
            },
            {
              icon: <IconUsers className="text-4xl text-secondary" size={25} />,
              number: 5000,
              title: "Events",
              description: "From hackathons to cultural fests, find it all.",
            },
            {
              icon: <IconUsers className="text-4xl text-secondary" size={25} />,
              number: 20000,
              title: "Students",
              description: "Connect and compete with peers globally.",
            },
            {
              icon: <IconTrophy className="text-4xl text-accent" size={25} />,
              number: 100,
              title: "Competitions",
              description: "Showcase your skills and win exciting prizes.",
            },
          ].map((stat, index) => (
            <div key={index} className="bg-base-100 p-6 rounded-lg shadow-lg">
              <div className="mb-4 flex items-center justify-center">
                {stat.icon}
              </div>
              <h4 className="text-xl font-bold">
                <CountUp start={0} end={stat.number} duration={10} />+{" "}
                {stat.title}
              </h4>
              <p className="mt-2 opacity-80">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        className="w-full py-20 px-6 md:px-20 bg-gradient-to-b from-base-100 via-base-200 to-base-300 min-h-screen"
        id="features"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-accent mb-12">
            Futuristic Features
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-primary hover:scale-105 transition">
              <div className="card-body items-center">
                <IconRocket className="text-5xl text-primary mb-4" size={30} />
                <h3 className="card-title text-lg">Cross-College Events</h3>
                <p className="opacity-70">
                  Participate in events hosted by multiple colleges & clubs on
                  one platform.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-secondary hover:scale-105 transition">
              <div className="card-body items-center">
                <IconUser className="text-5xl text-secondary mb-4" size={30} />
                <h3 className="card-title text-lg">Team Collaboration</h3>
                <p className="opacity-70">
                  Find teammates, join groups, and collaborate across campuses
                  seamlessly.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-accent hover:scale-105 transition">
              <div className="card-body items-center">
                <IconTrophy className="text-5xl text-accent mb-4" size={30} />
                <h3 className="card-title text-lg">Leaderboards & Rewards</h3>
                <p className="opacity-70">
                  Track your progress, climb leaderboards, and earn rewards &
                  badges.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-primary hover:scale-105 transition">
              <div className="card-body items-center">
                <IconGraph className="text-5xl text-primary mb-4" size={30} />
                <h3 className="card-title text-lg">Smart Analytics</h3>
                <p className="opacity-70">
                  Organizers and admins get deep insights into registrations,
                  feedback, and success metrics.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-secondary hover:scale-105 transition">
              <div className="card-body items-center">
                <IconRocket
                  className="text-5xl text-secondary mb-4"
                  size={30}
                />
                <h3 className="card-title text-lg">AI Chatbot</h3>
                <p className="opacity-70">
                  Get instant answers to FAQs like event timings, venues, and
                  deadlines using AI.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-accent hover:scale-105 transition">
              <div className="card-body items-center">
                <IconUsers className="text-5xl text-accent mb-4" size={30} />
                <h3 className="card-title text-lg">Gamified Experience</h3>
                <p className="opacity-70">
                  Earn points, showcase achievements, and compete across global
                  leaderboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-20 px-6 md:px-20 bg-base-200" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary">Contact Us</h2>
          <p className="mt-4 opacity-80">
            Have questions or want to collaborate? Drop us a message below 👇
          </p>

          <form className="mt-8 grid gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full bg-base-100"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full bg-base-100"
            />
            <textarea
              placeholder="Your Message"
              className="textarea textarea-bordered w-full bg-base-100 h-32"
            ></textarea>
            <button className="btn btn-accent w-full btn-lg">
              <IconMailOpened className="mr-2" /> Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
