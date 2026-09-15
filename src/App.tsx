import { Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
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
  );
}
