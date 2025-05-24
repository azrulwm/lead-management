"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import FileIcon from "@/components/icons/File";
import DiceIcon from "@/components/icons/Dice";
import HeartIcon from "@/components/icons/Heart";
import { countryList } from "@/constant/countries";

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedin: string;
  visas: string[];
  message: string;
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
  });
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
    if (type === "checkbox") {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (form.visas.length === 0) {
      alert("Please select at least one visa option.");
      return;
    }

    console.log("Form submission:", form);
    router.push("/thank-you");
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

      <main className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-8">
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
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:col-span-2"
            />
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:col-span-2"
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
            />
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
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-full bg-black px-8 py-3 text-white transition hover:opacity-90"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
