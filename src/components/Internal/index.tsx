"use client";

import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { LeadStatus } from "@/app/api/edit-lead/route";

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

export const Internal: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newStatus, setNewStatus] = useState<LeadStatus>(LeadStatus.PENDING);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch("/api/get-leads");
        if (!response.ok) throw new Error("Failed to fetch leads");
        const data = await response.json();
        setLeads(data);
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
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === selectedLead.id ? { ...lead, status: newStatus } : lead
        )
      );

      closeModal();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      throw new Error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex">
      <aside className="h-screen w-60 border-r bg-white p-6">
        <nav className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Leads</h2>
          <div className="cursor-pointer text-gray-500 hover:text-black">
            Settings
          </div>
        </nav>
        <div className="absolute bottom-6 left-6 flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
            A
          </div>
          <span className="font-medium text-gray-700">Admin</span>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <h2 className="mb-6 text-2xl font-bold">Leads</h2>

        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="w-64 rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <select className="rounded border border-gray-300 px-3 py-2 text-sm">
            <option>Status</option>
            <option value="pending">Pending</option>
            <option value="reached_out">Reached Out</option>
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
              {leads.map((lead, idx) => (
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

        <div className="mt-4 flex justify-end space-x-2 text-sm">
          <button
            className="rounded border border-gray-300 px-3 py-1 text-gray-500 disabled:opacity-50"
            disabled
          >
            {"<"}
          </button>
          <button className="rounded border border-gray-400 bg-gray-100 px-3 py-1 font-medium text-black">
            1
          </button>
          <button className="rounded border border-gray-300 px-3 py-1 text-gray-500">
            2
          </button>
          <button className="rounded border border-gray-300 px-3 py-1 text-gray-500">
            3
          </button>
          <button className="rounded border border-gray-300 px-3 py-1 text-gray-500">
            {">"}
          </button>
        </div>
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
