"use client";

import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { LeadStatus } from "@/types/Lead";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

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

const ITEMS_PER_PAGE = 10;

export const Internal: React.FC = () => {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current page, status filter, and search query from URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const statusFilter = searchParams.get("status") || "";
  const searchQuery = searchParams.get("search") || "";

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newStatus, setNewStatus] = useState<LeadStatus>(LeadStatus.PENDING);
  const [isUpdating, setIsUpdating] = useState(false);

  // Search state for controlled input
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Update search input when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Filter leads by status and search query
  let filteredLeads = allLeads;

  // Apply status filter
  if (statusFilter) {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.status === statusFilter
    );
  }

  // Apply search filter (first name or last name)
  if (searchQuery) {
    filteredLeads = filteredLeads.filter(
      (lead) =>
        lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Calculate pagination based on filtered data
  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch("/api/get-leads");
        if (!response.ok) throw new Error("Failed to fetch leads");
        const data = await response.json();
        setAllLeads(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch leads";
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
    setIsUpdating(false);
  };

  const handleStatusUpdate = async () => {
    if (!selectedLead) return;

    setIsUpdating(true);
    try {
      const response = await fetch("/api/edit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedLead.id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the lead in the local state
      setAllLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === selectedLead.id ? { ...lead, status: newStatus } : lead
        )
      );

      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      throw new Error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    // Reset to page 1 when changing filter
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    // Reset to page 1 when searching
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

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
        onClick={() => handlePageChange(currentPage - 1)}
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
          onClick={() => handlePageChange(1)}
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
          onClick={() => handlePageChange(i)}
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
          onClick={() => handlePageChange(totalPages)}
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
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded border border-gray-300 px-3 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        {">"}
      </button>
    );

    return buttons;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex">
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
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <h2 className="mb-6 text-2xl font-bold">Leads</h2>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by first or last name..."
              value={searchInput}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              className="w-64 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSearchSubmit}
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Search
            </button>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchInput("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  params.set("page", "1");
                  router.push(`?${params.toString()}`);
                }}
                className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
          <select
            value={statusFilter || "all"}
            onChange={(e) => handleStatusFilter(e.target.value)}
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
                      onClick={() => openEditModal(lead)}
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
      </main>

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
                onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value={LeadStatus.PENDING}>Pending</option>
                <option value={LeadStatus.REACHED_OUT}>Reached Out</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                disabled={isUpdating}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating || newStatus === selectedLead.status}
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internal;
