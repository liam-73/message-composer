import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateMessageContent } from '../store/messageSlice';
import { FontSize } from '../extensions/FontSize';
import { Card, CardContent } from './ui/Card';

interface MessageEditorProps {
  initialContent?: string;
  activeMessageId?: string | null;
  onContentChange?: (content: string) => void;
}

const MessageEditor = ({ initialContent = '', activeMessageId, onContentChange }: MessageEditorProps) => {
  const dispatch = useAppDispatch();
  const lastInitialContentRef = useRef<string>('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      FontSize,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({
        height: 480,
        controls: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[400px] p-4 tiptap-editor',
        'data-placeholder': 'Start typing your message...',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (activeMessageId) {
        dispatch(updateMessageContent({ id: activeMessageId, content: html }));
      }
      onContentChange?.(html);
    },
    autofocus: true,
  });

  useEffect(() => {
    if (editor && initialContent !== undefined && initialContent !== null) {
      if (initialContent !== lastInitialContentRef.current) {
        if (initialContent === '') {
          editor.commands.clearContent();
        } else {
          editor.commands.setContent(initialContent, { emitUpdate: false });
        }
        lastInitialContentRef.current = initialContent;
      }
    }
  }, [editor, initialContent, activeMessageId]);

  if (!editor) {
    return null;
  }

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const setFontSize = (size: number) => {
    editor.chain().focus().setFontSize(size.toString()).run();
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleYoutubeEmbed = () => {
    const url = prompt('Enter YouTube URL:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2 items-center bg-gray-50">
        {/* Headers */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => toggleHeading(1)}
            className={`px-3 py-1.5 text-sm font-semibold rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => toggleHeading(2)}
            className={`px-3 py-1.5 text-sm font-semibold rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => toggleHeading(3)}
            className={`px-3 py-1.5 text-sm font-semibold rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
            }`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        {/* Font Sizes */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          {[12, 14, 16, 18, 20].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className="px-2 py-1.5 text-xs rounded hover:bg-gray-200 transition-colors"
              title={`${size}px`}
            >
              {size}px
            </button>
          ))}
        </div>

        {/* Bold & Italic */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-300 font-bold' : ''
            }`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors italic ${
              editor.isActive('italic') ? 'bg-gray-300' : ''
            }`}
            title="Italic"
          >
            I
          </button>
        </div>

        {/* Image Upload */}
        <button
          onClick={handleImageUpload}
          className="px-3 py-1.5 text-sm rounded hover:bg-gray-200 transition-colors"
          title="Upload Image"
        >
          🖼️ Image
        </button>

        {/* YouTube Embed */}
        <button
          onClick={handleYoutubeEmbed}
          className="px-3 py-1.5 text-sm rounded hover:bg-gray-200 transition-colors"
          title="Embed YouTube Video"
        >
          ▶️ YouTube
        </button>
      </div>

      {/* Editor Content */}
      <CardContent className="p-4">
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  );
};

export default MessageEditor;
