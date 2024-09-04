import React, { useState } from 'react';
import { BarChart2, Anchor, Clock, Box, ChevronRight, Menu, X, ArrowLeft } from 'lucide-react';
import HowItWorksSection from './howitworks';

// Import the DemandForecast component
import DemandForecast from './demandforecast';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <Icon className="w-12 h-12 text-blue-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemandForecast, setShowDemandForecast] = useState(false);

  const toggleDemandForecast = () => {
    setShowDemandForecast(!showDemandForecast);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <BarChart2 className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">DemandCast</span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="#features" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">Features</a>
              <a href="#how-it-works" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">How It Works</a>
              <a href="#pricing" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">Pricing</a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button 
                onClick={toggleDemandForecast}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showDemandForecast ? 'Back to Landing' : 'Get Started'}
              </button>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <a href="#features" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">Features</a>
              <a href="#how-it-works" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">How It Works</a>
              <a href="#pricing" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">Pricing</a>
            </div>
          </div>
        )}
      </nav>

      {showDemandForecast ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={toggleDemandForecast}
            className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Landing Page
          </button>
          <DemandForecast />
        </div>
      ) : (
        <main>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Precision Demand Forecasting</span>
                <span className="block text-blue-500">for Importers and Freight Forwarders</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Optimize your supply chain with AI-powered predictions that account for real-world factors like sailing time and port delays.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <button
                    onClick={toggleDemandForecast}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </button>
                </div>
                {/* <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-500 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    Watch Demo
                  </a>
                </div> */}
              </div>
            </div>
          </section>

          <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={BarChart2} 
                title="Dual SKU Forecasting" 
                description="Predict demand for two SKUs simultaneously, allowing for comprehensive inventory management."
              />
              <FeatureCard 
                icon={Anchor} 
                title="Sailing Time Integration" 
                description="Factor in actual shipping durations for more accurate lead time predictions."
              />
              <FeatureCard 
                icon={Clock} 
                title="Port Delay Adjustment" 
                description="Account for potential delays at ports to refine your supply chain expectations."
              />
              <FeatureCard 
                icon={Box} 
                title="Flexible Forecasting" 
                description="Choose your forecast period to align with your specific business needs and planning cycles."
              />
            </div>
          </section>
          <HowItWorksSection/>
          {/* <section id="how-it-works" className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">How It Works</h2>
              <div className="max-w-3xl mx-auto">
                {[
                  "Enter names for your two SKUs",
                  "Input historical demand data",
                  "Specify sailing time and port delays",
                  "Choose your forecast period",
                  "Get accurate demand predictions"
                ].map((step, index) => (
                  <div key={index} className="flex items-center mb-6">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-xl font-bold">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section> */}
          
          <section id= "pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
  <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Our Pricing</h2>
  <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
    {/* Professional Plan */}
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
      <h3 className="text-2xl font-semibold text-center mb-4">Professional Plan</h3>
      <p className="text-4xl font-bold text-center text-gray-900 mb-6">R2,500 <span className="text-xl font-normal text-gray-600">/month</span></p>
      <ul className="text-gray-600 mb-8">
        <li className="mb-2">✓ Full access to all features</li>
        <li className="mb-2">✓ Unlimited forecasts</li>
        <li className="mb-2">✓ Priority customer support</li>
        <li>✓ Regular updates and improvements</li>
      </ul>
      <button
        onClick={toggleDemandForecast}
        className="w-full bg-blue-500 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
      >
        Start Your Free Trial
      </button>
      <p className="text-sm text-gray-500 text-center mt-4">No credit card required</p>
    </div>

    {/* Free Plan */}
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
      <h3 className="text-2xl font-semibold text-center mb-4">Free Version</h3>
      <p className="text-4xl font-bold text-center text-gray-900 mb-6">R0 <span className="text-xl font-normal text-gray-600">/month</span></p>
      <ul className="text-gray-600 mb-8">
        <li className="mb-2">✓ Basic demand forecasting</li>
        <li className="mb-2">✓ Single SKU support</li>
        <li className="mb-2">✓ Limited historical data</li>
        <li className="mb-2">✓ Community support</li>
        <li>✓ Basic reporting</li>
      </ul>
      <button
        onClick={toggleDemandForecast}
        className="w-full bg-gray-500 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300"
      >
        Start For Free
      </button>
    </div>
  </div>
</section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Ready to optimize your supply chain?</h2>
            <button 
              onClick={toggleDemandForecast}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
            >
              Get Started Now <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
            </button>
          </section>
        </main>
      )}

      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">&copy; 2024 DemandCast. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;