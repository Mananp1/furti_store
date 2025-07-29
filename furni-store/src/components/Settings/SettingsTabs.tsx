import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";

interface TabOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  tabOptions: TabOption[];
}

export const SettingsTabs = ({
  activeTab,
  onTabChange,
  tabOptions,
}: SettingsTabsProps) => {
  // If there's only one tab, don't show the tab navigation
  if (tabOptions.length <= 1) {
    return null;
  }

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="sm:hidden mb-6">
        <Select value={activeTab} onValueChange={onTabChange}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {tabOptions.find((tab) => tab.value === activeTab)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tabOptions.map((tab) => {
              const Icon = tab.icon;
              return (
                <SelectItem key={tab.value} value={tab.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:block">
        <Tabs
          value={activeTab}
          onValueChange={onTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 gap-1">
            {tabOptions.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </>
  );
};
