import { CategorySection, CourseCard, Typography } from "@dotevolve/ui-kit";
import { CATEGORIES, MOCK_COURSES } from "../data/mockCourses";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-6 px-4 sm:px-8 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Typography as="h1" className="text-gray-900 tracking-tight">
              LMS Portal
            </Typography>
            <Typography as="p" className="text-gray-500 mt-1">
              Expand your skills with our premium courses
            </Typography>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
        {CATEGORIES.map((category) => {
          const categoryCourses = MOCK_COURSES.filter(
            (c) => c.category === category,
          );

          if (categoryCourses.length === 0) return null;

          return (
            <CategorySection key={category} title={category}>
              {categoryCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  instructor={course.instructor}
                  duration={course.duration}
                  level={course.level}
                  thumbnailUrl={course.thumbnailUrl}
                  onClick={() => console.log(`Clicked course ${course.id}`)}
                />
              ))}
            </CategorySection>
          );
        })}
      </main>
    </div>
  );
}
