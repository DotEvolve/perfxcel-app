import { useState } from "react";
import { requestBrochure } from "../api";
import { Turnstile } from "@marsidev/react-turnstile";

interface BrochureModalProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BrochureModal({ courseId, isOpen, onClose }: BrochureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    designation: ""
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError("Please complete the captcha.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await requestBrochure(courseId, formData, turnstileToken);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to request brochure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
        
        {success ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Your Inbox</h3>
            <p className="text-gray-600">We've sent the course brochure to {formData.email}</p>
            <button onClick={onClose} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Download Brochure</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" value={formData.company} onChange={e => setFormData(p => ({...p, company: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input type="text" value={formData.designation} onChange={e => setFormData(p => ({...p, designation: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              
              {error && <div className="text-red-500 text-sm">{error}</div>}
              
              <div className="pt-2">
                <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={setTurnstileToken} />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
                {loading ? "Sending..." : "Get Brochure"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
