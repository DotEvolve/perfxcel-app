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
  Users,
} from "lucide-react";
import RegisterInterestModal from "../components/RegisterInterestModal";
import { BrochureModal } from "../components/BrochureModal";
import { ChevronDown, ChevronUp, Download } from "lucide-react";

function CourseOutline({ outline }: { outline: NonNullable<Course["course_outline"]> }) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  return (
    <div className="mb-12">
      <h3 className="font-bold text-secondary-900 text-2xl mb-6 flex items-center">
        <Layers className="w-6 h-6 mr-2 text-primary-500" />
        Course Outline
      </h3>
      <div className="space-y-4">
        {outline.map((day) => (
          <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
            >
              <div className="flex items-center text-left">
                <span className="text-primary-600 font-bold mr-4">Day {day.day}</span>
                <span className="font-semibold text-gray-900">{day.title}</span>
              </div>
              {expandedDay === day.day ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedDay === day.day && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <ul className="space-y-4">
                  {day.modules.map((module, idx) => (
                    <li key={idx} className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-sm">✓ {module.title}</span>
                        {module.duration && <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-200">{module.duration}</span>}
                      </div>
                      {module.description && <p className="text-sm text-gray-600 mt-1 pl-4 border-l-2 border-gray-200 ml-1">{module.description}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);

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
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Course not found
        </h2>
        <p className="text-secondary-500 mb-6">
          The course you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/courses"
          className="text-primary-600 font-bold hover:text-primary-700 flex items-center"
        >
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to Catalog
        </Link>
      </div>
    );

  return (
    <div className="pb-24 pt-0">
      {/* Course Hero Image */}
      {course.image_url && (
        <div className="w-full h-64 md:h-80 overflow-hidden bg-secondary-200">
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Breadcrumb Area */}
      <div className="bg-secondary-50 border-b border-gray-200 py-4 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm font-medium text-secondary-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <ArrowRight className="w-4 h-4 mx-2 flex-shrink-0" />
            <Link
              to="/courses"
              className="hover:text-primary-600 transition-colors"
            >
              Courses
            </Link>
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
              {course.categories?.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700"
                >
                  <Layers className="w-4 h-4 mr-1.5" /> {c.name}
                </span>
              ))}
              {course.cities?.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800"
                >
                  <MapPin className="w-4 h-4 mr-1.5" /> {c.name}
                </span>
              ))}
              {course.associations?.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                >
                  <Tag className="w-4 h-4 mr-1.5" /> {c.name}
                </span>
              ))}
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
                  <h3 className="font-bold text-secondary-900 text-xl">
                    Objectives
                  </h3>
                </div>
                <p className="text-secondary-600 leading-relaxed">
                  {course.objectives}
                </p>
              </div>

              {/* Target Audience */}
              <div className="glass-panel bg-white rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-4 text-primary-600">
                  <Users className="w-6 h-6 mr-2" />
                  <h3 className="font-bold text-secondary-900 text-xl">
                    Target Audience
                  </h3>
                </div>
                <p className="text-secondary-600 leading-relaxed">
                  {course.target_audience}
                </p>
              </div>
            </div>

            {/* Course Outline */}
            {course.course_outline && course.course_outline.length > 0 && (
              <CourseOutline outline={course.course_outline} />
            )}

            {/* Schedules */}
            {course.course_schedules && course.course_schedules.length > 0 && (
              <div>
                <h3 className="font-bold text-secondary-900 text-2xl mb-6 flex items-center">
                  <CalendarDays className="w-6 h-6 mr-2 text-primary-500" />{" "}
                  Upcoming Schedules
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary-50 text-secondary-600 text-sm uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold rounded-tl-xl">
                          Date
                        </th>
                        <th className="px-6 py-4 font-semibold">Location</th>
                        <th className="px-6 py-4 font-semibold">Method</th>
                        <th className="px-6 py-4 font-semibold rounded-tr-xl">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {course.course_schedules.map((schedule) => (
                        <tr
                          key={schedule.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            {new Date(schedule.start_date).toLocaleDateString()}
                            {schedule.end_date &&
                              ` - ${new Date(schedule.end_date).toLocaleDateString()}`}
                          </td>
                          <td className="px-6 py-4">
                            {schedule.location || "TBA"}
                          </td>
                          <td className="px-6 py-4">
                            {schedule.method || "TBA"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`font-medium px-2.5 py-1 rounded-full text-xs ${
                                schedule.status === "guaranteed"
                                  ? "text-green-600 bg-green-50"
                                  : schedule.status === "filling_fast"
                                    ? "text-amber-600 bg-amber-50"
                                    : schedule.status === "closed"
                                      ? "text-red-600 bg-red-50"
                                      : schedule.status === "cancelled"
                                        ? "text-gray-600 bg-gray-100"
                                        : "text-blue-600 bg-blue-50"
                              }`}
                            >
                              {schedule.status.replace("_", " ").toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Right, 1/3) */}
          <aside className="w-full lg:w-96 shrink-0 mt-8 lg:mt-0">
            <div className="glass-panel bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-28">
              <div className="text-center pb-6 border-b border-gray-100 mb-6">
                <div className="text-sm text-secondary-500 font-bold uppercase tracking-wider mb-2">
                  Investment
                </div>
                {course.cost ? (
                  <>
                    <div className="text-4xl font-extrabold text-secondary-900">
                      ${course.cost}{" "}
                      <span className="text-lg text-secondary-400 font-normal">
                        USD
                      </span>
                    </div>
                    <div className="text-xs text-secondary-400 mt-1">
                      Excludes applicable taxes
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-secondary-900">
                    Contact for Pricing
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {course.duration && (
                  <li className="flex items-start text-secondary-700">
                    <Clock className="w-5 h-5 mr-3 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-secondary-900">
                        {course.duration}
                      </span>
                      <span className="text-sm">
                        Intensive professional training
                      </span>
                    </div>
                  </li>
                )}
                {course.is_blended && (
                  <li className="flex items-start text-secondary-700">
                    <MonitorPlay className="w-5 h-5 mr-3 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-secondary-900">
                        Blended Option
                      </span>
                      <span className="text-sm">
                        Available online and in-person
                      </span>
                    </div>
                  </li>
                )}
                <li className="flex items-start text-secondary-700">
                  <FileText className="w-5 h-5 mr-3 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-secondary-900">
                      Certificate
                    </span>
                    <span className="text-sm">
                      Official verifiable certification
                    </span>
                  </div>
                </li>
              </ul>

              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-accent-500 hover:bg-accent-600 text-secondary-900 font-bold py-4 rounded-xl shadow-lg shadow-accent-500/30 transform transition hover:-translate-y-0.5 mb-3"
              >
                Register Interest
              </button>

              {course.brochure_url && (
                <button
                  onClick={() => setShowBrochureModal(true)}
                  className="w-full bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 font-bold py-4 rounded-xl shadow-sm transform transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Brochure
                </button>
              )}

              <div className="mt-4 text-center">
                <Link
                  to={`/contact?course_id=${course.id}`}
                  className="text-sm text-secondary-500 hover:text-primary-600 font-medium underline"
                >
                  Enquire for corporate groups
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showModal && (
        <RegisterInterestModal
          course={course}
          onClose={() => setShowModal(false)}
        />
      )}
      
      {showBrochureModal && (
        <BrochureModal
          courseId={course.id}
          isOpen={showBrochureModal}
          onClose={() => setShowBrochureModal(false)}
        />
      )}
    </div>
  );
}
