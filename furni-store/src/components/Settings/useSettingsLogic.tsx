import { useState } from "react";
import { User } from "lucide-react";

export const useSettingsLogic = () => {
  const [activeTab, setActiveTab] = useState("account");

  const tabOptions = [
    { value: "account", label: "Account", icon: User },
  ];

  const getTabContent = (tabValue: string) => {
    switch (tabValue) {
      case "account":
        return "account";
      default:
        return "account";
    }
  };

  return {
    activeTab,
    setActiveTab,
    tabOptions,
    getTabContent,
  };
};
