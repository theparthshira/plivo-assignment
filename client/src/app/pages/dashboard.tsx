import { useEffect, useState } from "react";
import { User, Menu, X, Clipboard } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useAppDispatch, useAppSelector } from "../../lib/reduxHook";
import { CirclePlus } from "lucide-react";
import type { OrganisationOptions } from "../../types/organisation";
import { useLocation, useNavigate } from "react-router";
import {
  getOrganisation,
  updateCurrentOrganisation,
} from "../../redux/organisation";
import Services from "../../components/dashboard/service/Services";
import { getServices } from "../../redux/service";
import Settings from "../../components/dashboard/settings/Settings";
import Incidents from "../../components/dashboard/incidents/Incidents";
import { getAllIncidents } from "../../redux/incident";
import { getMemberRole } from "../../redux/member";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

const tabs = [
  { id: "services", label: "Services" },
  { id: "incidents", label: "Incidents" },
  // { id: "notifications", label: "Notifications" },
  { id: "settings", label: "Settings" },
];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const { organisations, user } = useAppSelector((state) => state.user);
  const { currentOrganisation } = useAppSelector((state) => state.organisation);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [organisationList, setOrganisationList] = useState<OrganisationOptions>(
    []
  );
  const [currentTab, setCurrentTab] = useState(
    queryParams.get("tab") || "services"
  );

  useEffect(() => {
    if (organisations && organisations?.length > 0) {
      setOrganisationList(
        organisations?.map((organisation) => ({
          label: organisation?.name,
          value: organisation?.id?.toString(),
        }))
      );
    }
  }, [organisations]);

  useEffect(() => {
    const id = queryParams.get("org") || "0";
    const tab = queryParams.get("tab") || "services";

    setCurrentTab(tab);
    getDashboardData(id, tab);
    dispatch(
      getMemberRole({
        user_id: user?.id,
        OrgID: parseInt(id),
      })
    );
  }, [location]);

  const getDashboardData = (id: string, tab: string) => {
    dispatch(getOrganisation(id));

    switch (tab) {
      case "services":
        dispatch(getServices(id));
        break;
      case "incidents":
        dispatch(getAllIncidents(id));
        break;
      case "notifications":
      case "settings":
        break;
    }
  };

  const updateOrganisation = (e: string) => {
    if (e === "add-new") navigate("/create-organisation");
    else {
      const currentOrganisation = organisations?.find(
        (organisation) => organisation.id?.toString() === e
      );
      navigate(`/dashboard?org=${e}&tab=services`);
      dispatch(updateCurrentOrganisation(currentOrganisation));
    }
  };

  const getCurrentTab = () => {
    if (currentTab === "incidents") {
      return <Incidents />;
    }

    if (currentTab === "notifications") {
      return <div>Notifications</div>;
    }

    if (currentTab === "settings") {
      return <Settings />;
    }

    return <Services />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    navigate(
                      `/dashboard?org=${queryParams.get("org")}&tab=${tab.id}`
                    )
                  }
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                    currentTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* User Icon */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger>
                    <Clipboard
                      className="text-gray-700"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `http://localhost:5173/client/home?org=${currentOrganisation?.id}`
                        )
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy status page URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div>
                <Select
                  value={currentOrganisation?.id?.toString()}
                  onValueChange={updateOrganisation}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organisationList?.map((organisation) => (
                      <SelectItem
                        key={organisation?.label}
                        value={organisation?.value}
                      >
                        {organisation.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="add-new">
                      <div className="flex gap-1">
                        <CirclePlus />
                        Create new organization
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <UserButton>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                  <User className="w-6 h-6 text-gray-600" />
                </button>
              </UserButton>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <nav className="flex flex-col space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCurrentTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 text-left font-medium text-sm transition-colors duration-200 rounded-md ${
                      currentTab === tab.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      {getCurrentTab()}
    </div>
  );
};

export default Dashboard;
