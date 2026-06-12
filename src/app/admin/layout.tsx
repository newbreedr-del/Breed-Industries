/**
 * Admin layout — wraps every /admin page.
 *
 * Mounts the ⌘K Command Bar globally so the super-agent is one keystroke away
 * from anywhere in the admin panel. Auth is enforced by src/middleware.ts, so
 * this layout stays presentational.
 */

import CommandBar from '@/components/agent/CommandBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CommandBar />
    </>
  );
}
