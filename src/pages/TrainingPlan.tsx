export default function TrainingPlan() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 
            className="text-4xl font-bold text-secondary-900 sm:text-5xl animate-fade-in-up"
          >
            Enterprise Training Plans
          </h1>
          <p 
            className="mt-4 text-xl text-secondary-600 max-w-3xl mx-auto animate-fade-in-up delay-100"
          >
            Customized learning paths for organizations committed to continuous professional development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Starter Plan */}
          <div 
            className="bg-white rounded-2xl p-8 border border-secondary-200 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
          >
            <h3 className="text-2xl font-bold text-secondary-900 mb-2">Starter</h3>
            <p className="text-secondary-600 mb-6">Perfect for small teams beginning their learning journey.</p>
            <div className="text-4xl font-bold text-primary-600 mb-6">$99<span className="text-lg text-secondary-500 font-normal">/user/mo</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Access to 50+ core courses
              </li>
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Basic reporting
              </li>
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Email support
              </li>
            </ul>
            <button className="w-full py-3 px-4 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </div>

          {/* Professional Plan */}
          <div 
            className="bg-primary-50 rounded-2xl p-8 border-2 border-primary-500 shadow-md relative transform md:-translate-y-4 animate-fade-in-up delay-100"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-2">Professional</h3>
            <p className="text-secondary-600 mb-6">Comprehensive learning for growing organizations.</p>
            <div className="text-4xl font-bold text-primary-600 mb-6">$199<span className="text-lg text-secondary-500 font-normal">/user/mo</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Access to all 200+ courses
              </li>
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Advanced analytics dashboard
              </li>
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Custom learning paths
              </li>
            </ul>
            <button className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </div>

          {/* Enterprise Plan */}
          <div 
            className="bg-white rounded-2xl p-8 border border-secondary-200 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up delay-200"
          >
            <h3 className="text-2xl font-bold text-secondary-900 mb-2">Enterprise</h3>
            <p className="text-secondary-600 mb-6">Tailored solutions for large-scale deployments.</p>
            <div className="text-4xl font-bold text-primary-600 mb-6">Custom</div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Everything in Professional
              </li>
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Dedicated success manager
              </li>
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                SSO Integration
              </li>
              <li className="flex items-center text-secondary-700">
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                API Access
              </li>
            </ul>
            <button className="w-full py-3 px-4 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 rounded-lg font-medium transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
