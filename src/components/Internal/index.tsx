"use client";

import React, { useEffect, useState } from "react";

interface Lead {
  [key: string]: any; // We don't know the exact structure yet
}

export const Internal: React.FC = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        console.log("🔄 Fetching leads data...");

        const response = await fetch("/api/get-leads", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("✅ API Response received:");
        console.log("Status:", response.status);
        console.log("Data:", data);

        setLeads(data);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("❌ Failed to fetch leads:", errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading leads...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-red-800">❌ Error loading leads</h3>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Internal Management</h2>

      <div className="rounded-lg bg-white p-4 shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Leads Data ({Array.isArray(leads) ? leads.length : 0} total)
          </h3>
        </div>

        <div className="rounded bg-gray-50 p-4">
          <pre className="max-h-96 overflow-auto text-sm text-gray-600">
            {JSON.stringify(leads, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
