import { Activity } from "lucide-react";
import { Button } from "../../ui/button";
import DataTable from "./DataTable";
import { useAppSelector } from "../../../lib/reduxHook";
import IncidentForm from "./IncidentForm";

const Incidents = () => {
  const { incidents } = useAppSelector((state) => state.incident);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Incidents
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Overview of all your incidents.
          </p>
        </div>
        <IncidentForm>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white self-start sm:self-auto">
            Create
          </Button>
        </IncidentForm>
      </div>

      {/* Empty State */}
      {incidents && incidents?.length > 0 ? (
        <DataTable />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 py-12 sm:py-16">
          <div className="text-center px-4">
            {/* Icon */}
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-4 flex items-center justify-center">
              <Activity
                className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                strokeWidth={1.5}
              />
            </div>

            {/* Empty State Text */}
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No services
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              Create your first service
            </p>

            <IncidentForm>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Create
              </Button>
            </IncidentForm>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;
