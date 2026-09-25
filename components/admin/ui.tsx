'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function AdminModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-sm border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-serif text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-sm border border-border bg-card p-6 shadow-2xl">
        <h3 className="font-serif text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-sm border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-sm bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-sm border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
      />
    </div>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-sm border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
      />
    </div>
  );
}

export function AdminSelect({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AdminToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-secondary'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const styles = {
    primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
    secondary: 'border border-border text-foreground hover:border-accent/50',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function PageHeader({
  title,
  action,
  actionLabel,
}: {
  title: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="font-serif text-2xl font-bold">{title}</h1>
      {action && actionLabel && (
        <AdminButton onClick={action}>{actionLabel}</AdminButton>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}
