import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import DevicePreview from './DevicePreview';
import { Card, CardContent } from './ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';

interface DevicePreviewsProps {
  content: string;
}

type DeviceTab = 'web' | 'tablet' | 'mobile-app' | 'mobile-web';

const DevicePreviews = ({ content }: DevicePreviewsProps) => {
  const [activeTab, setActiveTab] = useState<DeviceTab>('web');
  
  const activeMessage = useAppSelector((state) => {
    const activeId = state.message.activeMessageId;
    if (!activeId) return null;
    return state.message.messages.find((msg) => msg.id === activeId);
  });

  const displayContent = content || activeMessage?.content || '';

  const devices: Array<{
    type: DeviceTab;
    name: string;
    icon: string;
    width: number;
    height: number;
  }> = [
    { type: 'web', name: 'Web (Desktop)', icon: '🖥️', width: 800, height: 600 },
    { type: 'tablet', name: 'Tablet (iPad)', icon: '📱', width: 768, height: 600 },
    { type: 'mobile-app', name: 'Mobile App (Push)', icon: '📲', width: 375, height: 700 },
    { type: 'mobile-web', name: 'Mobile Web', icon: '🌐', width: 375, height: 700 },
  ];

  return (
    <Card className="w-full overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as DeviceTab)}
        className="gap-0"
      >
        <div className="border-b border-gray-200 bg-gray-50">
          <TabsList className="flex w-full border-none bg-transparent p-0">
            {devices.map((device) => (
              <TabsTrigger
                key={device.type}
                value={device.type}
                icon={device.icon}
                className="px-4 md:px-6 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                <span className="hidden sm:inline">{device.name}</span>
                <span className="sm:hidden">{device.name.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {devices.map((device) => (
          <TabsContent key={device.type} value={device.type}>
            <CardContent className="p-4 md:p-6 flex justify-center bg-gray-50 min-h-[600px] overflow-auto">
              <DevicePreview
                content={displayContent}
                deviceType={device.type}
                width={device.width}
                height={device.height}
              />
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default DevicePreviews;
