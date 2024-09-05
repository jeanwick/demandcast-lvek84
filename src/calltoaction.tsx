import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CallToActionProps {
  toggleDemandForecast: () => void; // Function to handle the click event
}

const CallToAction: React.FC<CallToActionProps> = ({ toggleDemandForecast }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Ready to optimize your supply chain?</h2>
      <button 
        onClick={toggleDemandForecast}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
      >
        Get Started Now <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
      </button>
    </section>
  );
};

export default CallToAction;