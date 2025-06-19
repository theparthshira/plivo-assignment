import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/reduxHook";
import { getServices } from "../../redux/service";
import { getOrganisation } from "../../redux/organisation";
import IncidentForm from "../../components/dashboard/incidents/IncidentForm";
import { Button } from "../../components/ui/button";
import { useWebSocket } from "../../lib/socket";
import { ServiceStatusTag, updateServiceType } from "../../lib/tags";
import type { ServiceKey, StatusKey } from "../../utils/constant";

export default function ClientHome() {
  const dispatch = useAppDispatch();
  const {
    messages: socketMessages,
    connectWebSocket,
    removeReadMessage,
  } = useWebSocket();

  const { services } = useAppSelector((state) => state.service);
  const { currentOrganisation } = useAppSelector((state) => state.organisation);

  const [currentServices, setCurrentServices] = useState(services);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const org_id = queryParams.get("org") || "0";

    dispatch(getServices(org_id));
    dispatch(getOrganisation(org_id));
    connectWebSocket(org_id);
  }, []);

  useEffect(() => {
    setCurrentServices(services);
  }, [services]);

  useEffect(() => {
    const lastMessage = socketMessages[socketMessages?.length - 1];

    if (lastMessage?.Type === "data") {
      const servicesClone = Array.from(currentServices || []).map((service) => {
        console.log("service.id =====", service.id);
        console.log("lastMessage?.ServiceID =====", lastMessage?.ServiceID);

        if (service.id === lastMessage?.ServiceID) {
          return {
            ...service,
            service_status: lastMessage?.ServiceStatus,
            service_type: lastMessage?.ServiceType,
          };
        } else {
          return service;
        }
      });

      setCurrentServices(servicesClone);
      removeReadMessage(lastMessage?.id);
    } else {
      dispatch(getServices(currentOrganisation?.id));
    }
  }, [socketMessages]);

  const handleService = (id: number) => {
    const queryParams = new URLSearchParams(location.search);
    const org_id = queryParams.get("org") || "0";

    window.location.href = `/client/request?service=${id}&org=${org_id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center md:text-left flex justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Organisation:{" "}
            <span className="underline">{currentOrganisation?.name}</span>
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
            <Table>
              <TableCaption>A list of this organisation services.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentServices?.map((service) => (
                  <TableRow
                    key={service.id}
                    className="cursor-pointer"
                    onClick={() => handleService(service.id || 0)}
                  >
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>
                      {updateServiceType(service.service_type as ServiceKey)}
                    </TableCell>
                    <TableCell>
                      <ServiceStatusTag
                        status={service.service_status as StatusKey}
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
