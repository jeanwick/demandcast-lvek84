import { FC } from 'react';
import { Anchor, BarChart, CheckCircle, Clock, Database, Edit } from 'lucide-react'; // Ensure correct imports

interface HowItWorksStepProps {
  icon: React.ElementType;  // Use React.ElementType for component types
  title: string;
  description: string;
}

const HowItWorksStep: FC<HowItWorksStepProps> = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start mb-8">
    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
      <div className="bg-blue-100 rounded-full p-4">
        <Icon className="w-8 h-8 text-blue-600" />
      </div>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const HowItWorksSection = () => (
  <section id="how-it-works" className="bg-gray-50 py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        <HowItWorksStep
          icon={Edit}
          title="Enter SKU Names"
          description="Start by naming your two SKUs for easy identification throughout the forecasting process."
        />
        <HowItWorksStep
          icon={Database}
          title="Input Historical Data"
          description="Add your past demand data for each SKU to establish a baseline for predictions."
        />
        <HowItWorksStep
          icon={Anchor}
          title="Specify Sailing Time"
          description="Account for shipping durations to ensure accurate lead time in your forecasts."
        />
        <HowItWorksStep
          icon={Clock}
          title="Add Port Delays"
          description="Factor in potential port delays to refine your supply chain expectations."
        />
        <HowItWorksStep
          icon={BarChart}
          title="Choose Forecast Period"
          description="Select how far into the future you want to predict demand for your SKUs."
        />
        <HowItWorksStep
          icon={CheckCircle}
          title="Get Accurate Predictions"
          description="Receive detailed demand forecasts based on your inputs and our advanced algorithms."
        />
      </div>
    </div>
  </section>
);

export default HowItWorksSection;