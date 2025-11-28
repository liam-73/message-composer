import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadMessage } from '../store/messageSlice';
import type { Message } from '../store/messageSlice';
import { Card } from './ui/Card';

interface SavedMessagesSidebarProps {
  onMessageSelect: (message: Message) => void;
}

const SavedMessagesSidebar = ({ onMessageSelect }: SavedMessagesSidebarProps) => {
  const messages = useAppSelector((state) => state.message.messages);
  const activeMessageId = useAppSelector((state) => state.message.activeMessageId);
  const dispatch = useAppDispatch();

  const handleMessageClick = (message: Message) => {
    dispatch(loadMessage(message.id));
    onMessageSelect(message);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (messages.length === 0) {
    return (
      <Card className="w-full p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Saved Messages</h2>
        <p className="text-gray-500 text-sm">No saved messages yet. Save your first message to see it here.</p>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Saved Messages</h2>
      <div className="space-y-2">
        {messages.map((message) => {
          const isActive = message.id === activeMessageId;
          const preview = stripHtml(message.content).substring(0, 80);
          
          return (
            <button
              key={message.id}
              onClick={() => handleMessageClick(message)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className={`text-xs font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {formatDate(message.timestamp)}
                </span>
                {isActive && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className={`text-sm ${
                isActive ? 'text-gray-800' : 'text-gray-600'
              } line-clamp-2`}>
                {preview || '(Empty message)'}
                {preview.length >= 80 && '...'}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default SavedMessagesSidebar;

