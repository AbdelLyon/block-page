import { Device, DeviceConfig, Theme } from "@/types";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const DEVICES: Record<
  Device,
  { name: string; width: string; widthMedia?: string }
> = {
  Desktop: { name: "Desktop", width: "1200px" },
  Tablet: { name: "Tablet", width: "768px", widthMedia: "768px" },
  Mobile: { name: "mobile", width: "375px", widthMedia: "375px" },
};
export const DeviceSwitcher: React.FC<{
  theme: Theme;
  activeDevice: Device;
  handleDeviceChange: (device: Device) => void;
}> = ({ theme, activeDevice, handleDeviceChange }) => {
  const DeviceIcon = {
    Desktop: Monitor,
    Tablet: Tablet,
    Mobile: Smartphone,
  };

  return (
    <div
      className="flex items-center space-x-1 border-r pr-4"
      style={{ borderColor: theme.border }}
    >
      {(Object.entries(DEVICES) as [Device, DeviceConfig][]).map(
        ([device, config]) => {
          const Icon = DeviceIcon[device];
          return (
            <button
              key={device}
              onClick={() => handleDeviceChange(device)}
              className={`p-1.5 rounded transition-colors ${
                activeDevice === device ? "bg-blue-50" : "hover:bg-gray-100"
              }`}
              title={config.name}
            >
              <Icon
                className="w-5 h-5"
                style={{
                  color:
                    activeDevice === device
                      ? theme.primary
                      : theme.text.secondary,
                }}
              />
            </button>
          );
        },
      )}
    </div>
  );
};
