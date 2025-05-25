import React from "react";
import { LeadStatus } from "@/types/Lead";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedin: string;
  visas: string;
  message: string;
  dateCreated: string;
  status: LeadStatus;
}

interface TableSectionProps {
  allLeads: Lead[];
  currentLeads: Lead[];
  searchInput: string;
  searchQuery: string;
  statusFilter: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  isModalOpen: boolean;
  selectedLead: Lead | null;
  newStatus: LeadStatus;
  isUpdating: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: () => void;
  onSearchKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onStatusFilter: (status: string) => void;
  onPageChange: (page: number) => void;
  onEditLead: (lead: Lead) => void;
  onCloseModal: () => void;
  onStatusUpdate: () => void;
  onNewStatusChange: (status: LeadStatus) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const LeadTable: React.FC<TableSectionProps> = ({
  currentLeads,
  searchInput,
  searchQuery,
  statusFilter,
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  isModalOpen,
  selectedLead,
  newStatus,
  isUpdating,
  onSearchChange,
  onSearchSubmit,
  onSearchKeyPress,
  onClearSearch,
  onStatusFilter,
  onPageChange,
  onEditLead,
  onCloseModal,
  onStatusUpdate,
  onNewStatusChange,
}) => {
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // Calculate the range of page numbers to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded border border-gray-300 px-3 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        {"<"}
      </button>
    );

    // First page and ellipsis if needed
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="rounded border border-gray-300 px-3 py-1 text-gray-500 hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-3 py-1 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`rounded border px-3 py-1 ${
            i === currentPage
              ? "border-gray-400 bg-gray-100 font-medium text-black"
              : "border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-3 py-1 text-gray-500">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="rounded border border-gray-300 px-3 py-1 text-gray-500 hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded border border-gray-300 px-3 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        {">"}
      </button>
    );

    return buttons;
  };

  return (
    <main className="flex-1 p-6">
      <h2 className="mb-6 text-2xl font-bold">Leads</h2>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by first or last name..."
            value={searchInput}
            onChange={onSearchChange}
            onKeyPress={onSearchKeyPress}
            className="w-64 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={onSearchSubmit}
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Search
          </button>
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
        <select
          value={statusFilter || "all"}
          onChange={(e) => onStatusFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value={LeadStatus.PENDING}>Pending</option>
          <option value={LeadStatus.REACHED_OUT}>Reached Out</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="w-1/5 px-4 py-3 font-medium text-gray-600">
                Name ↓
              </th>
              <th className="w-1/5 px-4 py-3 font-medium text-gray-600">
                Submitted ↓
              </th>
              <th className="w-1/5 px-4 py-3 font-medium text-gray-600">
                Status ↓
              </th>
              <th className="w-1/5 px-4 py-3 font-medium text-gray-600">
                Country ↓
              </th>
              <th className="w-1/5 px-4 py-3 font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 transition-colors hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {lead.firstName} {lead.lastName}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatDate(lead.dateCreated)}
                </td>
                <td className="px-4 py-3 capitalize text-gray-600">
                  {formatStatus(lead.status)}
                </td>
                <td className="px-4 py-3 text-gray-600">{lead.country}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onEditLead(lead)}
                    className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                  >
                    Edit Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} results
          </div>
          <div className="flex space-x-2 text-sm">
            {renderPaginationButtons()}
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Edit Lead Status
            </h3>

            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-600">
                Lead:{" "}
                <span className="font-medium">
                  {selectedLead.firstName} {selectedLead.lastName}
                </span>
              </p>
              <p className="mb-4 text-sm text-gray-600">
                Current Status:{" "}
                <span className="font-medium capitalize">
                  {formatStatus(selectedLead.status)}
                </span>
              </p>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Status:
              </label>
              <select
                value={newStatus}
                onChange={(e) =>
                  onNewStatusChange(e.target.value as LeadStatus)
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value={LeadStatus.PENDING}>Pending</option>
                <option value={LeadStatus.REACHED_OUT}>Reached Out</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onCloseModal}
                disabled={isUpdating}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onStatusUpdate}
                disabled={isUpdating || newStatus === selectedLead.status}
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
