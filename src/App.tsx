import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { clearActiveMessage } from './store/messageSlice';
import type { Message } from './store/messageSlice';
import MessageEditor from './components/MessageEditor';
import DevicePreviews from './components/DevicePreviews';
import SavedMessagesSidebar from './components/SavedMessagesSidebar';
import SaveButton from './components/SaveButton';
import { Button } from './components/ui/Button';

function App() {
  const [editorContent, setEditorContent] = useState('');
  const [loadContent, setLoadContent] = useState<string | null>(null);
  
  const dispatch = useAppDispatch();
  const activeMessageId = useAppSelector((state) => state.message.activeMessageId);
  const messages = useAppSelector((state) => state.message.messages);

  useEffect(() => {
    if (activeMessageId) {
      const message = messages.find((msg) => msg.id === activeMessageId);
      if (message) {
        setLoadContent(message.content);
        setEditorContent(message.content);
      }
    }
  }, [activeMessageId, messages]);

  const handleContentChange = (content: string) => {
    setEditorContent(content);
  };

  const handleMessageSelect = (message: Message) => {
    setLoadContent(message.content);
    setEditorContent(message.content);
  };

  const handleSaveComplete = (isNewMessage: boolean) => {
    // Only clear editor if creating a new message
    // If updating existing message, keep it loaded
    if (isNewMessage) {
      setEditorContent('');
      setLoadContent(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 rounded-lg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 rounded-t-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Message Composer</h1>
          <p className="text-sm text-gray-600 mt-1">Create and preview messages across all devices</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Editor Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-800">Compose Message</h2>
                <div className="flex items-center gap-2">
                  {activeMessageId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        dispatch(clearActiveMessage());
                        setEditorContent('');
                        setLoadContent(null);
                      }}
                      title="Start new message"
                    >
                      New Message
                    </Button>
                  )}
                  <SaveButton 
                    content={editorContent} 
                    activeMessageId={activeMessageId}
                    onSaveComplete={handleSaveComplete} 
                  />
                </div>
              </div>
              <MessageEditor
                initialContent={loadContent || undefined}
                activeMessageId={activeMessageId}
                onContentChange={handleContentChange}
              />
            </div>

            {/* Device Previews Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Live Previews</h2>
              <DevicePreviews content={editorContent} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SavedMessagesSidebar onMessageSelect={handleMessageSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
