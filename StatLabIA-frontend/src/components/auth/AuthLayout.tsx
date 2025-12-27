import React from 'react';
import { BarChart3 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--color-bg-secondary)] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[color:var(--color-primary)] opacity-[0.03] blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-[color:var(--color-secondary)] opacity-[0.03] blur-[100px]" />
      </div>

      <div className="w-full max-w-[440px] z-10 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-secondary)] rounded-xl flex items-center justify-center shadow-lg shadow-[color:var(--color-primary)]/20">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)]">
              StatLabAI
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)]">
            {title}
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            {subtitle}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-white/20 ring-1 ring-gray-200/50 backdrop-blur-xl">
          {children}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[color:var(--color-text-tertiary)]">
            &copy; {new Date().getFullYear()} StatLabAI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
