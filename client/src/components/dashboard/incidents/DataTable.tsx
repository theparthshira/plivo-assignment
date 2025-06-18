import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useAppDispatch, useAppSelector } from "../../../lib/reduxHook";
import { Card, CardContent } from "../../ui/card";
import { getAllIncidents, updateIncident } from "../../../redux/incident";
import { useNavigate } from "react-router";
import { IncidentStatusTag } from "../../../lib/tags";

const DataTable = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { incidents } = useAppSelector((state) => state.incident);
  const { currentOrganisation } = useAppSelector((state) => state.organisation);

  const updateIncidentRow = async (
    id: number,
    status: string,
    description: string
  ) => {
    try {
      await dispatch(
        updateIncident({
          id: id,
          IncidentStatus: status === "OPEN" ? "CLOSE" : "OPEN",
          Description: description,
        })
      );
    } catch (err) {
      console.log("err =====", err);
    } finally {
      dispatch(getAllIncidents(currentOrganisation?.id));
    }
  };

  const handleIncident = (id: number) => {
    navigate(`/incident?org=${currentOrganisation?.id}&incident=${id}`);
  };

  return (
    <div className="w-full">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents?.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="cursor-pointer"
                  onClick={() => handleIncident(incident.id)}
                >
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>
                    S#{incident.service_id} {incident.description}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer capitalize-text"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateIncidentRow(
                        incident.id,
                        incident.incident_status,
                        incident.description
                      );
                    }}
                  >
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
  );
};

export default DataTable;
