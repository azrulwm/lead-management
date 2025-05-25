import React, { useState } from "react";

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={toggleMobileMenu}
        className="fixed left-4 top-4 z-50 rounded-md bg-white p-2 shadow-md md:hidden"
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen w-60 transform border-r 
          bg-gradient-to-b from-yellow-50 to-white p-6 
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:z-auto
          pt-16 md:pt-0
        `}
      >
        {/* Logo */}
        <div className="mb-14 mt-8">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            alm<span className="italic">ă</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-6">
          <div className="space-y-4">
            <div className="text-sm font-bold text-black">Leads</div>
            <div className="cursor-pointer text-sm text-gray-500 hover:text-black">
              Settings
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 flex w-48 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
              A
            </div>
            <span className="font-medium text-gray-700">Admin</span>
          </div>
          <button
            onClick={() => {
              onLogout();
              closeMobileMenu();
            }}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
