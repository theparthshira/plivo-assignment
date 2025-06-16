import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Settings as SettingsIcon, Users } from "lucide-react";
import { settingsMenuItems } from "../../../utils/constant";
import GeneralSetting from "./General";
import TeamSetting from "./Team";
import { useAppDispatch } from "../../../lib/reduxHook";
import { getMembers } from "../../../redux/member";

const Settings = () => {
  const dispatch = useAppDispatch();
  const [activeSettingsTab, setActiveSettingsTab] = useState("general");

  const renderSettingsContent = () => {
    switch (activeSettingsTab) {
      case "team":
        return <TeamSetting />;
      default:
        return <GeneralSetting />;
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const org_id = queryParams.get("org") || "0";

    dispatch(getMembers(org_id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Settings</h3>
              </div>
              <nav className="p-2">
                {settingsMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        activeSettingsTab === item.id
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {renderSettingsContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
