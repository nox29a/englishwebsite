{
  "project": {
    "name": "English Learning Platform for ADHD Users",
    "purpose": "Web-based English learning application specifically designed for users with ADHD, focusing on minimalism, immediate gratification, distraction reduction, personalization, and adaptive learning support."
  },
  
  "design_philosophy": {
    "core_principles": [
      "Minimalist interface",
      "Immediate feedback",
      "Reduced cognitive load",
      "Personalized experience",
      "Consistent visual language",
      "Accessibility first"
    ],
    "adhd_considerations": [
      "Short attention span accommodation",
      "Reduction of visual distractions",
      "Clear visual hierarchy",
      "Immediate gratification systems",
      "Micro-interactions for engagement",
      "Flexible learning paths",
      "Optional calm mode for reduced animations and notifications"
    ]
  },
  
  "color_palette": {
    "primary": {
      "blue": "#3B82F6",
      "green": "#10B981",
      "soft_red": "#F87171",
      "soft_amber": "#FBBF24",
      "violet": "#8B5CF6",
      "turquoise": "#14B8A6"
    },
    "light_theme": {
      "background": "#FFFFFF",
      "text_primary": "#1F2937",
      "text_secondary": "#6B7280",
      "borders": "#E5E7EB",
      "surface": "#F9FAFB"
    },
    "dark_theme": {
      "background": "#111827",
      "text_primary": "#F3F4F6",
      "text_secondary": "#9CA3AF",
      "borders": "#374151",
      "surface": "#1F2937"
    }
  },
  
  "typography": {
    "font_family": "Inter, system-ui, sans-serif",
    "weights": [400, 500, 600, 700],
    "scale": {
      "h1": "2.5rem",
      "h2": "2rem",
      "h3": "1.5rem",
      "body": "1.125rem",
      "small": "0.875rem"
    },
    "line_height": "1.6",
    "max_line_length": "70 characters",
    "contrast_ratio": "4.5:1 minimum"
  },
  
  "spacing_layout": {
    "scale": "4px base unit",
    "spacing": {
      "xs": "4px",
      "sm": "8px",
      "md": "16px",
      "lg": "24px",
      "xl": "32px",
      "xxl": "48px"
    },
    "border_radius": {
      "small": "4px",
      "medium": "8px",
      "large": "12px",
      "full": "9999px"
    },
    "shadows": {
      "small": "0 1px 2px rgba(0, 0, 0, 0.05)",
      "medium": "0 4px 6px rgba(0, 0, 0, 0.1)",
      "large": "0 10px 15px rgba(0, 0, 0, 0.1)"
    },
    "max_content_width": "1200px"
  },
  
  "ui_components": {
    "buttons": {
      "primary": "bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2",
      "secondary": "bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg px-4 py-2",
      "tertiary": "bg-transparent hover:bg-gray-100 text-blue-600 border border-gray-300 rounded-lg px-4 py-2",
      "success": "bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2",
      "danger": "bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2",
      "ghost": "p-2 rounded-full hover:bg-gray-100 text-gray-600"
    },
    "cards": "bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700",
    "forms": {
      "input": "border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      "label": "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
      "placeholder": "text-gray-400 italic",
      "inline_validation": "real-time feedback with checkmark or error message"
    },
    "progress_bars": {
      "linear": {
        "container": "bg-gray-200 dark:bg-gray-700 rounded-full h-2",
        "fill": "bg-blue-600 rounded-full h-2 transition-all duration-300"
      },
      "segmented": "flex gap-1 items-center h-2 rounded-full overflow-hidden"
    }
  },
  
  "gamification_elements": {
    "badges": {
      "size": "64x64px",
      "animation": "optional bounce + confetti effect",
      "shape": "circular/oval"
    },
    "level_system": {
      "visualization": "progress bar with level number and growth iconography",
      "advancement": "animation + notification (reduced in calm mode)"
    },
    "notifications": {
      "position": "top-right",
      "timeout": "5000ms",
      "colors": "contextual based on type",
      "focus_mode": "delivers notifications only after session ends"
    }
  },
  
  "responsiveness": {
    "breakpoints": {
      "mobile": "max-width: 767px",
      "tablet": "min-width: 768px",
      "desktop": "min-width: 1024px",
      "large_desktop": "min-width: 1440px"
    },
    "mobile_first": true,
    "touch_targets": "min 44x44px",
    "gestures": "swipe left/right support for navigation on mobile"
  },
  
  "accessibility": {
    "standards": "WCAG 2.1 AA",
    "requirements": [
      "Clear focus indicators",
      "Comprehensive ARIA labels",
      "Full keyboard navigation",
      "Skip navigation links",
      "Alternative text for images"
    ],
    "contrast_ratios": {
      "normal_text": "4.5:1 minimum",
      "large_text": "3:1 minimum",
      "interactive_elements": "clear state differentiation"
    },
    "motion_preferences": "Respects prefers-reduced-motion system setting"
  },
  
  "adhd_specific_features": {
    "distraction_reduction": [
      "No auto-playing media",
      "Minimal purposeful animations",
      "Clean layout without unnecessary elements"
    ],
    "micro_interactions": [
      "Immediate action feedback",
      "Subtle confirmation animations",
      "Optional confirmation sounds"
    ],
    "content_structure": [
      "Short sessions (max 15 minutes)",
      "Clear module separation",
      "Pausable at any point",
      "Progressive disclosure of content"
    ],
    "focus_tools": [
      "Pomodoro-like timer (10–15 min focus mode)",
      "Session break reminders",
      "Calm mode with reduced effects and notifications"
    ]
  },
  
  "visual_style": {
    "aesthetic": "Modern flat design with subtle shadows",
    "icons": "Line icons (Lucide, Heroicons)",
    "inspirations": [
      "Duolingo (gamification)",
      "Headspace (calm interface)",
      "Notion (modularity)",
      "Forest App (focus tracking)"
    ]
  },
  
  "technical_requirements": {
    "performance": {
      "page_load": "< 3 seconds",
      "interaction_response": "< 100 milliseconds",
      "image_optimization": "WebP/AVIF formats",
      "lazy_loading": "Below-the-fold content"
    },
    "browser_support": [
      "Chrome (last 2 versions)",
      "Firefox (last 2 versions)",
      "Safari (last 2 versions)",
      "Edge (last 2 versions)"
    ]
  },
  
  "implementation_checklist": [
    "Theme system (light/dark)",
    "Responsive design (including large desktop)",
    "Gamification elements with calm mode option",
    "Accessibility features with motion reduction",
    "Performance optimization",
    "Cross-browser testing",
    "Mobile usability testing with gesture navigation",
    "User settings persistence",
    "Focus mode and session timer"
  ]
}
