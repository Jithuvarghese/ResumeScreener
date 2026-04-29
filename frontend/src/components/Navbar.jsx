import { NavLink } from 'react-router-dom';
import { Sparkles, Upload, FileText } from 'lucide-react';

const navItems = [
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/results', label: 'Results', icon: FileText },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white shadow-soft">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Resume Screener</p>
            <h1 className="text-lg font-semibold text-ink">Resume Screening & Match Analysis</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-ink text-white shadow-soft'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
                  ].join(' ')
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}