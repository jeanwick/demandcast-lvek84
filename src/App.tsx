import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import HowItWorksSection from './howitworks';
import Pricing from './pricing';
import Features from './features';
import NavigationBar from './nav';
import CallToAction from './calltoaction';
import DemandForecast from './demandforecast';

const LandingPage = () => {
  const [showDemandForecast, setShowDemandForecast] = useState(false);

  const toggleDemandForecast = () => {
    setShowDemandForecast(!showDemandForecast);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <NavigationBar toggleDemandForecast={toggleDemandForecast} showDemandForecast={showDemandForecast} />

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
              </div>
            </div>
          </section>

          <Features />
          <HowItWorksSection />
          <Pricing toggleDemandForecast={() => {
              throw new Error('Function not implemented.');
            }} />
          <CallToAction toggleDemandForecast={toggleDemandForecast} />
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