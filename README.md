# Message Composer - Multi-Device Preview

A rich text message composer built with React, TypeScript, and TipTap that provides live previews across multiple device types with localStorage persistence.

## Features

### Rich Text Editor (TipTap)
- ✅ Toolbar with formatting options:
  - Headers (H1, H2, H3)
  - Font Sizes (12px, 14px, 16px, 18px, 20px)
  - Bold and Italic formatting
  - Image Upload (base64 encoding)
  - YouTube Video Embedding
- ✅ Auto-focus on page load
- ✅ Clean, minimal interface

### Device Previews (Live Updates)
- ✅ 4 preview panels side-by-side:
  - **Web (Desktop)** - 800px width
  - **Tablet (iPad)** - 768px width
  - **Mobile App (Push Notification)** - 375px width with gradient background
  - **Mobile Web (Phone Browser)** - 375px width
- ✅ Each device renders content with appropriate styling (different widths, scaled fonts, responsive images)

### Saved Messages Sidebar
- ✅ Displays last 3 saved messages (most recent first)
- ✅ Highlights currently active message
- ✅ Click to load message into editor
- ✅ Shows relative timestamps (e.g., "5m ago", "2h ago")

### Message Persistence
- ✅ Mock 3-second delay when saving (with loading indicator)
- ✅ Keeps only last 3 messages (removes oldest when saving 4th)
- ✅ Loads active message on page refresh
- ✅ Uses localStorage for persistence

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **TipTap** - Rich text editor
- **TailwindCSS** - Styling
- **Vite** - Build tool

## Installation

All dependencies are already included in `package.json`. If you need to reinstall:

```bash
pnpm install
```

Required packages:
- `@tiptap/react`
- `@tiptap/starter-kit`
- `@tiptap/extension-image`
- `@tiptap/extension-youtube`
- `@reduxjs/toolkit`
- `react-redux`
- `tailwindcss`

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## Docker

```bash
# Build production image
docker build -t message-composer .

# Run container on http://localhost:4173
docker run --rm -p 4173:80 message-composer
```

The image uses a multi-stage build: Node + pnpm compile the Vite site, and Nginx serves the static assets. Update the container port mapping if deploying behind another reverse proxy.

## Project Structure

```
src/
├── components/
│   ├── MessageEditor.tsx      # TipTap rich text editor with toolbar
│   ├── DevicePreview.tsx       # Individual device preview component
│   ├── DevicePreviews.tsx      # Container for all device previews
│   ├── SavedMessagesSidebar.tsx # Sidebar with saved messages
│   └── SaveButton.tsx          # Save button with loading state
├── extensions/
│   └── FontSize.ts            # Custom TipTap extension for font sizes
├── store/
│   ├── store.ts               # Redux store configuration
│   ├── messageSlice.ts        # Redux slice for message state
│   └── hooks.ts               # Typed Redux hooks
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles with TipTap styles
```

## Usage

1. **Compose Message**: Type in the rich text editor. Use the toolbar to format text, add headers, change font sizes, upload images, or embed YouTube videos.

2. **Live Previews**: As you type, the content appears in real-time across all 4 device preview panels.

3. **Save Message**: Click the "Save Message" button. A 3-second loading indicator will show, then the message will be saved and appear in the sidebar.

4. **Load Saved Message**: Click on any saved message in the sidebar to load it back into the editor.

5. **Persistence**: Messages are automatically saved to localStorage. The active message will be restored when you refresh the page.

## Custom Features

- Custom FontSize extension for TipTap to support inline font size changes
- Device-specific styling in previews (e.g., mobile app has gradient background)
- Responsive layout that adapts to different screen sizes
- Clean UI with TailwindCSS styling

## Notes

- Images are stored as base64 data URLs
- Only the last 3 messages are kept in storage
- The mock save delay simulates an API call
- All styling is done with TailwindCSS utility classes
