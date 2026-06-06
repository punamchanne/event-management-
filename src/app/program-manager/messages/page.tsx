"use client";

import React, { useState, useEffect, useRef } from "react";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {
  IconSend,
  IconMessage,
  IconUser,
  IconRefresh,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

interface StudentDetails {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

interface MessageType {
  _id?: string;
  senderId: string;
  receiverId: string;
  programId: string;
  senderRole: "student" | "program-manager";
  message: string;
  createdAt?: string;
}

interface ConversationItem {
  student: StudentDetails;
  lastMessage: string;
  lastMessageTime: string;
}

export default function CoordinatorMessagesPage() {
  const { user } = useAuth(); // Program manager session: user.id contains program._id
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load student conversations
  const fetchConversations = async () => {
    try {
      const res = await axios.get("/api/chat/conversations");
      if (res.data && res.data.success) {
        setConversations(res.data.conversations || []);
        
        // Auto-select first thread if not selected
        if (res.data.conversations.length > 0 && !selectedStudentId) {
          setSelectedStudentId(res.data.conversations[0].student._id);
          setSelectedStudent(res.data.conversations[0].student);
        }
      }
    } catch (error) {
      console.error("Error loading coordinator conversations:", error);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch message transcript
  const fetchMessages = async (studId: string, showSpinner = false) => {
    if (!studId || !user) return;
    // @ts-ignore
    const programId = user.id || user._id;

    if (showSpinner) setLoadingMessages(true);
    try {
      const res = await axios.get(
        `/api/chat/messages?programId=${programId}&studentId=${studId}`
      );
      if (res.data && res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
    } finally {
      if (showSpinner) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      const match = conversations.find((c) => c.student._id === selectedStudentId);
      if (match) {
        setSelectedStudent(match.student);
      }
      fetchMessages(selectedStudentId, true);
    }
  }, [selectedStudentId, conversations]);

  // Polling
  useEffect(() => {
    if (!selectedStudentId) return;
    const interval = setInterval(() => {
      fetchMessages(selectedStudentId, false);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedStudentId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudentId || !user) return;

    // @ts-ignore
    const programId = user.id || user._id;
    const msgText = newMessage.trim();
    setNewMessage("");

    // Local append
    const localMsg: MessageType = {
      senderId: programId,
      receiverId: selectedStudentId,
      programId: programId,
      senderRole: "program-manager",
      message: msgText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, localMsg]);

    try {
      const res = await axios.post("/api/chat/send", {
        programId: programId,
        receiverId: selectedStudentId,
        message: msgText,
      });
      if (!res.data.success) {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message. Check connection.");
    }
  };

  const selectConversation = (item: ConversationItem) => {
    setSelectedStudentId(item.student._id);
    setSelectedStudent(item.student);
  };

  if (loadingConv) return <Loading />;

  // @ts-ignore
  const programId = user?.id || user?._id;

  return (
    <div className="space-y-6 max-w-6xl mx-auto poppins">
      <Title
        title="Student Messages Workspace"
        subtitle="Manage student inquiries, clarify scheduling changes, and announce venue updates."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px] rounded-3xl bg-base-200/50 border border-base-300 overflow-hidden shadow-xl backdrop-blur-md">
        
        {/* Left conversations list - 4 columns */}
        <div className="lg:col-span-4 border-r border-base-300 flex flex-col h-full bg-base-100/30">
          <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-300/10">
            <span className="font-extrabold text-xs tracking-wider text-base-content/75 uppercase font-outfit">Student Queries</span>
            <button
              onClick={() => fetchConversations()}
              className="btn btn-ghost btn-xs btn-circle text-primary hover:bg-primary/15"
              title="Refresh Threads"
            >
              <IconRefresh size={14} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="text-center py-16 px-4 text-base-content/50">
                <IconMessage className="mx-auto text-base-content/20 mb-2" size={32} />
                <p className="text-xs font-semibold">No student messages yet.</p>
                <p className="text-[10px] text-base-content/40 mt-1 leading-relaxed">
                  When registered participants send questions regarding venue or timings, they will appear here.
                </p>
              </div>
            ) : (
              conversations.map((item) => {
                const isActive = item.student._id === selectedStudentId;
                return (
                  <button
                    key={item.student._id}
                    onClick={() => selectConversation(item)}
                    className={`w-full text-left p-3 rounded-2xl flex flex-col gap-1 transition ${
                      isActive
                        ? "bg-primary text-white shadow-md"
                        : "hover:bg-base-200 text-base-content"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <h4 className="font-bold text-xs truncate max-w-[170px] font-outfit">
                        {item.student.name}
                      </h4>
                      <span className={`text-[8px] font-mono ${isActive ? "text-white/70" : "text-base-content/40"}`}>
                        {new Date(item.lastMessageTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                    <span className={`text-[9px] truncate max-w-[210px] ${isActive ? "text-white/70" : "text-base-content/50"}`}>
                      {item.student.email}
                    </span>
                    <p className={`text-[10px] truncate max-w-[210px] mt-1 ${isActive ? "text-white/90" : "text-base-content/75"}`}>
                      {item.lastMessage}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right chat window - 8 columns */}
        <div className="lg:col-span-8 flex flex-col h-full bg-base-100/10 justify-between">
          
          {selectedStudent ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-base-300 bg-base-300/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                    {selectedStudent.profileImage ? (
                      <img src={selectedStudent.profileImage} alt={selectedStudent.name} className="object-cover w-full h-full" />
                    ) : (
                      selectedStudent.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-base-content font-outfit">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      Student Participant
                    </p>
                  </div>
                </div>

                {/* Student Contacts */}
                <div className="flex items-center gap-3 text-[10px] text-base-content/60 font-semibold border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                  {selectedStudent.phone && (
                    <span className="flex items-center gap-0.5">
                      <IconPhone size={12} /> {selectedStudent.phone}
                    </span>
                  )}
                  {selectedStudent.email && (
                    <span className="flex items-center gap-0.5">
                      <IconMail size={12} /> {selectedStudent.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Messages stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200/20">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-2">
                    <IconMessage className="text-base-content/20" size={42} />
                    <h4 className="font-bold text-xs text-base-content/70">Conversation Opened</h4>
                    <p className="text-[10px] text-base-content/50 max-w-xs leading-relaxed">
                      Reply to the student's query regarding venue directions, time shifts, or program criteria.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMyMsg = msg.senderId === programId;
                    return (
                      <div
                        key={msg._id || index}
                        className={`chat ${isMyMsg ? "chat-end" : "chat-start"}`}
                      >
                        <div className="chat-image avatar">
                          <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-[10px] font-bold text-base-content border border-base-300 uppercase">
                            {isMyMsg ? "Me" : selectedStudent.name.charAt(0)}
                          </div>
                        </div>
                        <div className={`chat-bubble text-xs leading-relaxed max-w-[280px] sm:max-w-sm rounded-2xl ${
                          isMyMsg 
                            ? "bg-gradient-to-r from-primary to-indigo-600 text-white font-medium" 
                            : "bg-base-300 text-base-content font-medium"
                        }`}>
                          {msg.message}
                        </div>
                        <div className="chat-footer text-[9px] opacity-40 font-mono mt-0.5">
                          {msg.createdAt 
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "Sending..."}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-base-300 bg-base-300/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your response to the student..."
                  className="input input-bordered input-sm flex-1 rounded-xl focus:outline-none focus:border-primary text-xs"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  maxLength={500}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm rounded-xl px-4 text-white font-bold flex items-center gap-1 shadow"
                  disabled={!newMessage.trim()}
                >
                  <IconSend size={14} /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto border border-primary/20">
                <IconMessage size={32} />
              </div>
              <h3 className="font-bold text-base text-base-content font-outfit">No Active Conversations</h3>
              <p className="text-xs text-base-content/50 max-w-sm leading-relaxed">
                When student participants send questions regarding schedules, rooms, or rules, they will appear in the left sidebar thread list.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
