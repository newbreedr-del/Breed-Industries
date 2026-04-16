// Theme utility for consistent styling across the app
export const theme = {
  // Card styles
  card: 'glass-card',
  cardAccent: 'glass-card-accent',
  
  // Text styles
  text: {
    primary: 'text-white',
    secondary: 'text-white/70',
    muted: 'text-white/50',
    accent: 'text-accent',
  },
  
  // Background styles
  bg: {
    deep: 'bg-color-bg-deep',
    secondary: 'bg-color-bg-secondary',
    glass: 'bg-white/5',
    glassAccent: 'bg-accent/10',
  },
  
  // Border styles
  border: {
    default: 'border-white/10',
    accent: 'border-accent/20',
    hover: 'hover:border-white/20',
  },
  
  // Input styles
  input: 'w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all',
  
  // Button styles
  button: {
    primary: 'btn btn-primary',
    outline: 'btn btn-outline',
    ghost: 'btn btn-ghost',
  },
};

// Helper function to combine classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
