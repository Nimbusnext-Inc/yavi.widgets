# @yavi/widgets

A collection of reusable widget components for the YAVI library.

## Project Structure

```
src/
├── index.ts              # Main entry point - exports all widgets
└── widgets/
    ├── chatbot/          # ChatBot Widget
    │   ├── chatbot.ts    # Core ChatBot class
    │   ├── index.ts      # Widget exports
    │   ├── components/   # UI components
    │   │   └── chatbox.ts
    │   └── styles/       # Stylesheet assets
    │       └── chatbot.css
    └── [future widgets]  # Add more widgets here
```

## Getting Started

### Installation

```bash
npm install
```

### Building

```bash
npm run build
```

Output will be generated in the `dist/` directory.

### Adding a New Widget

1. Create a new directory under `src/widgets/`:
   ```bash
   mkdir -p src/widgets/your-widget/components
   mkdir -p src/widgets/your-widget/styles
   ```

2. Implement your widget files and create an `index.ts`:
   ```typescript
   export { YourWidget, /* types */ } from './your-widget';
   export { /* components */ } from './components/component-name';
   ```

3. Export from the main `src/index.ts`:
   ```typescript
   export * from './widgets/your-widget';
   ```

## Semantic Versioning

This package follows [Semantic Versioning 2.0.0](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

To release a new version:
```bash
npm version [patch|minor|major]
git push origin main --tags
```

## Current Widgets

### ChatBot
A simple chatbot widget for managing chat interactions.

**Usage:**
```typescript
import { ChatBot, ChatBox } from '@yavi/widgets';

const bot = new ChatBot({
  title: 'Support Bot',
  placeholder: 'Ask a question...',
  maxMessages: 50
});

const box = new ChatBox({
  title: 'Support Chat',
  placeholder: 'Type your message...',
  onSend: (message) => {
    bot.addMessage('user', message);
    // Handle message...
  }
});

box.render(document.getElementById('chat-container'));
```

## License

ISC
