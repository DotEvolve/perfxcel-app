import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { verifyCertificate } from "../api";
import { CheckCircle, XCircle } from "lucide-react";

interface VerifyResult {
  valid: boolean;
  candidate_name?: string;
  course_title?: string;
  issued_at?: string;
  credential_id?: string;
  pdf_url?: string;
}

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [credentialId, setCredentialId] = useState(
    searchParams.get("id") || "",
  );
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialId.trim() || !turnstileToken) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await verifyCertificate(credentialId, turnstileToken);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to verify certificate. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white min-h-[70vh] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Verify Certificate
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Enter the credential ID found on the certificate to verify its
            authenticity.
          </p>
        </div>

        <div className="mt-10 mx-auto max-w-xl">
          <form
            onSubmit={handleVerify}
            className="space-y-6 bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div>
              <label
                htmlFor="credentialId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Credential ID
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="credentialId"
                  value={credentialId}
                  onChange={(e) =>
                    setCredentialId(e.target.value.toUpperCase())
                  }
                  placeholder="e.g. ABCD1234"
                  className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 uppercase"
                />
              </div>
            </div>

            <div className="flex justify-center my-4">
              <Turnstile
                siteKey={import.meta.env.VITE_PERFXCEL_TURNSTILE_SITE_KEY || ""}
                onSuccess={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
                options={{
                  theme: "light",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!credentialId.trim() || !turnstileToken || loading}
              className="w-full rounded-md bg-accent-500 px-3.5 py-2.5 text-center text-sm font-semibold text-secondary-900 shadow-sm hover:bg-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verifying..." : "Verify Certificate"}
            </button>
          </form>

          {/* Results Section */}
          <div className="mt-8">
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircle
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Verification Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && !result.valid && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200 shadow-sm">
                <div className="flex items-center">
                  <XCircle className="h-6 w-6 text-red-500" />
                  <h3 className="ml-3 text-lg font-medium text-red-800">
                    Invalid or Not Found
                  </h3>
                </div>
                <p className="mt-2 text-sm text-red-700 ml-9">
                  We could not find a certificate matching the credential ID:{" "}
                  <span className="font-semibold">{credentialId}</span>. Please
                  check the ID and try again.
                </p>
              </div>
            )}

            {result && result.valid && (
              <div className="rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="ml-3 text-lg font-medium text-green-800">
                    Valid Certificate
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Candidate Name
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 font-semibold">
                        {result.candidate_name}
                      </dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Course
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {result.course_title}
                      </dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Issue Date
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {formatDate(result.issued_at)}
                      </dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Credential ID
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                        {result.credential_id}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <a
                    href={result.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Download Certificate
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
