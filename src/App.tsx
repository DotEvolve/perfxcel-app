import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Verify from "./pages/Verify";

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
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
