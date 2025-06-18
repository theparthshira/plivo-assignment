import { Check, Activity, FileText, CircleX } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useEffect, useState } from "react";
import { getServiceDetails, getServices } from "../../redux/service";
import { useAppDispatch, useAppSelector } from "../../lib/reduxHook";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import IncidentForm from "../../components/dashboard/incidents/IncidentForm";
import { Button } from "../../components/ui/button";
import { getServiceIncident } from "../../redux/incident";
import { useNavigate } from "react-router";
import { useWebSocket } from "../../lib/socket";
import {
  IncidentStatusTag,
  ServiceStatusTag,
  updateServiceType,
} from "../../lib/tags";
import type { ServiceKey, StatusKey } from "../../utils/constant";

const currentDate = new Date().toLocaleString("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

export default function Clientequest() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    messages: socketMessages,
    connectWebSocket,
    removeReadMessage,
  } = useWebSocket();

  const { serviceDetail } = useAppSelector((state) => state.service);
  const { serviceIncidents } = useAppSelector((state) => state.incident);

  const [currentServiceDetail, setCurrentServiceDetail] =
    useState(serviceDetail);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const service_id = queryParams.get("service") || "0";
    const org_id = queryParams.get("org") || "0";

    dispatch(getServiceDetails(service_id));
    dispatch(getServices(org_id));
    dispatch(getServiceIncident(service_id));
    connectWebSocket(org_id);
  }, []);

  const handleIncident = (id: number) => {
    const queryParams = new URLSearchParams(location.search);
    const org_id = queryParams.get("org") || "0";

    navigate(`/incident?service=${id}&org=${org_id}&incident=${id}`);
  };

  useEffect(() => {
    const lastMessage = socketMessages[socketMessages?.length - 1];

    if (currentServiceDetail?.Service?.id === lastMessage?.ServiceID) {
      const logClone = Array.from(currentServiceDetail?.Logs || []);

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const localIsoString = `${now.getFullYear()}-${pad(
        now.getMonth() + 1
      )}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(
        now.getMinutes()
      )}:${pad(now.getSeconds())}Z`;

      logClone.unshift({
        id: lastMessage?.LogID,
        service_id: currentServiceDetail?.Service?.id || 0,
        service_status: lastMessage?.ServiceStatus,
        created_at: localIsoString,
      });

      const serviceClone = structuredClone(currentServiceDetail.Service);

      if (serviceClone) {
        serviceClone.service_status = lastMessage?.ServiceStatus;
      }

      setCurrentServiceDetail((state) => ({
        ...state,
        Logs: logClone,
        Service: serviceClone,
      }));

      removeReadMessage(lastMessage?.id);
    }
  }, [socketMessages]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex text-center md:text-left justify-between">
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Service:{" "}
            {/* <span className="underline">{currentOrganisation?.name}</span> */}
            <span className="underline">
              {currentServiceDetail?.Service?.name}
            </span>
            <p className="text-gray-600 text-sm sm:text-base">
              Type:{"  "}
              {updateServiceType(
                currentServiceDetail?.Service?.service_type as ServiceKey
              )}
            </p>
          </div>
          <IncidentForm>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white self-start sm:self-auto">
              Create Incident
            </Button>
          </IncidentForm>
        </div>

        {/* Status Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                {currentServiceDetail?.Service?.service_status ===
                "OPERATIONAL" ? (
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                    <CircleX className="w-5 h-5 text-red-600" />
                  </div>
                )}

                <ServiceStatusTag
                  status={
                    currentServiceDetail?.Service?.service_status as StatusKey
                  }
                />
              </div>
              <div className="text-sm text-gray-500 sm:text-right">
                {currentDate}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitors Section */}
        <Card className="shadow-sm">
          <CardContent className="p-8 md:p-12 max-h-96 overflow-auto">
            {currentServiceDetail?.Logs &&
            currentServiceDetail?.Logs?.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[200px]">
                        Timestamp (UTC)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentServiceDetail?.Logs?.map((log) => (
                      <TableRow key={log?.id}>
                        <TableCell>#{log?.id}</TableCell>
                        <TableCell>
                          <ServiceStatusTag
                            status={log?.service_status as StatusKey}
                          />
                        </TableCell>
                        <TableCell>{log?.created_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Activity className="w-16 h-16 text-gray-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No service logs
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base">
                    The status page has no connected logs.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notices Section */}
        <Card className="shadow-sm">
          <CardContent className="p-8 md:p-12 max-h-96 overflow-auto">
            {currentServiceDetail?.Maintenances &&
            currentServiceDetail?.Maintenances?.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[200px]">
                        Timestamp (UTC)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentServiceDetail?.Logs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>#{log.id}</TableCell>
                        <TableCell>{log.service_status}</TableCell>
                        <TableCell>{log.created_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <FileText className="w-16 h-16 text-gray-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No recent maintenances
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base">
                    There have been no future maintenances found.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-8 md:p-12 max-h-96 overflow-auto">
            <Table>
              <TableCaption>Click on status to update it.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceIncidents?.map((incident) => (
                  <TableRow
                    key={incident.id}
                    className="cursor-pointer"
                    onClick={() => handleIncident(incident.id)}
                  >
                    <TableCell className="font-medium">{incident.id}</TableCell>
                    <TableCell>
                      S#{incident.service_id} {incident.description}
                    </TableCell>
                    <TableCell>
                      <IncidentStatusTag
                        status={incident.incident_status || ""}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
