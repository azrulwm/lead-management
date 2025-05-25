import React from "react";

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <aside className="h-screen w-60 border-r bg-white p-6">
      <nav className="space-y-4">
        <h2 className="text-lg font-bold text-gray-700">Leads</h2>
      </nav>
      <div className="absolute bottom-6 left-6 flex w-48 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
            A
          </div>
          <span className="font-medium text-gray-700">Admin</span>
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-medium text-red-600 hover:text-red-800"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
