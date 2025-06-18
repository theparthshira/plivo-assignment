import { cn } from "../utils/cn";
import {
  SERVICE_MAP,
  STATUS_MAP,
  type ServiceKey,
  type StatusKey,
} from "../utils/constant";

export const IncidentStatusTag = ({ status }: { status: string }) => {
  return (
    <span
      className={cn(
        "font-bold text-lg px-1 rounded-sm text-white",
        status === "CLOSE" ? "bg-red-500" : "bg-green-800"
      )}
    >
      {status === "CLOSE" ? "Close" : "Open"}
    </span>
  );
};

export const ServiceStatusTag = ({ status }: { status: StatusKey }) => {
  const colorMap = {
    OPERATIONAL: "bg-green-800",
    DEGRADED: "bg-yellow-300",
    MINOR: "bg-orange-400",
    MAJOR: "bg-orange-800",
    OFF: "bg-red-800",
  };

  return (
    <span
      className={cn(
        "font-bold text-lg px-1 rounded-sm text-white",
        colorMap[status]
      )}
    >
      {STATUS_MAP[status]}
    </span>
  );
};

export const updateServiceType = (type: ServiceKey) => {
  return SERVICE_MAP[type];
};
