import { useState } from "react";
import { X } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { submitCourseInterest } from "../api";
import type { Course } from "../types/course";

interface RegisterInterestModalProps {
  course: Course;
  onClose: () => void;
  sendBrochure?: boolean;
}

export default function RegisterInterestModal({
  course,
  onClose,
  sendBrochure = false,
}: RegisterInterestModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      alert("Please complete the captcha.");
      return;
    }
    setSubmitting(true);
    try {
      await submitCourseInterest(course.id, { ...formData, request_brochure: sendBrochure }, turnstileToken);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to register interest. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Register Interest
        </h2>
        <p className="text-gray-500 mb-6">
          Leave your details and we will contact you about{" "}
          <strong>{course.title}</strong>.
        </p>

        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-medium">
            {sendBrochure
              ? "Thank you! We've received your details and sent the course brochure to your email."
              : "Thank you! We've received your details."}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div className="py-2">
              <Turnstile
                siteKey={
                  import.meta.env.VITE_PERFXCEL_TURNSTILE_SITE_KEY ||
                  "0x4AAAAAAEzpFPxOX1rj0qUL"
                }
                onSuccess={(token) => setTurnstileToken(token)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !turnstileToken}
              className="w-full bg-accent-500 hover:bg-accent-600 text-secondary-900 font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Submitting..." : "Submit Interest"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
