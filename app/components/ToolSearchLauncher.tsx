'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import ToolSearch from '@/app/components/ToolSearch';

interface ToolSearchLauncherProps {
  /** Visual style of the trigger button. */
  variant?: 'primary' | 'secondary';
  label?: string;
  className?: string;
}

/**
 * Small client island that owns the search-modal state.
 *
 * Keeping this separate lets the pages that host it stay server components,
 * so their markup and the full tool list are rendered as static HTML instead
 * of being hydrated from a client bundle.
 */
export default function ToolSearchLauncher({
  variant = 'primary',
  label = 'Find a calculator',
  className = '',
}: ToolSearchLauncherProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`.trim()}
      >
        <Search size={variant === 'primary' ? 16 : 14} /> {label}
      </button>
      <ToolSearch isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
