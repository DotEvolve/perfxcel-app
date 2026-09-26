import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronRight, ChevronDown, X } from "lucide-react";
import CourseCard from "../components/CourseCard";
import { useTaxonomies } from "../hooks/useTaxonomies";
import { useCourses } from "../hooks/useCourses";
import type { CourseFilters } from "../types/course";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { taxonomies, loading: taxLoading } = useTaxonomies();

  const slugify = (text: string) => 
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const findTaxonomyIds = (list: any[] | undefined, slugs: string[]) => {
    if (!list || slugs.length === 0) return undefined;
    const ids: string[] = [];
    for (const slug of slugs) {
      const item = list.find(c => c.id === slug || slugify(c.name) === slug);
      if (item) ids.push(item.id);
    }
    return ids.length > 0 ? ids : undefined;
  };

  const categorySlugs = searchParams.getAll("category");
  const citySlugs = searchParams.getAll("location");
  const associationSlugs = searchParams.getAll("association");
  const deliverySlugs = searchParams.getAll("delivery");
  const searchStr = searchParams.get("search") || undefined;

  const category_id = findTaxonomyIds(taxonomies?.categories, categorySlugs);
  const city_id = findTaxonomyIds(taxonomies?.cities, citySlugs);
  const association_id = findTaxonomyIds(taxonomies?.associations, associationSlugs);
  const delivery_mode_id = findTaxonomyIds(taxonomies?.delivery_modes, deliverySlugs);

  const filters: CourseFilters = {
    category_id,
    city_id,
    association_id,
    delivery_mode_id,
    search: searchStr,
  };

  const hasSlugsInUrl = categorySlugs.length > 0 || citySlugs.length > 0 || associationSlugs.length > 0 || deliverySlugs.length > 0;
  const shouldSkip = hasSlugsInUrl && taxLoading;
  const { courses, loading: coursesLoading } = useCourses(filters, shouldSkip);

  const updateMultiFilter = (key: string, values: string[]) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    values.forEach(v => newParams.append(key, v));
    setSearchParams(newParams);
  };

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

  const hasActiveFilters = categorySlugs.length > 0 || citySlugs.length > 0 || associationSlugs.length > 0 || deliverySlugs.length > 0 || searchStr;

  const getCategoryName = (id: string) =>
    taxonomies?.categories.find((c) => c.id === id)?.name;
  const getLocationName = (id: string) =>
    taxonomies?.cities.find((c) => c.id === id)?.name;
  const getAssociationName = (id: string) =>
    taxonomies?.associations.find((c) => c.id === id)?.name;
  const getDeliveryName = (id: string) =>
    taxonomies?.delivery_modes.find((c) => c.id === id)?.name;

  const catOptions = taxonomies?.categories.map(c => ({ value: slugify(c.name), label: c.name })) || [];
  const cityOptions = taxonomies?.cities.map(c => ({ value: slugify(c.name), label: c.name })) || [];
  const assocOptions = taxonomies?.associations.map(c => ({ value: slugify(c.name), label: c.name })) || [];
  const deliveryOptions = taxonomies?.delivery_modes.map(c => ({ value: slugify(c.name), label: c.name })) || [];

  return (
    <div className="pt-8">
      {/* Hero Band */}
      <div className="bg-secondary-900 text-white py-12 px-4 sm:px-6 lg:px-8 mb-10 rounded-3xl overflow-hidden relative shadow-lg">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center space-x-2 text-sm text-secondary-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Courses</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            All Training Courses
          </h1>
          <p className="text-secondary-300 text-lg max-w-2xl">
            Explore our comprehensive catalog of accredited professional
            training programs designed to elevate your career.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 pb-20">
        {/* Top Bar Filters */}
        <div className="w-full">
          <div className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Search + Filters Row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px] w-full lg:w-auto">
                <label className="block text-sm font-bold text-secondary-800 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses by name..."
                    value={searchStr || ""}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="w-full bg-secondary-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition-shadow text-secondary-900"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Multi-Select Dropdowns */}
              <MultiSelect
                label="Category"
                options={catOptions}
                selectedValues={categorySlugs}
                onChange={(vals) => updateMultiFilter("category", vals)}
                disabled={taxLoading}
              />

              <MultiSelect
                label="Location"
                options={cityOptions}
                selectedValues={citySlugs}
                onChange={(vals) => updateMultiFilter("location", vals)}
                disabled={taxLoading}
              />

              <MultiSelect
                label="Association"
                options={assocOptions}
                selectedValues={associationSlugs}
                onChange={(vals) => updateMultiFilter("association", vals)}
                disabled={taxLoading}
              />

              <MultiSelect
                label="Delivery Type"
                options={deliveryOptions}
                selectedValues={deliverySlugs}
                onChange={(vals) => updateMultiFilter("delivery", vals)}
                disabled={taxLoading}
              />

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-4 py-2.5 text-sm text-primary-600 hover:text-primary-700 font-bold whitespace-nowrap bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {categorySlugs.map(slug => (
              <div key={`cat-${slug}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700 border border-primary-100">
                <span className="font-semibold mr-1">Category:</span>{" "}
                {getCategoryName(findTaxonomyIds(taxonomies?.categories, [slug])?.[0] || "") || slug}
                <button
                  onClick={() => updateMultiFilter("category", categorySlugs.filter(s => s !== slug))}
                  className="ml-2 hover:text-primary-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {citySlugs.map(slug => (
              <div key={`city-${slug}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-800 border border-gray-200">
                <span className="font-semibold mr-1">Location:</span>{" "}
                {getLocationName(findTaxonomyIds(taxonomies?.cities, [slug])?.[0] || "") || slug}
                <button
                  onClick={() => updateMultiFilter("location", citySlugs.filter(s => s !== slug))}
                  className="ml-2 hover:text-secondary-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {associationSlugs.map(slug => (
              <div key={`assoc-${slug}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100">
                <span className="font-semibold mr-1">Assoc:</span>{" "}
                {getAssociationName(findTaxonomyIds(taxonomies?.associations, [slug])?.[0] || "") || slug}
                <button
                  onClick={() => updateMultiFilter("association", associationSlugs.filter(s => s !== slug))}
                  className="ml-2 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {deliverySlugs.map(slug => (
              <div key={`del-${slug}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-50 text-accent-700 border border-accent-100">
                <span className="font-semibold mr-1">Delivery:</span>{" "}
                {getDeliveryName(findTaxonomyIds(taxonomies?.delivery_modes, [slug])?.[0] || "") || slug}
                <button
                  onClick={() => updateMultiFilter("delivery", deliverySlugs.filter(s => s !== slug))}
                  className="ml-2 hover:text-accent-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {searchStr && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 border border-gray-200">
                <span className="font-semibold mr-1">Search:</span>{" "}
                "{searchStr}"
                <button
                  onClick={() => updateFilter("search", "")}
                  className="ml-2 hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-secondary-900">
            {coursesLoading
              ? "Searching..."
              : `${courses.length} courses found`}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-500 font-medium">
              Sort by:
            </span>
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
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              No courses found
            </h3>
            <p className="text-secondary-500">
              Try adjusting your filters or search criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-6 text-primary-600 font-bold hover:text-primary-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  disabled
}: {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(v => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const selectedLabels = options
    .filter(o => selectedValues.includes(o.value))
    .map(o => o.label);

  return (
    <div className="relative flex-1 min-w-[160px]" ref={ref}>
      <label className="block text-sm font-bold text-secondary-800 mb-2">
        {label}
      </label>
      <div
        className={`w-full bg-secondary-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex items-center justify-between transition-shadow text-secondary-900 ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary-100 cursor-pointer"
        }`}
        onClick={() => !disabled && setOpen(!open)}
      >
        <div className="truncate pr-2 select-none">
          {selectedLabels.length === 0
            ? "Any"
            : selectedLabels.length === 1
            ? selectedLabels[0]
            : `${selectedLabels.length} selected`}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center px-4 py-2.5 hover:bg-primary-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 mr-3"
              />
              <span className="text-sm font-medium text-secondary-800">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
