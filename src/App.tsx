import { Routes, Route } from "react-router-dom";
import { Sentry } from "@dotevolve/error-utils/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Verify from "./pages/Verify";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import TrainingPlan from "./pages/TrainingPlan";
import { TaxonomyProvider } from "./contexts/TaxonomyContext";

function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-secondary-500 mb-6">
          We've been notified and are looking into it. Please try refreshing the
          page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          Refresh page
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <TaxonomyProvider>
        <div className="min-h-screen flex flex-col font-sans text-secondary-800 bg-secondary-50">
          <Navbar />

          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Catalog />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/training-plan" element={<TrainingPlan />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </TaxonomyProvider>
    </Sentry.ErrorBoundary>
  );
}
