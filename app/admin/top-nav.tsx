'use client';

import Link from 'next/link';
import { User, Bell, Search, Menu } from 'lucide-react';

export default function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors md:hidden shrink-0"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/admin" className="font-bold text-gray-900 text-base sm:text-lg truncate md:hidden shrink-0">
          RENAISSANCE
        </Link>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        <button className="relative p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="size-4 sm:size-5" />
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <Link href="/admin/settings" className="flex items-center gap-2 p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="size-4 sm:size-5" />
        </Link>
        <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
}
