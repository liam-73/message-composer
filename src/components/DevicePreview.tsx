import { useMemo } from 'react';

interface DevicePreviewProps {
  content: string;
  deviceType: 'web' | 'tablet' | 'mobile-app' | 'mobile-web';
  width: number;
  height?: number;
}

const DevicePreview = ({
  content,
  deviceType,
  width,
  height = 600,
}: DevicePreviewProps) => {
  const previewContent = useMemo(() => {
    if (!content || content === '<p></p>' || content.trim() === '') {
      return '<div class="p-5 text-gray-400 text-center">No content yet</div>';
    }

    // Add device-specific styling to the content - scoped to prevent leaking
    const baseStyle = `
      <style>
        .device-preview-content * {
          box-sizing: border-box;
        }
        .device-preview-content {
          margin: 0;
          padding: ${deviceType === 'mobile-app' ? '20px' : '16px'};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: ${deviceType === 'mobile-app' ? 'white' : '#333'};
          font-size: ${deviceType === 'mobile-app' || deviceType === 'mobile-web' ? '14px' : '16px'};
          width: 100%;
          word-wrap: break-word;
          white-space: pre-wrap;
          min-height: 100%;
          ${deviceType === 'mobile-app' 
            ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
            : 'background: #ffffff;'
          }
        }
        .device-preview-content p {
          margin: 0.5em 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .device-preview-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
          display: block;
        }
        .device-preview-content iframe {
          max-width: 100%;
          width: 100%;
          border-radius: 8px;
          margin: 1em 0;
          display: block;
        }
        .device-preview-content h1 {
          font-size: ${deviceType === 'mobile-app' || deviceType === 'mobile-web' ? '24px' : '32px'};
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          font-weight: bold;
          line-height: 1.2;
        }
        .device-preview-content h2 {
          font-size: ${deviceType === 'mobile-app' || deviceType === 'mobile-web' ? '20px' : '24px'};
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          font-weight: bold;
          line-height: 1.3;
        }
        .device-preview-content h3 {
          font-size: ${deviceType === 'mobile-app' || deviceType === 'mobile-web' ? '18px' : '20px'};
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          font-weight: bold;
          line-height: 1.4;
        }
        .device-preview-content strong {
          font-weight: bold;
        }
        .device-preview-content em {
          font-style: italic;
        }
      </style>
      <div class="device-preview-content">
    `;

    return baseStyle + content + '</div>';
  }, [content, deviceType, width]);

  // Device-specific Tailwind classes
  const deviceClasses = {
    web: {
      border: 'border-gray-200',
      bg: 'bg-white',
      screen: 'bg-white',
    },
    tablet: {
      border: 'border-gray-300',
      bg: 'bg-gray-50',
      screen: 'bg-white',
    },
    'mobile-app': {
      border: 'border-indigo-500',
      bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      screen: 'bg-transparent',
    },
    'mobile-web': {
      border: 'border-gray-400',
      bg: 'bg-white',
      screen: 'bg-white',
    },
  }[deviceType];

  const isMobile = deviceType === 'mobile-app' || deviceType === 'mobile-web';

  return (
    <div className="flex flex-col items-center w-full">
      {/* Device Frame */}
      <div
        className={`
          rounded-lg overflow-hidden shadow-xl border-4 relative isolate
          ${deviceClasses.border}
          ${deviceClasses.bg}
        `}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          isolation: 'isolate',
          contain: 'layout style paint',
        }}
      >
        {/* Screen */}
        <div
          className={`
            w-full h-full overflow-auto isolate
            ${deviceClasses.screen}
          `}
          style={{ isolation: 'isolate' }}
        >
          <div
            className="w-full min-h-full"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        </div>
        
        {/* Device Frame Accents */}
        {isMobile && (
          <>
            {/* Top notch simulation */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl opacity-20" />
            {/* Bottom home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-30" />
          </>
        )}
      </div>
    </div>
  );
};

export default DevicePreview;
