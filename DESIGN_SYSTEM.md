# Breed Industries Design System
**Version**: 2.0  
**Last Updated**: April 16, 2026

---

## 🎨 Brand Identity

### Core Values
- **Premium**: High-end, professional, trustworthy
- **Modern**: Tech-forward, innovative, cutting-edge
- **South African**: Local expertise, understanding of SA business landscape
- **Results-Driven**: Focus on growth, ROI, tangible outcomes

---

## 🌈 Color Palette

### Primary Colors
```css
/* Dark Backgrounds */
--color-bg-deep: #1A1A1B;           /* Main background */
--color-bg-secondary: #242426;      /* Secondary sections */
--color-bg-tertiary: #2D2D2F;       /* Cards, elevated surfaces */

/* Gold Accent */
--color-accent: #CA8114;            /* Primary gold */
--color-accent-light: #E5A835;      /* Hover states */
--color-accent-dark: #9B6310;       /* Active states */

/* Text Colors */
--color-text-primary: #FFFFFF;                  /* Headings, important text */
--color-text-secondary: rgba(255, 255, 255, 0.7);  /* Body text */
--color-text-muted: rgba(255, 255, 255, 0.5);      /* Subtle text */
--color-text-disabled: rgba(255, 255, 255, 0.3);   /* Disabled states */
```

### Semantic Colors
```css
/* Success */
--color-success: #10B981;
--color-success-bg: rgba(16, 185, 129, 0.1);

/* Error */
--color-error: #EF4444;
--color-error-bg: rgba(239, 68, 68, 0.1);

/* Warning */
--color-warning: #F59E0B;
--color-warning-bg: rgba(245, 158, 11, 0.1);

/* Info */
--color-info: #3B82F6;
--color-info-bg: rgba(59, 130, 246, 0.1);
```

### Glass Morphism
```css
/* Glass Card */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: 12px;

/* Glass Card Accent */
--glass-accent-bg: rgba(202, 129, 20, 0.1);
--glass-accent-border: rgba(202, 129, 20, 0.2);
```

---

## 📝 Typography

### Font Families
```css
/* Headings */
--font-heading: 'Montserrat', sans-serif;
/* Weights: 600 (SemiBold), 700 (Bold), 800 (ExtraBold) */

/* Body Text */
--font-body: 'Inter', sans-serif;
/* Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) */

/* Monospace (Code, Numbers) */
--font-mono: 'JetBrains Mono', monospace;
/* Weights: 400 (Regular), 500 (Medium), 700 (Bold) */
```

### Type Scale
```css
/* Headings */
.text-h1 { font-size: 3.5rem; line-height: 1.1; }    /* 56px */
.text-h2 { font-size: 2.5rem; line-height: 1.2; }    /* 40px */
.text-h3 { font-size: 2rem; line-height: 1.25; }     /* 32px */
.text-h4 { font-size: 1.5rem; line-height: 1.3; }    /* 24px */
.text-h5 { font-size: 1.25rem; line-height: 1.4; }   /* 20px */
.text-h6 { font-size: 1rem; line-height: 1.5; }      /* 16px */

/* Body */
.text-xl { font-size: 1.25rem; line-height: 1.6; }   /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.6; }  /* 18px */
.text-base { font-size: 1rem; line-height: 1.6; }    /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.5; }  /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1.5; }   /* 12px */
```

### Font Usage Guidelines
```typescript
// Headings
<h1 className="font-heading font-bold text-white">
<h2 className="font-heading font-bold text-white">

// Body Text
<p className="text-white/70">

// Accent Text
<span className="text-accent font-medium">

// Muted Text
<span className="text-white/50 text-sm">
```

---

## 🧩 Components

### Buttons

#### Primary Button
```tsx
<button className="btn btn-primary">
  Get Started
  <ChevronRight size={16} className="ml-1" />
</button>
```
**CSS**:
```css
.btn {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-color-bg-deep;
}

.btn-primary {
  @apply bg-accent text-color-bg-deep hover:bg-accent-light active:bg-accent-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5;
}
```

#### Outline Button
```tsx
<button className="btn btn-outline">
  Learn More
</button>
```
**CSS**:
```css
.btn-outline {
  @apply border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50;
}
```

#### Ghost Button
```tsx
<button className="btn btn-ghost">
  Cancel
</button>
```
**CSS**:
```css
.btn-ghost {
  @apply text-white/70 hover:text-white hover:bg-white/5;
}
```

---

### Cards

#### Glass Card
```tsx
<div className="glass-card p-6">
  <h3 className="text-xl font-heading font-bold text-white mb-4">
    Card Title
  </h3>
  <p className="text-white/70">
    Card content goes here
  </p>
</div>
```
**CSS**:
```css
.glass-card {
  @apply bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20;
}
```

