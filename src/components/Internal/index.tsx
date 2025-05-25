"use client";

import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { Sidebar } from "../Sidebar";
import { LeadTable } from "../LeadTable";
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

  const handleClearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 md:ml-60">
        <LeadTable
          allLeads={allLeads}
          currentLeads={currentLeads}
          searchInput={searchInput}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          isModalOpen={isModalOpen}
          selectedLead={selectedLead}
          newStatus={newStatus}
          isUpdating={isUpdating}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onSearchKeyPress={handleSearchKeyPress}
          onClearSearch={handleClearSearch}
          onStatusFilter={handleStatusFilter}
          onPageChange={handlePageChange}
          onEditLead={openEditModal}
          onCloseModal={closeModal}
          onStatusUpdate={handleStatusUpdate}
          onNewStatusChange={setNewStatus}
        />
      </div>
    </div>
  );
};

export default Internal;
