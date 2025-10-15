interface Step {
  id: string;
  label: string;
  number: number;
}

interface StepsProps {
  steps: Step[];
  currentStepId: string;
  className?: string;
}

export default function Steps({ steps, currentStepId, className = "" }: StepsProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const isActive = step.id === currentStepId;
          const isCompleted = index < currentStepIndex;
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Step circle */}
              <div className={`flex items-center ${
                isActive ? "text-blue-600" : 
                isCompleted ? "text-green-600" : 
                "text-gray-400"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? "bg-blue-100 text-blue-600" : 
                  isCompleted ? "bg-green-100 text-green-600" : 
                  "bg-gray-100 text-gray-400"
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{step.label}</span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 ml-4 ${
                  isCompleted || (index === currentStepIndex - 1) ? 
                  "bg-blue-600" : 
                  "bg-gray-300"
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
