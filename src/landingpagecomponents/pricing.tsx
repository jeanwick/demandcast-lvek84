import React from 'react';

interface PricingProps {
  toggleDemandForecast: () => void; // Prop for handling button click
}

const Pricing: React.FC<PricingProps> = ({ toggleDemandForecast }) => {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Our Pricing</h2>
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
        {/* Professional Plan */}
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h3 className="text-2xl font-semibold text-center mb-4">Professional Plan</h3>
          <p className="text-4xl font-bold text-center text-gray-900 mb-6">R12,500 <span className="text-xl font-normal text-gray-600">/month</span></p>
          <ul className="text-gray-600 mb-8">
            <li className="mb-2">✓ Full access to all features</li>
            <li className="mb-2">✓ Unlimited forecasts</li>
            <li className="mb-2">✓ Priority customer support</li>
            <li className="mb-2">✓ Regular updates and improvements</li>
            <li>✓ Cancel Anytime</li>
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
  );
};

export default Pricing;
//test