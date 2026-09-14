import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronRight, X } from "lucide-react";
import CourseCard from "../components/CourseCard";
import { useTaxonomies } from "../hooks/useTaxonomies";
import { useCourses } from "../hooks/useCourses";
import type { CourseFilters } from "../types/course";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { taxonomies, loading: taxLoading } = useTaxonomies();

  const category_id = searchParams.get("category") || undefined;
  const city_id = searchParams.get("location") || undefined;
  const association_id = searchParams.get("association") || undefined;
  const delivery = searchParams.get("delivery") || undefined; // Currently unused in API, but kept for future/UI

  const filters: CourseFilters = {
    category_id,
    city_id,
    association_id,
  };

  const { courses, loading: coursesLoading } = useCourses(filters);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = category_id || city_id || association_id || delivery;

  // Helpers to get taxonomy names for chips
  const getCategoryName = (id: string) => taxonomies?.categories.find(c => c.id === id)?.name;
  const getLocationName = (id: string) => taxonomies?.cities.find(c => c.id === id)?.name;
  const getAssociationName = (id: string) => taxonomies?.associations.find(c => c.id === id)?.name;

  return (
    <div>
      {/* Hero Band */}
      <div className="bg-secondary-900 text-white py-12 px-4 sm:px-6 lg:px-8 mb-10 rounded-3xl overflow-hidden relative shadow-lg">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center space-x-2 text-sm text-secondary-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Courses</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">All Training Courses</h1>
          <p className="text-secondary-300 text-lg max-w-2xl">
            Explore our comprehensive catalog of accredited professional training programs designed to elevate your career.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 pb-20">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 shrink-0 space-y-6">
          <div className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-secondary-900 flex items-center">
                <Search className="w-5 h-5 mr-2 text-primary-500" /> Filters
              </h3>
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-secondary-800 mb-2">
                  Category
                </label>
                <select
                  value={category_id || ""}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="w-full bg-secondary-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-shadow text-secondary-900"
                  disabled={taxLoading}
                >
                  <option value="">All Categories</option>
                  {taxonomies?.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary-800 mb-2">
                  Location
                </label>
                <select
                  value={city_id || ""}
                  onChange={(e) => updateFilter("location", e.target.value)}
                  className="w-full bg-secondary-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-shadow text-secondary-900"
                  disabled={taxLoading}
                >
                  <option value="">Any Location</option>
                  {taxonomies?.cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary-800 mb-2">
                  Association
                </label>
                <select
                  value={association_id || ""}
                  onChange={(e) => updateFilter("association", e.target.value)}
                  className="w-full bg-secondary-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-shadow text-secondary-900"
                  disabled={taxLoading}
                >
                  <option value="">Any Association</option>
                  {taxonomies?.associations.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary-800 mb-2">
                  Delivery Type
                </label>
                <select
                  value={delivery || ""}
                  onChange={(e) => updateFilter("delivery", e.target.value)}
                  className="w-full bg-secondary-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-shadow text-secondary-900"
                >
                  <option value="">All Methods</option>
                  <option value="online">Online</option>
                  <option value="in-person">In-Person Classroom</option>
                  <option value="corporate">Corporate / In-House</option>
                  <option value="blended">Blended Learning</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {category_id && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700 border border-primary-100">
                  <span className="font-semibold mr-1">Category:</span> {getCategoryName(category_id) || "Loading..."}
                  <button onClick={() => updateFilter("category", "")} className="ml-2 hover:text-primary-900">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {city_id && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-800 border border-gray-200">
                  <span className="font-semibold mr-1">Location:</span> {getLocationName(city_id) || "Loading..."}
                  <button onClick={() => updateFilter("location", "")} className="ml-2 hover:text-secondary-900">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {association_id && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100">
                  <span className="font-semibold mr-1">Assoc:</span> {getAssociationName(association_id) || "Loading..."}
                  <button onClick={() => updateFilter("association", "")} className="ml-2 hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {delivery && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-50 text-accent-700 border border-accent-100">
                  <span className="font-semibold mr-1">Delivery:</span> {delivery}
                  <button onClick={() => updateFilter("delivery", "")} className="ml-2 hover:text-accent-900">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results Count Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-secondary-900">
              {coursesLoading ? "Searching..." : `${courses.length} courses found`}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-500 font-medium">Sort by:</span>
              <select className="bg-transparent text-sm font-bold text-secondary-900 focus:outline-none cursor-pointer">
                <option>Recommended</option>
                <option>Newest First</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {coursesLoading ? (
            <div className="flex justify-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="glass-panel text-center py-20 rounded-2xl border border-gray-100">
              <Search className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary-900 mb-2">No courses found</h3>
              <p className="text-secondary-500">
                Try adjusting your filters or search criteria.
              </p>
              <button onClick={clearAllFilters} className="mt-6 text-primary-600 font-bold hover:text-primary-700">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
