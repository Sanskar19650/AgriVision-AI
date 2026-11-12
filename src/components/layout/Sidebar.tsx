import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  FlaskConical,
  ScanEye,
  Crosshair,
  Sparkles,
  CloudSun,
  MapPin,
  ShieldCheck,
  BotMessageSquare,
  FileBarChart2,
  Settings,
  Home,
  Sprout,
  Brain
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navSections = [
    {
      group: 'Core Operations',
      items: [
        { label: 'Farmer Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Farm Management', path: '/farms', icon: Tractor },
        { label: 'Soil Health IoT', path: '/soil', icon: FlaskConical, badge: 'Live' },
        { label: 'Farm GIS Mapping', path: '/mapping', icon: MapPin },
      ]
    },
    {
      group: 'AI & Precision Diagnostics',
      items: [
        { label: 'Disease Detection (CNN)', path: '/disease', icon: ScanEye },
        { label: 'Crop Damage (YOLO)', path: '/damage', icon: Crosshair },
        { label: 'Crop Advisor (RF)', path: '/recommend', icon: Sparkles },
        { label: 'AI Model Studio', path: '/model-studio', icon: Brain, badge: 'Custom' },
        { label: 'Gemini AI Assistant', path: '/assistant', icon: BotMessageSquare, badge: 'Flash' },
        { label: 'Weather & Advisory', path: '/weather', icon: CloudSun },
      ]
    },
    {
      group: 'Integrity & Governance',
      items: [
        { label: 'Blockchain Notary', path: '/blockchain', icon: ShieldCheck, badge: 'SHA-256' },
        { label: 'Reports & Audits', path: '/reports', icon: FileBarChart2 },
        { label: 'Profile & Settings', path: '/profile', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-stone-200/80 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div className="p-4 space-y-6">
          {/* Quick links header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Navigation</span>
            <NavLink 
              to="/" 
              onClick={onClose}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </NavLink>
          </div>

          {/* Navigation Groups */}
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                {section.group}
              </p>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-xs font-bold'
                            : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-900'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-emerald-100/70 text-emerald-800'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Agronomy Status & IoT Telemetry Card */}
        <div className="p-4 border-t border-stone-200/70 bg-emerald-50/50 m-3 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-950 text-xs font-bold">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Field Health Status</span>
          </div>
          <p className="text-[11px] text-emerald-800 mt-1 leading-snug">
            All 3 monitored plots calibrated with 24h soil moisture & disease surveillance.
          </p>
          <NavLink
            to="/farms"
            onClick={onClose}
            className="mt-2 block text-center py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors shadow-2xs"
          >
            Farming Calendar & Guide →
          </NavLink>
        </div>
      </aside>
    </>
  );
};
