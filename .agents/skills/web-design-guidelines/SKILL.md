---
name: web-design-guidelines
description: Premium UI/UX design guidelines for web applications. Use when building or improving web interfaces to ensure professional, modern, accessible design.
---

# Web Design Guidelines

## Core Principles

### Visual Hierarchy
- Use size, weight, and color to guide the eye
- Most important elements should be visually dominant
- Group related items together (Gestalt proximity)

### Color System
- Define a primary, secondary, and accent color
- Use semantic colors: success (green), warning (amber), danger (red)
- Maintain 4.5:1 contrast ratio for accessibility (WCAG AA)
- Dark backgrounds: use rgba() for glass/layered effects

### Typography
- Use Google Fonts (Inter, Plus Jakarta Sans, or Outfit for modern feel)
- Scale: 12px / 14px / 16px / 20px / 24px / 32px / 48px
- Body text: 16px, line-height 1.6
- Never use more than 2 font families

### Spacing
- Use 4px grid: 4, 8, 12, 16, 24, 32, 48, 64px
- Consistent padding inside cards: 24px desktop, 16px mobile
- Section spacing: 48-96px

### Components
- Cards: border-radius 12-16px, subtle box-shadow
- Buttons: min 44px height (touch target), border-radius 8px
- Inputs: 48px height, clear focus ring, error states
- Icons: use consistent set (Lucide, Heroicons, or Phosphor)

### Motion
- Transitions: 150-300ms ease
- Use `transform` and `opacity` (GPU-accelerated)
- Avoid animations on scroll unless subtle

### Responsive
- Mobile-first CSS
- Breakpoints: 640px, 768px, 1024px, 1280px
- Stack columns on mobile, side-by-side on desktop

## Premium Patterns to Use
- Glassmorphism: `backdrop-filter: blur(10px)` + semi-transparent background
- Gradient borders: using `border-image` or pseudo-elements
- Micro-animations on hover: `transform: translateY(-2px)` + shadow increase
- Animated gradients for hero sections
