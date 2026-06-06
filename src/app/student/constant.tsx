import { SideNavItem } from "@/Types";
import {
  IconLayoutDashboard,
  IconCalendarEvent,
  IconTrophy,
  IconUser,
  IconSettings,
  IconMapPin,
  IconMessage,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/student/dashboard",
    icon: <IconLayoutDashboard width="22" height="22" />,
  },
  {
    title: "Ongoing Events",
    path: "/student/ongoing-events",
    icon: <IconCalendarEvent width="22" height="22" />,
  },
  {
    title: "Registered Events",
    path: "/student/registered-events",
    icon: <IconTrophy width="22" height="22" />,
  },
  {
    title: "Location Finder",
    path: "/student/location-finder",
    icon: <IconMapPin width="22" height="22" />,
  },
  {
    title: "Messages",
    path: "/student/messages",
    icon: <IconMessage width="22" height="22" />,
  },
  {
    title: "Profile",
    path: "/student/profile",
    icon: <IconUser width="22" height="22" />,
  },
  {
    title: "Settings",
    path: "/student/settings",
    icon: <IconSettings width="22" height="22" />,
  },
];

