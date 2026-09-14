import { useNavigate } from "react-router-dom";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import type { Course } from "../types/course";

export default function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="glass-panel rounded-2xl overflow-hidden hover-lift cursor-pointer flex flex-col h-full bg-white transition-all duration-300"
    >
      {/* Gradient accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary-500 to-primary-700" />
      
      <div className="p-6 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-3">
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            Classroom
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-secondary-900 mb-2 leading-tight">
          {course.title}
        </h3>
        
        {/* Description */}
        <p className="text-secondary-600 line-clamp-2 text-sm flex-1 mb-4">
          {course.description}
        </p>
        
        {/* Footer: location + duration + CTA */}
        <div className="mt-auto pt-4 border-t border-gray-100 group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-secondary-500">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                {course.cities?.name || "Online"}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-primary-500" />
                5 Days
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // We'll just navigate to the detail page for now,
                // but the design says "Register Interest micro-CTA".
                // Since clicking the card goes to detail, we can just say "View Details" here.
                navigate(`/courses/${course.id}`);
              }}
              className="text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Register Interest
            </button>
            <div className="text-primary-600 font-semibold text-sm flex items-center gap-1 group-hover:text-primary-700 transition-colors">
              View Details <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
