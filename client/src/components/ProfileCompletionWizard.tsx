
import React, { useState } from 'react';
import { User, Briefcase, Award, MapPin, Phone, Mail, FileText, CheckCircle } from 'lucide-react';

interface ProfileCompletionWizardProps {
  userType: string;
  onComplete: (profileData: any) => void;
  onSkip: () => void;
}

const ProfileCompletionWizard: React.FC<ProfileCompletionWizardProps> = ({ userType, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    profileType: userType,
    businessName: '',
    registrationNumber: '',
    skills: [],
    specializations: [],
    experience: '',
    education: [],
    languages: ['English'],
    workingAreas: [],
    hourlyRate: '',
    tools: [],
    equipment: [],
    portfolioUrls: []
  });

  const getStepsForUserType = (type: string) => {
    const commonSteps = [
      { id: 1, title: 'Basic Info', icon: User },
      { id: 2, title: 'Contact & Location', icon: MapPin },
      { id: 3, title: 'Skills & Experience', icon: Briefcase },
      { id: 4, title: 'Certifications', icon: Award },
      { id: 5, title: 'Portfolio', icon: FileText }
    ];

    switch (type) {
      case 'contractor':
      case 'artisan':
        return commonSteps;
      case 'supplier':
        return [
          { id: 1, title: 'Business Info', icon: User },
          { id: 2, title: 'Contact & Location', icon: MapPin },
          { id: 3, title: 'Products & Services', icon: Briefcase },
          { id: 4, title: 'Certifications', icon: Award }
        ];
      case 'agent':
        return [
          { id: 1, title: 'Professional Info', icon: User },
          { id: 2, title: 'Contact & Areas', icon: MapPin },
          { id: 3, title: 'Specializations', icon: Briefcase },
          { id: 4, title: 'Certifications', icon: Award }
        ];
      default:
        return commonSteps.slice(0, 3);
    }
  };

  const steps = getStepsForUserType(userType);
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profileData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfileData = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStep = () => {
    const step = steps[currentStep - 1];
    
    switch (step.id) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              {userType === 'supplier' ? 'Business Information' : 'Basic Information'}
            </h3>
            
            {(userType === 'contractor' || userType === 'supplier' || userType === 'agent') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business/Company Name
                  </label>
                  <input
                    type="text"
                    value={profileData.businessName}
                    onChange={(e) => updateProfileData('businessName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your business name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={profileData.registrationNumber}
                    onChange={(e) => updateProfileData('registrationNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Business registration number"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <select
                value={profileData.experience}
                onChange={(e) => updateProfileData('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select experience level</option>
                <option value="0-1">0-1 years</option>
                <option value="2-5">2-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact & Location</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Areas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Gaborone', 'Francistown', 'Maun', 'Kasane', 'Palapye', 'Serowe'].map(area => (
                  <label key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.workingAreas.includes(area)}
                      onChange={(e) => {
                        const areas = e.target.checked 
                          ? [...profileData.workingAreas, area]
                          : profileData.workingAreas.filter((a: string) => a !== area);
                        updateProfileData('workingAreas', areas);
                      }}
                      className="mr-2"
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['English', 'Setswana', 'Afrikaans', 'Shona'].map(lang => (
                  <label key={lang} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.languages.includes(lang)}
                      onChange={(e) => {
                        const languages = e.target.checked 
                          ? [...profileData.languages, lang]
                          : profileData.languages.filter((l: string) => l !== lang);
                        updateProfileData('languages', languages);
                      }}
                      className="mr-2"
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              {userType === 'supplier' ? 'Products & Services' : 'Skills & Specializations'}
            </h3>
            
            {userType === 'artisan' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Skills
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Tiling', 'Roofing'].map(skill => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.skills.includes(skill)}
                        onChange={(e) => {
                          const skills = e.target.checked 
                            ? [...profileData.skills, skill]
                            : profileData.skills.filter((s: string) => s !== skill);
                          updateProfileData('skills', skills);
                        }}
                        className="mr-2"
                      />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate (BWP)
              </label>
              <input
                type="number"
                value={profileData.hourlyRate}
                onChange={(e) => updateProfileData('hourlyRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your hourly rate"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <p className="text-gray-600">
              You can complete additional profile details later from your dashboard.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <span className="text-sm text-gray-600">{currentStep} of {totalSteps}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1 < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8 min-h-[300px]">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStep === totalSteps ? 'Complete Profile' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionWizard;
