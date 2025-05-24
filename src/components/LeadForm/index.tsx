"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import FileIcon from "@/components/icons/File";
import DiceIcon from "@/components/icons/Dice";
import HeartIcon from "@/components/icons/Heart";
import { countryList } from "@/constant/countries";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedin: string;
  visas: string[];
  message: string;
  resume: File | null;
}

interface ApiResponse {
  result: string;
  message?: string;
  error?: string;
}

type FormFieldName = keyof LeadFormData;

export const LeadForm: React.FC = () => {
  const [form, setForm] = useState<LeadFormData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    linkedin: "",
    visas: [],
    message: "",
    resume: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const visaOptions: LeadFormData["visas"] = [
    "O-1",
    "EB-1A",
    "EB-2 NIW",
    "I don't know",
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const field = name as FormFieldName;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setForm((prev) => ({ ...prev, resume: file }));
    } else if (type === "checkbox") {
      setForm((prev) => {
        const visas = prev.visas.includes(value)
          ? prev.visas.filter((v) => v !== value)
          : [...prev.visas, value];
        return { ...prev, visas };
      });
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.visas.length === 0) {
      alert("Please select at least one visa option.");
      return;
    }

    // Validate that CV is uploaded (required)
    if (!form.resume) {
      alert("Please upload your Resume/CV.");
      return;
    }

    setLoading(true);

    try {
      // Create payload WITHOUT the CV file for Google Sheets
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        country: form.country,
        linkedin: form.linkedin,
        visas: form.visas,
        message: form.message,
        // Note: CV is uploaded but not sent to Google Sheets
        cvUploaded: true,
        cvFileName: form.resume.name,
      };

      const res = await fetch("/api/submit-form", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData: ApiResponse = await res.json();
        throw new Error(
          `HTTP error! Status: ${res.status}, Message: ${errorData.message}`
        );
      }

      const data: ApiResponse = await res.json();

      if (data.result === "success") {
        router.push("/thank-you");

        setForm({
          firstName: "",
          lastName: "",
          email: "",
          country: "",
          linkedin: "",
          visas: [],
          message: "",
          resume: null,
        });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert(
        `There was an error submitting the form: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">almā</h1>
          <h2 className="text-3xl font-bold">
            Get An Assessment Of Your Immigration Case
          </h2>
        </div>
      </header>

      <main className="container mx-auto max-w-xl px-4 py-12">
        {loading && (
          <div className="mb-6 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <FileIcon />
            </div>
            <h3 className="text-xl font-semibold">
              Want to understand your visa options?
            </h3>
            <p className="text-gray-600">
              Submit the form below and our team of experienced attorneys will
              review your information and send a preliminary assessment of your
              case based on your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:col-span-2"
              disabled={loading}
            />
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:col-span-2"
              disabled={loading}
            >
              <option value="">Country of Citizenship</option>
              {countryList.map((country: string) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              required
              placeholder="LinkedIn / Personal Website URL"
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:col-span-2"
              disabled={loading}
            />

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Resume/CV Upload *
              </label>
              <input
                type="file"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={loading}
              />
              {form.resume && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected: {form.resume.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-center">
              <DiceIcon />
            </div>
            <h3 className="text-center text-lg font-semibold">
              Visa categories of interest?
            </h3>
            <div className="flex flex-col items-center space-y-2">
              {visaOptions.map((visa) => (
                <label
                  key={visa}
                  className="inline-flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    name="visas"
                    value={visa}
                    checked={form.visas.includes(visa)}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                    disabled={loading}
                  />
                  <span className="text-gray-700">{visa}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-center">
              <HeartIcon />
            </div>
            <h3 className="text-center text-lg font-semibold">
              How can we help you?
            </h3>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Describe your current status, history, and any timelines..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={loading}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`rounded-full bg-black px-8 py-3 text-white transition hover:opacity-90 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
