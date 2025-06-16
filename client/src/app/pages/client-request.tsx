import { Check, Activity, FileText, CircleX } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useEffect } from "react";
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

  const { serviceDetail } = useAppSelector((state) => state.service);
  const { serviceIncidents } = useAppSelector((state) => state.incident);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const service_id = queryParams.get("service") || "0";
    const org_id = queryParams.get("org") || "0";

    dispatch(getServiceDetails(service_id));
    dispatch(getServices(org_id));
    dispatch(getServiceIncident(service_id));
  }, []);

  const handleIncident = (id: number) => {
    const queryParams = new URLSearchParams(location.search);
    const org_id = queryParams.get("org") || "0";

    navigate(`/incident?service=${id}&org=${org_id}&incident=${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex text-center md:text-left justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Service:{" "}
            {/* <span className="underline">{currentOrganisation?.name}</span> */}
            <span className="underline">{serviceDetail?.Service?.name}</span>
          </h1>
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
                {serviceDetail?.Service?.service_status === "OPERATIONAL" ? (
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                    <CircleX className="w-5 h-5 text-red-600" />
                  </div>
                )}
                <span className="text-lg font-semibold text-gray-900">
                  {serviceDetail?.Service?.service_status}
                </span>
              </div>
              <div className="text-sm text-gray-500 sm:text-right">
                {currentDate}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitors Section */}
        <Card className="shadow-sm">
          <CardContent className="p-8 md:p-12">
            {serviceDetail?.Logs && serviceDetail?.Logs?.length > 0 ? (
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
                    {serviceDetail?.Logs?.map((log) => (
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
          <CardContent className="p-8 md:p-12">
            {serviceDetail?.Maintenances &&
            serviceDetail?.Maintenances?.length > 0 ? (
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
                    {serviceDetail?.Logs?.map((log) => (
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
          <CardContent className="p-6">
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
                    <TableCell>{incident.incident_status}</TableCell>
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
