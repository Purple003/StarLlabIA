import React from 'react';
import {
  LayoutDashboard,
  Upload,
  ClipboardCheck,
  Settings2,
  BrainCircuit,
  BarChart3,
  PieChart,
  Download,
  BookOpen,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'import', label: 'Import', icon: Upload },
  { id: 'cleaning', label: 'Cleaning Report', icon: ClipboardCheck },
  { id: 'preprocessing', label: 'Preprocessing', icon: Settings2 },
  { id: 'recommendation', label: 'Analysis Reco.', icon: BrainCircuit },
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'visualization', label: 'Visualization', icon: PieChart },
  { id: 'export', label: 'Export', icon: Download },
  { id: 'documentation', label: 'Documentation', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeScreen, onNavigate, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-[color:var(--color-bg-primary)] h-screen border-r border-[color:var(--color-border)] flex flex-col">
      <div className="p-6 border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-secondary)] rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-[color:var(--color-text-primary)]">StatLabAI</h2>
            <p className="text-xs text-[color:var(--color-text-tertiary)]">Data Analytics Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-[color:var(--color-primary)] text-white shadow-md'
                  : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-tertiary)]'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-[color:var(--color-border)]">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[color:var(--color-bg-secondary)] mb-2">
          <div className="w-8 h-8 bg-[color:var(--color-secondary)] rounded-full flex items-center justify-center text-white text-sm">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate font-medium text-[color:var(--color-text-primary)]">User Name</p>
            <p className="text-xs text-[color:var(--color-text-tertiary)] truncate">user@example.com</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-[color:var(--color-error)] hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
