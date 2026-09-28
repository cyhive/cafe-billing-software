import React from 'react';
import { ItemCategory } from '../types';
import { Search, X, Flame, Coffee, Sparkles, Utensils } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: ItemCategory;
  onSelectCategory: (category: ItemCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: Record<ItemCategory, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  counts,
}) => {
  const categories: { id: ItemCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: '🍽️' },
    { id: 'burgers', label: 'Gourmet Burgers', icon: '🍔' },
    { id: 'broasted', label: 'Broasted Chicken', icon: '🍗' },
    { id: 'tea', label: 'Karak & Teas', icon: '☕' },
    { id: 'juices', label: 'Fresh Juices & Mojitos', icon: '🍹' },
    { id: 'sides', label: 'Fries & Sides', icon: '🍟' },
    { id: 'desserts', label: 'Waffles & Shakes', icon: '🧇' },
  ];

  return (
    <div className="space-y-3 pb-3">
      {/* Search & Quick Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search burger, broasted, karak chai, avocado shake..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400 shrink-0 self-end sm:self-auto">
          <span>{counts[selectedCategory]} items</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-400/90 font-mono">1-Click Fast Bill</span>
        </div>
      </div>

      {/* Category Segmented Scrollable Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = counts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 font-semibold shadow-sm shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-850 hover:border-neutral-700'
              }`}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-neutral-950/20 text-neutral-900 font-bold'
                    : 'text-neutral-500 bg-neutral-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
