import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { getCourses, getCourse, getTaxonomies } from './api';
import type { Course, TaxonomyItem } from './api';
import { Search, MapPin, Tag, BookOpen, Layers, ArrowRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-secondary-900">Perfxcel<span className="text-primary-600">LMS</span></span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
        </Routes>
      </main>
      
      <footer className="bg-secondary-900 text-secondary-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="opacity-70">&copy; 2026 Perfxcel LMS by DotEvolve. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Catalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [taxonomies, setTaxonomies] = useState<{ categories: TaxonomyItem[], cities: TaxonomyItem[], associations: TaxonomyItem[] } | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTaxonomies().then(setTaxonomies).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getCourses({ category_id: categoryFilter, city_id: cityFilter })
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryFilter, cityFilter]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div className="glass-panel p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center"><Search className="w-5 h-5 mr-2 text-primary-500"/> Filter Catalog</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1">Category</label>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-shadow">
                <option value="">All Categories</option>
                {taxonomies?.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1">Location</label>
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-shadow">
                <option value="">Any Location</option>
                {taxonomies?.cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Course Grid */}
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-secondary-900 tracking-tight">Explore Training</h1>
          <p className="text-lg text-secondary-600 mt-2">Discover our premium selection of professional courses.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="glass-panel text-center py-20 rounded-2xl">
            <p className="text-secondary-500 text-lg">No courses found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/courses/${course.id}`)}
      className="glass-panel rounded-2xl p-6 cursor-pointer hover-lift flex flex-col h-full"
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-3">
          {course.categories && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
              {course.categories.name}
            </span>
          )}
          {course.associations && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
              {course.associations.name}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-secondary-900 mb-2 leading-tight">{course.title}</h3>
        <p className="text-secondary-600 line-clamp-2 text-sm">{course.description}</p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-sm text-secondary-500">
          <MapPin className="w-4 h-4 mr-1 text-primary-500" />
          {course.cities?.name || 'Online'}
        </div>
        <div className="flex items-center text-primary-600 font-semibold text-sm group">
          View Details
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getCourse(id).then(setCourse).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="text-center py-20 text-secondary-500">Loading details...</div>;
  if (!course) return <div className="text-center py-20 text-secondary-500">Course not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center space-x-4">
        <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium text-sm flex items-center">
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to Catalog
        </Link>
      </div>
      
      <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 mb-6">
            {course.categories && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700"><Layers className="w-4 h-4 mr-1.5"/> {course.categories.name}</span>}
            {course.cities && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800"><MapPin className="w-4 h-4 mr-1.5"/> {course.cities.name}</span>}
            {course.associations && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"><Tag className="w-4 h-4 mr-1.5"/> {course.associations.name}</span>}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary-900 mb-6 leading-tight">{course.title}</h1>
          
          <div className="prose prose-lg prose-indigo text-secondary-700 mb-10">
            <p className="text-xl leading-relaxed">{course.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-secondary-900 mb-3 text-lg">Course Objectives</h3>
              <p className="text-secondary-600">{course.objectives}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-secondary-900 mb-3 text-lg">Target Audience</h3>
              <p className="text-secondary-600">{course.target_audience}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex justify-end">
            <button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 transform transition hover:-translate-y-1">
              Register Interest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
