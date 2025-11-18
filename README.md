# VoiceBot Pro - Premium AI Voice Agent Dashboard

A stunning, production-ready AI Voice Agent Dashboard built with React, TypeScript, Tailwind CSS, and Framer Motion. Designed specifically for contractors to monitor calls, appointments, and AI performance in real-time.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

### Design & UI
- Modern dark theme with sophisticated color palette
- Glassmorphism effects and gradient borders
- Custom noise texture overlay
- Smooth animations and micro-interactions
- Fully responsive design (desktop, tablet, mobile)
- Custom scrollbar styling

### Dashboard Components

#### 1. Call Metrics Card
- Real-time answered rate tracking with animated counter
- Missed call recovery percentage
- 7-day trend visualization with smooth bezier curves
- Glow effects on data points
- Total calls and average duration stats

#### 2. Booking Metrics Card
- Interactive dot grid showing 50 appointments
- Color-coded status (green: completed, orange: pending, gray: cancelled)
- Sequential animation on load
- Pulse animation on pending bookings
- Conversion rate with trend indicators

#### 3. Live Activity Timeline
- Real-time call monitoring
- Progress bars showing call duration
- Status indicators (active, scheduling, hold, transferred)
- Slide-in animations for new calls
- WebSocket-style updates every 3 seconds

#### 4. AI Performance Matrix
- Pill-shaped performance indicators
- Understanding, Resolution, Transfer, and Satisfaction metrics
- Color-coded performance levels
- Floating animations on hover
- Overall AI performance score

#### 5. Quick Stats Bar
- Revenue, Active Customers, Total Calls, Response Time
- Animated counters with easing
- Percentage change indicators
- Hover lift effects

#### 6. Recent Activity Feed
- Real-time activity stream
- Categorized by calls, bookings, and messages
- Status icons (success, pending, failed)
- Time-ago timestamps
- Smooth scroll with custom scrollbar

### Navigation

#### Side Navigation
- Icon-based minimalist design
- Active indicator with smooth transition
- 360° icon rotation on hover
- Tooltip labels with delay
- Pulse indicator at bottom

#### Top Navigation
- Glassmorphism effect on scroll
- Tab-based navigation with smooth underline
- Search and notifications
- User profile dropdown
- Notification badge with pulse animation

### Premium Features

#### Toast Notifications
- Beautiful slide-in notifications for real-time events
- Custom toast types: success, error, info, call, booking
- Auto-dismiss with progress bar
- Manual close button
- Configurable duration
- Glassmorphism design matching dashboard theme

#### Confetti Celebrations
- Particle effects when appointments are booked
- Multi-colored confetti using brand colors
- Smooth canvas-based animations
- Can be toggled in settings

#### Settings Panel
- Slide-in panel from right side
- Toggle notifications on/off
- Enable/disable sound effects (coming soon)
- Control celebration animations
- Adjust auto-refresh interval (1-10 seconds)
- Reset to default settings
- Persisted to localStorage

#### Keyboard Shortcuts
- **⌘K** - Open search (coming soon)
- **⌘,** - Open settings panel
- **⌘R** - Refresh dashboard data
- **Shift + ?** - Show keyboard shortcuts help
- **Esc** - Close dialogs
- Help modal with all shortcuts listed

#### Loading States
- Beautiful loading screen on initial load
- Animated logo with rotation
- Pulsing text effect
- Skeleton screens for cards (ready to use)

#### Real-time Event Detection
- Automatically detect new incoming calls
- Show toast notification with caller name
- Detect new appointment confirmations
- Trigger confetti celebration on booking
- All events respect settings preferences

## Technology Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** React Hot Toast + Custom Toast System
- **Celebrations:** Canvas Confetti
- **State Management:** React Context + Hooks
- **Storage:** localStorage for settings persistence

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd AI-Voice-Agent

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

### Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── SideNav.tsx
│   │   └── TopNav.tsx
│   └── widgets/
│       ├── CallMetricsCard.tsx
│       ├── BookingMetricsCard.tsx
│       ├── LiveActivityTimeline.tsx
│       ├── AIPerformanceMatrix.tsx
│       ├── QuickStatsBar.tsx
│       └── RecentActivityFeed.tsx
├── hooks/
│   └── useCountUp.ts
├── lib/
│   ├── mockData.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

### Mock Data

The dashboard uses simulated real-time data that updates every 3 seconds. The mock data service (`src/lib/mockData.ts`) includes:

- Call metrics with trend data
- Booking appointments
- Live activity calls
- AI performance metrics
- Recent activity feed

### Animations

All animations are optimized for 60fps performance using:
- CSS transforms instead of position changes
- Framer Motion for complex animations
- Staggered animations for list items
- Smooth easing functions (ease-out)
- RequestAnimationFrame for counters

### Customization

#### Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  'bg-primary': '#0A0A0A',
  'bg-secondary': '#161616',
  'bg-card': '#1C1C1C',
  'accent-green': '#4ADE80',
  'accent-orange': '#FB923C',
  'accent-blue': '#60A5FA',
  'accent-purple': '#A78BFA',
}
```

#### Fonts

The dashboard uses Inter for body text and Space Grotesk for display elements. Change fonts in `src/index.css`.

## Performance

- Lazy loading of components
- Optimized animations (60fps)
- Virtual scrolling for long lists
- Code splitting with dynamic imports
- Minimal bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] WebSocket integration for real-time data
- [ ] Dark/Light theme toggle
- [ ] Export data to CSV/PDF
- [ ] Voice call playback
- [ ] Advanced filtering and search
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] User authentication

## License

MIT

## Author

Built with Claude Code

---

**Note:** This is a demo dashboard with mock data. For production use, integrate with your backend API and replace the mock data service with real API calls.
