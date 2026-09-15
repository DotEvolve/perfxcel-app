import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourse } from "../api";
import type { Course } from "../types/course";
import { 
  ArrowRight, 
  MapPin, 
  Layers, 
  Tag, 
  Clock, 
  CalendarDays, 
  MonitorPlay,
  CheckCircle2,
  FileText,
  Users
} from "lucide-react";
import RegisterInterestModal from "../components/RegisterInterestModal";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getCourse(id)
        .then(setCourse)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );

  if (!course)
    return (
      <div className="text-center py-20 min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Course not found</h2>
        <p className="text-secondary-500 mb-6">The course you are looking for does not exist or has been removed.</p>
        <Link to="/courses" className="text-primary-600 font-bold hover:text-primary-700 flex items-center">
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to Catalog
        </Link>
      </div>
    );

  return (
    <div className="pb-24">
      {/* Breadcrumb Area */}
      <div className="bg-secondary-50 border-b border-gray-200 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm font-medium text-secondary-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ArrowRight className="w-4 h-4 mx-2 flex-shrink-0" />
            <Link to="/courses" className="hover:text-primary-600 transition-colors">Courses</Link>
            <ArrowRight className="w-4 h-4 mx-2 flex-shrink-0" />
            <span className="text-secondary-900 truncate">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Content (Left, 2/3) */}
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {course.categories && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                  <Layers className="w-4 h-4 mr-1.5" /> {course.categories.name}
                </span>
              )}
              {course.cities && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800">
                  <MapPin className="w-4 h-4 mr-1.5" /> {course.cities.name}
                </span>
              )}
              {course.associations && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                  <Tag className="w-4 h-4 mr-1.5" /> {course.associations.name}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-secondary-900 mb-6 leading-tight">
              {course.title}
            </h1>

            {/* Description */}
            <div className="prose prose-lg max-w-none text-secondary-700 mb-12">
              <p className="text-xl leading-relaxed">{course.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Objectives */}
              <div className="glass-panel bg-white rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-4 text-primary-600">
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  <h3 className="font-bold text-secondary-900 text-xl">Objectives</h3>
                </div>
                <p className="text-secondary-600 leading-relaxed">{course.objectives}</p>
              </div>

              {/* Target Audience */}
              <div className="glass-panel bg-white rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-4 text-primary-600">
                  <Users className="w-6 h-6 mr-2" />
                  <h3 className="font-bold text-secondary-900 text-xl">Target Audience</h3>
                </div>
                <p className="text-secondary-600 leading-relaxed">{course.target_audience}</p>
              </div>
            </div>

            {/* Schedule Placeholder */}
            <div>
              <h3 className="font-bold text-secondary-900 text-2xl mb-6 flex items-center">
                <CalendarDays className="w-6 h-6 mr-2 text-primary-500" /> Upcoming Schedules
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary-50 text-secondary-600 text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold rounded-tl-xl">Date</th>
                      <th className="px-6 py-4 font-semibold">Location</th>
                      <th className="px-6 py-4 font-semibold">Method</th>
                      <th className="px-6 py-4 font-semibold rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">Oct 12 - Oct 16, 2026</td>
                      <td className="px-6 py-4">{course.cities?.name || "Dubai"}</td>
                      <td className="px-6 py-4">Classroom</td>
                      <td className="px-6 py-4"><span className="text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full text-xs">Guaranteed</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">Nov 02 - Nov 06, 2026</td>
                      <td className="px-6 py-4">Online (Zoom)</td>
                      <td className="px-6 py-4">Virtual Live</td>
                      <td className="px-6 py-4"><span className="text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-full text-xs">Filling Fast</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar (Right, 1/3) */}
          <aside className="w-full lg:w-96 shrink-0 mt-8 lg:mt-0">
            <div className="glass-panel bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-28">
              <div className="text-center pb-6 border-b border-gray-100 mb-6">
                <div className="text-sm text-secondary-500 font-bold uppercase tracking-wider mb-2">Investment</div>
                <div className="text-4xl font-extrabold text-secondary-900">$3,450 <span className="text-lg text-secondary-400 font-normal">USD</span></div>
                <div className="text-xs text-secondary-400 mt-1">Excludes applicable taxes</div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-secondary-700">
                  <Clock className="w-5 h-5 mr-3 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-secondary-900">5 Days</span>
                    <span className="text-sm">Intensive professional training</span>
                  </div>
                </li>
                <li className="flex items-start text-secondary-700">
                  <MonitorPlay className="w-5 h-5 mr-3 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-secondary-900">Blended Option</span>
                    <span className="text-sm">Available online and in-person</span>
                  </div>
                </li>
                <li className="flex items-start text-secondary-700">
                  <FileText className="w-5 h-5 mr-3 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-secondary-900">Certificate</span>
                    <span className="text-sm">Official verifiable certification</span>
                  </div>
                </li>
              </ul>

              <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-accent-500 hover:bg-accent-600 text-secondary-900 font-bold py-4 rounded-xl shadow-lg shadow-accent-500/30 transform transition hover:-translate-y-0.5"
              >
                Register Interest
              </button>

              <div className="mt-4 text-center">
                <Link to="/contact" className="text-sm text-secondary-500 hover:text-primary-600 font-medium underline">
                  Enquire for corporate groups
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showModal && (
        <RegisterInterestModal course={course} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

