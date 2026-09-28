import React from 'react';
import { useBilling } from '../context/BillingContext';
import { Volume2, VolumeX, Clock, PauseCircle, ShoppingBag } from 'lucide-react';
import { ActiveTab } from '../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    settings,
    updateSettings,
    heldOrders,
    setIsHoldModalOpen,
    cart,
    todayStats,
  } = useBilling();

  const [currentTime, setCurrentTime] = React.useState<string>('');

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks: { id: ActiveTab; label: string; badge?: number }[] = [
    { id: 'pos', label: 'POS Billing' },
    { id: 'kds', label: 'Kitchen KDS' },
    { id: 'history', label: 'Past Bills' },
    { id: 'analytics', label: 'Shift Sales' },
    { id: 'menu', label: 'Menu & Stock' },
  ];

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('pos')}
          className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span>{settings.cafeName}</span>
        </button>
        <span className="hidden sm:inline-block text-xs font-mono text-neutral-500 tabular-nums border-l border-neutral-800 pl-3">
          <Clock className="w-3.5 h-3.5 inline mr-1 text-neutral-400" />
          {currentTime}
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="flex items-center gap-1 sm:gap-2">
        {navLinks.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Held Orders Quick Access */}
        {heldOrders.length > 0 && (
          <button
            onClick={() => setIsHoldModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-700/50 rounded-lg hover:bg-amber-900/60 transition-colors"
            title="View Held Orders"
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Held Bills</span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center justify-center">
              {heldOrders.length}
            </span>
          </button>
        )}

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => updateSettings({ enableSound: !settings.enableSound })}
          className={`p-2 rounded-lg text-xs transition-colors border ${
            settings.enableSound
              ? 'text-neutral-300 border-neutral-800 hover:bg-neutral-800'
              : 'text-neutral-500 border-neutral-800 bg-neutral-900'
          }`}
          title={settings.enableSound ? 'Mute Audio Chimes' : 'Unmute Audio Chimes'}
        >
          {settings.enableSound ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Cart Item Indicator for smaller screens */}
        {activeTab === 'pos' && cart.length > 0 && (
          <div className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 rounded-lg text-xs font-medium text-white border border-neutral-700">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums font-mono">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
          </div>
        )}
      </div>
    </header>
  );
};
