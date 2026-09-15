import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { submitContact } from "../api";
import { Turnstile } from "@marsidev/react-turnstile";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("course_id") || undefined;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setErrorMessage("Please complete the security check.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await submitContact({
        ...formData,
        course_id: courseId,
        turnstileToken,
      });
      setStatus("success");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to submit enquiry. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 flex flex-col items-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
          <h2 className="text-3xl font-extrabold text-secondary-900 mb-4">Enquiry Received</h2>
          <p className="text-lg text-secondary-600 mb-8">
            Thank you for reaching out! We've received your enquiry and our team will get back to you shortly.
          </p>
          <button 
            onClick={() => { setStatus("idle"); setFormData({ name: "", email: "", company: "", message: "" }); }}
            className="text-primary-600 font-bold hover:text-primary-700"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-secondary-900 mb-4">Contact Us</h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          {courseId 
            ? "Get in touch with us regarding corporate group training for this course."
            : "Have questions about our training programs or want to discuss a customized solution for your team? We're here to help."}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === "error" && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-secondary-700 mb-2">Full Name *</label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 focus:bg-white"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-secondary-700 mb-2">Work Email *</label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 focus:bg-white"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-bold text-secondary-700 mb-2">Company Name</label>
            <input
              type="text"
              id="company"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 focus:bg-white"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-secondary-700 mb-2">How can we help you? *</label>
            <textarea
              id="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 focus:bg-white"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </div>

          <div className="flex justify-center my-6">
            <Turnstile
              siteKey={import.meta.env.VITE_PERFXCEL_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              onSuccess={(token) => setTurnstileToken(token)}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-600/30 transform transition hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Sending Enquiry..." : "Send Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