#### Glass Card Accent
```tsx
<div className="glass-card-accent p-6">
  <h3 className="text-xl font-heading font-bold text-white mb-4">
    Featured Content
  </h3>
  <p className="text-white/70">
    Important information
  </p>
</div>
```
**CSS**:
```css
.glass-card-accent {
  @apply bg-accent/10 backdrop-blur-md border border-accent/20 rounded-xl shadow-lg transition-all duration-300 hover:bg-accent/15 hover:border-accent/30;
}
```

---

### Form Elements

#### Input Field
```tsx
<div className="form-group">
  <label className="form-label">Email Address</label>
  <input 
    type="email" 
    className="form-input"
    placeholder="you@example.com"
  />
</div>
```
**CSS**:
```css
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-white/70 text-sm font-medium mb-2;
}

.form-input {
  @apply w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all;
}

.form-input:hover {
  @apply border-white/20;
}
```

#### Textarea
```tsx
<textarea className="form-textarea" rows={4}>
</textarea>
```
**CSS**:
```css
.form-textarea {
  @apply form-input resize-none;
}
```

#### Select
```tsx
<select className="form-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```
**CSS**:
```css
.form-select {
  @apply form-input appearance-none cursor-pointer;
  background-image: url("data:image/svg+xml,..."); /* Dropdown arrow */
}
```

---

### Badges & Tags

#### Status Badge
```tsx
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Failed</span>
```
**CSS**:
```css
.badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-success/20 text-success border border-success/30;
}

.badge-warning {
  @apply bg-warning/20 text-warning border border-warning/30;
}

.badge-error {
  @apply bg-error/20 text-error border border-error/30;
}
```

---

## 📐 Spacing System

### Scale
```css
/* Spacing scale (based on 4px) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Usage
```tsx
// Section padding
<section className="py-20">

// Container padding
<div className="container px-4">

// Card padding
<div className="glass-card p-6">

// Element spacing
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 🎭 Effects & Animations

### Transitions
```css
/* Standard transition */
.transition-standard {
  @apply transition-all duration-300 ease-in-out;
}

/* Fast transition */
.transition-fast {
  @apply transition-all duration-150 ease-in-out;
}

/* Slow transition */
.transition-slow {
  @apply transition-all duration-500 ease-in-out;
}
```

### Hover Effects
```css
/* Lift on hover */
.hover-lift {
  @apply transition-transform duration-300 hover:-translate-y-1;
}

/* Glow on hover */
.hover-glow {
  @apply transition-shadow duration-300 hover:shadow-xl hover:shadow-accent/20;
}

/* Scale on hover */
.hover-scale {
  @apply transition-transform duration-300 hover:scale-105;
}
```

### Animations
```css
/* Fade in up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 🖼️ Layout Patterns

### Container
```tsx
<div className="container mx-auto px-4 max-w-7xl">
  {/* Content */}
</div>
```

### Grid Layouts
```tsx
// 3-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

// 12-column grid
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 lg:col-span-8">Main</div>
  <div className="col-span-12 lg:col-span-4">Sidebar</div>
</div>
```

### Flex Layouts
```tsx
// Center content
<div className="flex items-center justify-center min-h-screen">
  <div>Centered content</div>
</div>

// Space between
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>
```

---

## 🌐 Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Usage
```tsx
<div className="text-base md:text-lg lg:text-xl">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

---

## ✅ Component Checklist

When creating a new component, ensure:

- [ ] Uses brand colors (no white backgrounds unless intentional)
- [ ] Follows typography scale
- [ ] Includes hover/focus states
- [ ] Is responsive (mobile-first)
- [ ] Has proper spacing
- [ ] Uses glass-card for containers
- [ ] Includes loading states
- [ ] Has error states
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Consistent with existing components

---

## 🚫 Don'ts

### ❌ Avoid These Patterns:
```tsx
// DON'T: White backgrounds
<div className="bg-white">

// DON'T: Black text on dark background
<p className="text-black">

// DON'T: Inconsistent spacing
<div className="p-3 mb-5">

// DON'T: Inline styles
<div style={{ color: 'red' }}>

// DON'T: Hard-coded colors
<div className="bg-[#CA8114]">
```

### ✅ Do This Instead:
```tsx
// DO: Use glass cards
<div className="glass-card">

// DO: Use text utilities
<p className="text-white/70">

// DO: Use spacing scale
<div className="p-6 mb-8">

// DO: Use Tailwind classes
<div className="text-accent">

// DO: Use CSS variables
<div className="bg-accent">
```

---

## 📚 Resources

### Design Tools
- **Figma**: [Design files location]
- **Color Palette**: [Coolors.co link]
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Montserrat, Inter)

### Code Examples
- See `/src/components/layout/` for reference implementations
- Check `/src/app/page.tsx` for homepage patterns
- Review `/src/app/services/page.tsx` for content layouts

---

**Maintained by**: Breed Industries Dev Team  
**Questions**: Contact dev@thebreed.co.za
