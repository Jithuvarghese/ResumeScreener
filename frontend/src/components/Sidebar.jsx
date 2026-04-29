import { NavLink } from 'react-router-dom';
import { FileUp, LineChart, Table } from 'lucide-react';

const sidebarItems = [
  { to: '/', label: 'Overview', icon: LineChart },
  { to: '/upload', label: 'Process File', icon: FileUp },
  { to: '/results', label: 'Structured JSON', icon: Table },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white/80 px-4 py-6 backdrop-blur md:block">
      <div className="space-y-2">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Navigation</p>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand text-white shadow-soft'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
                ].join(' ')
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}