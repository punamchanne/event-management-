"use client";

import Loading from "@/components/Loading";
import formatDate from "@/helper/FormatDate";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconPrinter, IconArrowLeft, IconCertificate, IconAlertCircle } from "@tabler/icons-react";

interface Teammate {
  _id: string;
  name: string;
  email?: string;
}

interface RegistrationDetails {
  _id: string;
  name: string;
  leader: Teammate | string;
  members: Teammate[];
  program: {
    _id: string;
    title: string;
    programType: string;
    status: string;
    eventDate?: string;
    manager?: {
      name: string;
      email: string;
    };
    event: {
      title: string;
      college: {
        name: string;
        profileImage?: string;
      };
    };
  };
}

export default function CertificatePage() {
  const { regId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<RegistrationDetails | null>(null);
  const [studentName, setStudentName] = useState<string>("");

  useEffect(() => {
    if (!regId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/students/registration-details?regId=${regId}`);
        if (res.data && res.data.success) {
          const reg: RegistrationDetails = res.data.registration;
          setRegistration(reg);

          // Determine logged in student name
          const loggedInUserId = res.data.userId;
          let matchedName = "";

          // Check leader
          if (reg.leader && typeof reg.leader === "object" && reg.leader._id === loggedInUserId) {
            matchedName = reg.leader.name;
          } else {
            // Check members
            const memberObj = reg.members.find((m) => m._id === loggedInUserId);
            if (memberObj) {
              matchedName = memberObj.name;
            } else {
              // Fallback to leader's name if not found in team
              matchedName = typeof reg.leader === "object" ? reg.leader.name : reg.name;
            }
          }
          setStudentName(matchedName);
        } else {
          setError("Failed to load certificate details.");
        }
      } catch (err: any) {
        console.error("Error fetching certificate details:", err);
        setError(err.response?.data?.message || "Error fetching certificate details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [regId]);

  if (loading) return <Loading />;

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-6 text-center poppins">
        <div className="w-16 h-16 bg-error/15 text-error rounded-full flex items-center justify-center mb-4 border border-error/20">
          <IconAlertCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold text-base-content font-outfit">Certificate Unavailable</h3>
        <p className="text-sm text-base-content/60 max-w-md mt-2 leading-relaxed">
          {error || "We could not verify your registration or retrieve the certificate information."}
        </p>
        <button
          onClick={() => router.back()}
          className="btn btn-primary btn-sm rounded-xl px-5 mt-6 flex items-center gap-1 text-white shadow"
        >
          <IconArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const { program } = registration;
  const verificationCode = `OPT-CERT-${registration._id.substring(18).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center justify-start p-4 md:p-8 select-none print:p-0 print:m-0 print:bg-white print:text-black">
      
      {/* Top Banner Control - Hidden on Print */}
      <div className="w-full max-w-5xl bg-zinc-800/80 border border-zinc-700/50 backdrop-blur-md rounded-2xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 no-print shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.close()}
            className="btn btn-ghost btn-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 rounded-xl"
          >
            <IconArrowLeft size={16} /> Close Tab
          </button>
          <div className="h-6 w-[1px] bg-zinc-700/60 hidden md:block"></div>
          <div>
            <p className="text-xs text-zinc-400">Successfully completed the program</p>
            <h4 className="text-sm font-bold text-zinc-100 font-outfit">{program.title}</h4>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-[11px] text-amber-400/80 max-w-xs text-right hidden lg:block leading-tight font-medium">
            💡 Tip: To save as high-quality PDF, enable "Background graphics" and set layout to "Landscape" with zero margins in printer settings.
          </p>
          <button
            onClick={() => window.print()}
            className="btn bg-gradient-to-r from-amber-500 to-yellow-600 border-none text-white font-bold btn-sm rounded-xl px-5 hover:from-amber-600 hover:to-yellow-700 hover:scale-[1.02] transition shadow flex items-center gap-1.5"
          >
            <IconPrinter size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Premium Landscape Certificate Wrapper */}
      <div className="certificate-page w-full max-w-[1050px] aspect-[1.414/1] bg-amber-50/5 text-amber-950 p-6 md:p-12 relative flex items-center justify-center shadow-2xl border-4 border-amber-500/25 rounded-3xl overflow-hidden print:shadow-none print:border-none print:rounded-none print:p-8 print:w-[297mm] print:h-[210mm] print:bg-white print:text-black">
        
        {/* Certificate Outer Frame and Borders */}
        <div className="absolute inset-2 md:inset-4 border-[3px] border-amber-600/40 rounded-2xl pointer-events-none print:border-amber-700"></div>
        <div className="absolute inset-3 md:inset-6 border border-amber-700/20 rounded-xl pointer-events-none print:border-amber-800/30"></div>
        
        {/* Corners Accents */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-600 rounded-tl-xl pointer-events-none"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-600 rounded-tr-xl pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-600 rounded-bl-xl pointer-events-none"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-600 rounded-br-xl pointer-events-none"></div>

        {/* Certificate Content Inner */}
        <div className="w-full h-full flex flex-col justify-between items-center text-center px-4 md:px-8 py-2 md:py-4 relative z-10">
          
          {/* Header Area */}
          <div className="space-y-2 flex flex-col items-center">
            {/* Hosting College Logo/Seal mock */}
            {program.event.college.profileImage ? (
              <img
                src={program.event.college.profileImage}
                alt={program.event.college.name}
                className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-full bg-white/10 p-1 border border-amber-600/30 shadow-md print:bg-transparent print:border-amber-700"
              />
            ) : (
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-amber-600 flex items-center justify-center text-amber-600 print:text-amber-800">
                <IconCertificate size={32} />
              </div>
            )}
            <h4 className="text-xs md:text-sm font-extrabold tracking-[0.2em] text-amber-700 uppercase font-outfit print:text-amber-800">
              {program.event.college.name}
            </h4>
            <p className="text-[9px] md:text-xs text-zinc-500 font-semibold tracking-wider max-w-xl line-clamp-1 print:text-zinc-600">
              In Association with Opportune Student Festival Management Portal
            </p>
          </div>

          {/* Main Certificate Title */}
          <div className="my-2 md:my-4 space-y-1">
            <h1 className="text-3xl md:text-5xl font-serif tracking-wide text-amber-800 font-bold print:text-amber-900">
              Certificate of Participation
            </h1>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-zinc-400 font-black font-outfit print:text-zinc-500">
              PROUDLY PRESENTED TO
            </p>
          </div>

          {/* Student Name */}
          <div className="my-1 md:my-2 border-b-2 border-amber-600/30 px-6 pb-2 inline-block max-w-lg min-w-[280px]">
            <h2 className="text-2xl md:text-4xl font-serif italic font-extrabold text-amber-950 px-2 drop-shadow-sm print:text-black">
              {studentName}
            </h2>
          </div>

          {/* Core Body text */}
          <div className="max-w-2xl text-[11px] md:text-sm leading-relaxed text-zinc-400/90 font-medium px-4 print:text-zinc-700">
            for successfully participating and showcasing outstanding dedication in the program{" "}
            <span className="font-extrabold text-amber-800 print:text-amber-950 font-outfit">
              "{program.title}"
            </span>{" "}
            ({program.programType}) during the national college festival{" "}
            <span className="font-bold text-zinc-200 print:text-zinc-900 font-outfit">
              {program.event.title}
            </span>{" "}
            held at the host campus{program.eventDate ? ` on ${formatDate(new Date(program.eventDate))}` : ""}.
          </div>

          {/* Signatures & Verification Row */}
          <div className="w-full grid grid-cols-3 items-end pt-4 mt-2 border-t border-amber-600/25 md:pt-6">
            
            {/* Signature Left: College Representative */}
            <div className="flex flex-col items-center">
              {/* Mock signature vector graphic */}
              <div className="h-8 md:h-12 flex items-center justify-center opacity-85 print:opacity-100">
                <svg viewBox="0 0 100 40" className="w-24 h-10 stroke-amber-700 fill-none print:stroke-black" strokeWidth="2">
                  <path d="M10,25 C30,10 40,35 60,15 C75,5 85,25 95,20 C85,25 50,30 30,25" />
                </svg>
              </div>
              <p className="text-[10px] md:text-xs font-bold text-amber-950 font-outfit print:text-black mt-1">
                Dr. A. K. Sen
              </p>
              <p className="text-[8px] md:text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                Principal, host college
              </p>
            </div>

            {/* Verification Seal in Center */}
            <div className="flex flex-col items-center justify-center relative">
              {/* Gold watermark seal */}
              <div className="relative w-14 h-14 md:w-18 md:h-18 rounded-full border-[3px] border-amber-600/40 bg-amber-600/10 flex items-center justify-center shadow-inner print:border-amber-700/50">
                <IconCertificate className="text-amber-600 w-8 h-8 animate-pulse print:text-amber-800" />
                <span className="absolute text-[6px] font-black uppercase text-amber-700 tracking-widest text-center animate-spin-slow">
                  {/* Rotating Text mock */}
                </span>
              </div>
              <p className="text-[8px] md:text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-2">
                VERIFIED ID
              </p>
              <p className="text-[7px] md:text-[8px] font-mono text-amber-700 font-extrabold print:text-amber-800">
                {verificationCode}
              </p>
            </div>

            {/* Signature Right: Program Manager */}
            <div className="flex flex-col items-center">
              <div className="h-8 md:h-12 flex items-center justify-center opacity-85 print:opacity-100">
                <svg viewBox="0 0 100 40" className="w-24 h-10 stroke-amber-700 fill-none print:stroke-black" strokeWidth="2">
                  <path d="M15,20 C25,25 45,5 55,25 C65,35 80,10 90,15 C75,15 65,20 40,20" />
                </svg>
              </div>
              <p className="text-[10px] md:text-xs font-bold text-amber-950 font-outfit print:text-black mt-1">
                {program.manager?.name || "Prof. Rajesh Kumar"}
              </p>
              <p className="text-[8px] md:text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                Event Coordinator
              </p>
            </div>
            
          </div>
        </div>

        {/* Diagonal Watermark seal background */}
        <div className="absolute inset-0 bg-no-repeat bg-center opacity-[0.02] pointer-events-none scale-125 select-none print:opacity-[0.03]">
          <IconCertificate size={500} />
        </div>
      </div>

      {/* Embedded print rule overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .certificate-page {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            border: none !important;
            padding: 24mm !important;
            margin: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
          .certificate-page * {
            color: #000000 !important;
          }
          .certificate-page .text-zinc-500,
          .certificate-page .text-zinc-400,
          .certificate-page .text-zinc-400/95 {
            color: #4b5563 !important;
          }
          .certificate-page .text-amber-800,
          .certificate-page .text-amber-950 {
            color: #78350f !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      ` }} />
    </div>
  );
}
