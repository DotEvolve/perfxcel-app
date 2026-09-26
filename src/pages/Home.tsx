import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTaxonomies } from "../hooks/useTaxonomies";
import { useCourses } from "../hooks/useCourses";
import CourseCard from "../components/CourseCard";
import {
  Award,
  Users,
  Globe2,
  BookOpen,
  Briefcase,
  MonitorPlay,
  LineChart,
  Star,
  StarHalf,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { TaxonomyItem } from "../types/course";

// Icon Map for Categories (Hardcoded for demo based on name)
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("lead") || n.includes("manage"))
    return <Briefcase className="w-8 h-8" />;
  if (n.includes("it") || n.includes("tech") || n.includes("data"))
    return <MonitorPlay className="w-8 h-8" />;
  if (n.includes("finance") || n.includes("account"))
    return <LineChart className="w-8 h-8" />;
  return <BookOpen className="w-8 h-8" />;
};

export default function Home() {
  const { taxonomies } = useTaxonomies();
  const categories = taxonomies?.categories || [];

  // Fetch public courses for the featured section
  const { courses: featuredCourses, loading: featuredLoading } = useCourses({
    is_public: true,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      
      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 10) {
          scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    if (featuredCourses.length === 0) return;
    
    const interval = setInterval(() => {
      scroll('right');
    }, 4000);
    
    return () => clearInterval(interval);
  }, [featuredCourses]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-secondary-900">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 opacity-95" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.05) 0, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white pt-20 pb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8">
            <span className="text-accent-400 mr-2">✦</span> 25+ Years of
            Professional Excellence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Elevate Your
            <br />
            <span className="text-accent-400">Professional</span> Excellence
          </h1>
          <p className="text-xl text-secondary-300 max-w-2xl mb-10">
            Over 1,200+ accredited training programs across the MENA & EMEA
            region, delivered by world-class practitioners.
          </p>

          <div className="flex flex-wrap gap-4 mb-20">
            <Link
              to="/courses"
              className="px-8 py-4 rounded-xl font-bold text-secondary-900 bg-accent-500 hover:bg-accent-600 shadow-lg shadow-accent-500/30 transition-all hover:-translate-y-0.5"
            >
              Browse Courses &rarr;
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              About Us
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
            <Stat value="1,200+" label="Training Programs" />
            <Stat value="50,000+" label="Professionals Trained" />
            <Stat value="30+" label="Countries Reached" />
            <Stat value="200+" label="Expert Trainers" />
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Explore by Discipline"
            title="Find Your Next Certification"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
            {categories.slice(0, 8).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-10 text-secondary-500">
                Loading categories...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <SectionHeading
              eyebrow="Popular Programmes"
              title="Featured Courses"
            />
            <Link
              to="/courses"
              className="hidden md:flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors text-sm"
            >
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
          ) : featuredCourses.length === 0 ? (
            <p className="text-center text-secondary-500 py-10">
              No featured courses available right now.
            </p>
          ) : (
            <div className="relative group">
              <button 
                onClick={() => scroll('left')}
                className="absolute -left-5 top-[40%] -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 text-primary-600 hover:bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center border border-gray-100"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* To hide scrollbar on webkit, usually done via css, but inline helps for firefox/ie */}
                <style>{`
                  div::-webkit-scrollbar { display: none; }
                `}</style>
                {featuredCourses.map((course) => (
                  <div key={course.id} className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>

              <button 
                onClick={() => scroll('right')}
                className="absolute -right-5 top-[40%] -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 text-primary-600 hover:bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center border border-gray-100"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors"
            >
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why PerfXcel Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Why Choose Us" title="Our Promise to You" />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <PromiseCard
              icon={Award}
              title="Accredited Excellence"
              description="Our courses are validated by globally recognised professional bodies, ensuring you receive industry-standard education."
            />
            <PromiseCard
              icon={Users}
              title="World-Class Instructors"
              description="Learn directly from senior industry practitioners with decades of hands-on experience in their respective fields."
            />
            <PromiseCard
              icon={Globe2}
              title="Flexible Delivery"
              description="Choose between online self-paced, live virtual classes, in-person workshops, or bespoke corporate in-house training."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-secondary-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Client Stories"
            title="Trusted by Leading Organisations"
            light
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Training CTA Band */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Transform Your Team's Performance
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Bespoke corporate training programs designed specifically for your
            organisation's unique challenges and strategic goals.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-accent-500 text-secondary-900 font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-accent-600 transition-colors"
          >
            Request a Proposal &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}

// -- Sub Components (Local) --

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
        {value}
      </div>
      <div className="text-secondary-400 font-medium">{label}</div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`text-sm font-bold tracking-widest uppercase mb-3 ${light ? "text-primary-400" : "text-primary-600"}`}
      >
        {eyebrow}
      </div>
      <h2
        className={`text-3xl md:text-4xl font-extrabold ${light ? "text-white" : "text-secondary-900"}`}
      >
        {title}
      </h2>
    </div>
  );
}

function CategoryCard({ category }: { category: TaxonomyItem }) {
  return (
    <Link
      to={`/courses?category=${category.id}`}
      className="glass-panel group rounded-2xl p-8 hover-lift flex flex-col bg-white border border-gray-100"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
        {getCategoryIcon(category.name)}
      </div>
      <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
        {category.name}
      </h3>
      <p className="text-sm text-secondary-500">
        Explore premium programs in {category.name}.
      </p>
    </Link>
  );
}

function PromiseCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-8 bg-white border border-gray-100 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-100 to-primary-50" />
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-secondary-900 mb-4">{title}</h3>
      <p className="text-secondary-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col">
      <div className="flex text-accent-400 mb-6">
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <Star className="w-5 h-5 fill-current" />
        <StarHalf className="w-5 h-5 fill-current" />
      </div>
      <p className="text-secondary-200 text-lg italic mb-8 flex-1">
        "{testimonial.quote}"
      </p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-lg">
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-white">{testimonial.author}</div>
          <div className="text-primary-400 text-sm">{testimonial.company}</div>
        </div>
      </div>
    </div>
  );
}

// -- Static Data --

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "The leadership bootcamp completely transformed our management team. The practical insights were immediately applicable.",
    author: "Ahmed Al-Mansoori",
    company: "Emirates National Bank",
  },
  {
    id: 2,
    quote:
      "Outstanding instructors who bring real-world experience to the classroom. Best technical training we've had.",
    author: "Sarah Jenkins",
    company: "TechCorp MENA",
  },
  {
    id: 3,
    quote:
      "The blended learning approach allowed our busy executives to participate without disrupting their schedules.",
    author: "Omar Tariq",
    company: "Gulf Logistics Group",
  },
  {
    id: 4,
    quote:
      "Highly recommend PerfXcel for any organisation looking to upskill their finance department. Exceptional quality.",
    author: "Fatima Rahman",
    company: "Saudi Investment Authority",
  },
  {
    id: 5,
    quote:
      "The customised in-house training addressed exactly what our engineering team needed. A great ROI.",
    author: "David Chen",
    company: "Global Construction Ltd",
  },
  {
    id: 6,
    quote:
      "A truly world-class learning experience. The networking opportunities alone were worth the investment.",
    author: "Layla Hassan",
    company: "Oman Energy Services",
  },
];
