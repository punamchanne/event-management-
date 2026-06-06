"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import {
  IconSend,
  IconMessage,
  IconUser,
  IconBuilding,
  IconRefresh,
  IconAlertCircle,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

interface Teammate {
  _id: string;
  name: string;
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
  program: {
    _id: string;
    title: string;
    programType: string;
    manager?: {
      name: string;
      email: string;
      phone?: string;
    };
    event: {
      title: string;
      college: {
        name: string;
      };
    };
  };
  lastMessage: string;
  lastMessageTime: string;
}

function ChatContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialProgramId = searchParams.get("programId");

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load all active conversations
  const fetchConversations = async (autoSelectId?: string) => {
    try {
      const res = await axios.get("/api/chat/conversations");
      if (res.data && res.data.success) {
        setConversations(res.data.conversations || []);
        
        // Handle auto-selection / redirect parameters
        const targetId = autoSelectId || initialProgramId;
        if (targetId) {
          setSelectedProgramId(targetId);
          // Check if this program is already in conversations list
          const found = res.data.conversations.find((c: any) => c.program._id === targetId);
          if (found) {
            setSelectedProgram(found.program);
          } else {
            // Fetch the program detail to initialize a clean chat window
            try {
              const pRes = await axios.get(`/api/programs/program?id=${targetId}`);
              if (pRes.data) {
                setSelectedProgram(pRes.data);
              }
            } catch (err) {
              console.error("Error initializing new chat window:", err);
            }
          }
        } else if (res.data.conversations.length > 0 && !selectedProgramId) {
          setSelectedProgramId(res.data.conversations[0].program._id);
          setSelectedProgram(res.data.conversations[0].program);
        }
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [initialProgramId]);

  // Load messages history
  const fetchMessages = async (progId: string, showSpinner = false) => {
    if (!progId) return;
    if (showSpinner) setLoadingMessages(true);
    try {
      const res = await axios.get(`/api/chat/messages?programId=${progId}`);
      if (res.data && res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      if (showSpinner) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedProgramId) {
      // Find selected program metadata from conversations
      const match = conversations.find((c) => c.program._id === selectedProgramId);
      if (match) {
        setSelectedProgram(match.program);
      }
      fetchMessages(selectedProgramId, true);
    }
  }, [selectedProgramId, conversations]);

  // Polling for messages
  useEffect(() => {
    if (!selectedProgramId) return;
    const interval = setInterval(() => {
      fetchMessages(selectedProgramId, false);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedProgramId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProgramId || !user) return;

    const msgText = newMessage.trim();
    setNewMessage("");

    // Append message locally for lag-free performance
    const localMsg: MessageType = {
      // @ts-ignore
      senderId: user.id || user._id,
      receiverId: selectedProgramId,
      programId: selectedProgramId,
      senderRole: "student",
      message: msgText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, localMsg]);

    try {
      const res = await axios.post("/api/chat/send", {
        programId: selectedProgramId,
        receiverId: selectedProgramId,
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
    setSelectedProgramId(item.program._id);
    setSelectedProgram(item.program);
    // Clear URL query parameters
    router.replace("/student/messages");
  };

  if (loadingConv) return <Loading />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto poppins">
      <Title
        title="Live Coordinator Chat"
        subtitle="Chat directly with college event managers regarding room venues, schedules, or rules."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px] rounded-3xl bg-base-200/50 border border-base-300 overflow-hidden shadow-xl backdrop-blur-md">
        
        {/* Left conversations list - 4 columns */}
        <div className="lg:col-span-4 border-r border-base-300 flex flex-col h-full bg-base-100/30">
          <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-300/10">
            <span className="font-extrabold text-xs tracking-wider text-base-content/75 uppercase font-outfit">Active Contacts</span>
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
              <div className="text-center py-12 px-4 text-base-content/50">
                <IconMessage className="mx-auto text-base-content/20 mb-2" size={32} />
                <p className="text-xs font-semibold">No active chats found.</p>
                <p className="text-[10px] text-base-content/40 mt-1 leading-relaxed">
                  Go to Registered Events page and click "Contact Coordinator" to initiate a query!
                </p>
              </div>
            ) : (
              conversations.map((item) => {
                const isActive = item.program._id === selectedProgramId;
                return (
                  <button
                    key={item.program._id}
                    onClick={() => selectConversation(item)}
                    className={`w-full text-left p-3 rounded-2xl flex flex-col gap-1 transition ${
                      isActive
                        ? "bg-primary text-white shadow-md"
                        : "hover:bg-base-200 text-base-content"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <h4 className="font-bold text-xs truncate max-w-[170px] font-outfit">
                        {item.program.title}
                      </h4>
                      <span className={`text-[8px] font-mono ${isActive ? "text-white/70" : "text-base-content/40"}`}>
                        {new Date(item.lastMessageTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                    <span className={`text-[9px] truncate max-w-[210px] ${isActive ? "text-white/70" : "text-base-content/50"}`}>
                      {item.program.event?.title}
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
          
          {selectedProgram ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-base-300 bg-base-300/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
                    <IconUser size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-base-content font-outfit">
                      {selectedProgram.manager?.name || "Event Manager"}
                    </h3>
                    <p className="text-[10px] text-primary font-bold">
                      {selectedProgram.title} ({selectedProgram.event?.college?.name})
                    </p>
                  </div>
                </div>

                {/* Coordinator Contacts */}
                <div className="flex items-center gap-3 text-[10px] text-base-content/60 font-semibold border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                  {selectedProgram.manager?.phone && (
                    <span className="flex items-center gap-0.5">
                      <IconPhone size={12} /> {selectedProgram.manager.phone}
                    </span>
                  )}
                  {selectedProgram.manager?.email && (
                    <span className="flex items-center gap-0.5">
                      <IconMail size={12} /> {selectedProgram.manager.email}
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
                    <h4 className="font-bold text-xs text-base-content/70">Conversation Started</h4>
                    <p className="text-[10px] text-base-content/50 max-w-xs leading-relaxed">
                      Ask about timings, classroom venues, Wi-Fi keys, or check rules directly with the manager.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    // @ts-ignore
                    const isMyMsg = msg.senderId === user.id || msg.senderId === user._id;
                    return (
                      <div
                        key={msg._id || index}
                        className={`chat ${isMyMsg ? "chat-end" : "chat-start"}`}
                      >
                        <div className="chat-image avatar">
                          <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-xs font-bold text-base-content border border-base-300">
                            {isMyMsg ? "Me" : "M"}
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
                  placeholder="Type your query regarding room, timing etc..."
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
              <h3 className="font-bold text-base text-base-content font-outfit">Select a Conversation</h3>
              <p className="text-xs text-base-content/50 max-w-sm leading-relaxed">
                Choose a contact from the active threads list on the left to start chatting with the event coordinator immediately.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentMessagesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ChatContent />
    </Suspense>
  );
}
