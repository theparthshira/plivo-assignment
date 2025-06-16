import { Settings, Users } from "lucide-react";

export const SERVICE_TYPES = [
  { value: "SERVICE", label: "Web Service" },
  { value: "SOCKET", label: "Socket" },
  { value: "MESSAGE", label: "Messaging Service" },
  { value: "DB", label: "Database" },
];

export const SERVICE_MAP = {
  SERVICE: "Web Service",
  SOCKET: "Socket",
  MESSAGE: "Messaging Service",
  DB: "Database",
};

export const STATUS_TYPES = [
  { value: "OPERATIONAL", label: "Operational" },
  { value: "DEGRADED", label: "Degraded performance" },
  { value: "MINOR", label: "Minor issue" },
  { value: "MAJOR", label: "Major issue" },
  { value: "OFF", label: "Off" },
];

export const STATUS_MAP = {
  OPERATIONAL: "Operational",
  DEGRADED: "Degraded performance",
  MINOR: "Minor issue",
  MAJOR: "Major issue",
  OFF: "Off",
};

export const settingsMenuItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "team", label: "Team", icon: Users },
];

export const TEAM_ROLE = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
];
