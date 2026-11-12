import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  Radio, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  ChevronDown,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { Badge } from '../common/Badge';

interface NavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const { user, isDemoUser, logout } = useAuth();
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-stone-900">AgriVision</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200/60">AI</span>
                </div>
                <span className="text-[10px] text-stone-500 font-medium tracking-wide -mt-0.5 hidden sm:block">Precision Agriculture Platform</span>
              </div>
            </Link>
          </div>

          {/* Center Telemetry / System Badges */}
          <div className="hidden md:flex items-center gap-3">
            {!isOnline ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-900 shadow-xs">
                <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Offline Mode (Cached Farms Active)</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100/80 border border-stone-200 text-xs font-medium text-stone-700">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>IoT Telemetry: <strong className="text-emerald-700">ESP32 Online</strong></span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-xs font-medium text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Polygon Blockchain: <strong className="text-emerald-900">Block #19842104</strong></span>
                </div>
              </>
            )}
          </div>

          {/* Right User & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isDemoUser && (
              <Badge variant="amber" size="sm" className="hidden sm:inline-flex">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Demo Mode
              </Badge>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setAlertOpen(!alertOpen)}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl relative transition-colors"
                title="Agricultural Advisories"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
              </button>

              {alertOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                    <span className="font-semibold text-xs text-stone-900 uppercase tracking-wider">Agro Advisories</span>
                    <Badge variant="emerald" size="sm">3 Active</Badge>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <p className="font-semibold text-emerald-900">Optimal Spraying Window</p>
                      <p className="text-emerald-700 mt-0.5">Wind speed low (7 km/h). Safe for foliar fungicide application until 11:00 AM.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                      <p className="font-semibold text-amber-900">Rain Alert (Thursday)</p>
                      <p className="text-amber-700 mt-0.5">65% chance of light showers in Nashik. Hold fertilizer top-dressing.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                      <p className="font-semibold text-blue-900">Blockchain Ledger Synced</p>
                      <p className="text-blue-700 mt-0.5">Soil test report #soil-001 notarized with SHA-256 digest on Polygon.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 border border-stone-200/70 transition-all text-left"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=059669&color=fff`}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-500/30"
                  />
                  <div className="hidden xl:flex flex-col pr-1">
                    <span className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[120px]">{user.fullName}</span>
                    <span className="text-[10px] text-stone-500 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden xl:block" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900">{user.fullName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                      <Badge variant="emerald" size="sm" className="mt-1 capitalize">
                        {user.role} Account
                      </Badge>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-600" />
                        Profile & Settings
                      </Link>
                      <Link
                        to="/reports"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Audits & Certificates
                      </Link>
                    </div>
                    <div className="pt-1 border-t border-stone-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                Sign In
              </Link>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
