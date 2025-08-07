import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin,
  Wrench,
  Award,
  Clock,
  Car,
  Upload,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const specialties = [
  "Computer Diagnostics",
  "Network Installation",
  "Smart Home Setup",
  "Hardware Repair",
  "Software Installation",
  "Data Recovery",
  "Virus Removal",
  "System Optimization",
  "Printer Setup",
  "Security Camera Installation"
];

const certifications = [
  "CompTIA A+",
  "CompTIA Network+",
  "CompTIA Security+",
  "Cisco CCNA",
  "Microsoft MCP",
  "Apple Certified",
  "Google IT Support",
  "AWS Certified",
  "Azure Certified",
  "Other"
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Other"
];

export default function TechnicianRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    
    // Professional Information
    experience: "",
    hourlyRate: "",
    specialties: [] as string[],
    certificationNames: [] as string[],
    languages: [] as string[],
    
    // Vehicle Information
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    
    // Availability
    availability: {
      monday: { start: "09:00", end: "17:00", isAvailable: true },
      tuesday: { start: "09:00", end: "17:00", isAvailable: true },
      wednesday: { start: "09:00", end: "17:00", isAvailable: true },
      thursday: { start: "09:00", end: "17:00", isAvailable: true },
      friday: { start: "09:00", end: "17:00", isAvailable: true },
      saturday: { start: "09:00", end: "17:00", isAvailable: false },
      sunday: { start: "09:00", end: "17:00", isAvailable: false }
    },
    
    // Documents
    resume: null as File | null,
    certificationFiles: [] as File[],
    insurance: null as File | null,
    
    // Terms
    agreeToTerms: false,
    agreeToBackgroundCheck: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleCertificationToggle = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certificationNames: prev.certificationNames.includes(cert)
        ? prev.certificationNames.filter(c => c !== cert)
        : [...prev.certificationNames, cert]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          [field]: value
        }
      }
    }));
  };

  const handleFileUpload = (field: string, file: File | File[]) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.password && formData.name && formData.phone;
      case 2:
        return formData.experience && formData.hourlyRate && formData.specialties.length > 0;
      case 3:
        return formData.vehicleMake && formData.vehicleModel && formData.vehicleYear;
      case 4:
        return formData.agreeToTerms && formData.agreeToBackgroundCheck;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would submit the form data to your API
      console.log('Submitting technician registration:', formData);
      
      toast({
        title: "Application Submitted",
        description: "Your technician application has been submitted successfully. We'll review it and contact you within 3-5 business days.",
      });
      
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          placeholder="Confirm your password"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience *</Label>
          <Input
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="e.g., 5 years"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
            placeholder="e.g., 45"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Specialties *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {specialties.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
                id={specialty}
                checked={formData.specialties.includes(specialty)}
                onCheckedChange={() => handleSpecialtyToggle(specialty)}
              />
              <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Certifications</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {certifications.map((cert) => (
            <div key={cert} className="flex items-center space-x-2">
              <Checkbox
                id={cert}
                checked={formData.certificationNames.includes(cert)}
                onCheckedChange={() => handleCertificationToggle(cert)}
              />
              <Label htmlFor={cert} className="text-sm">{cert}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Languages Spoken</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {languages.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={formData.languages.includes(language)}
                onCheckedChange={() => handleLanguageToggle(language)}
              />
              <Label htmlFor={language} className="text-sm">{language}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleMake">Vehicle Make *</Label>
          <Input
            id="vehicleMake"
            value={formData.vehicleMake}
            onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
            placeholder="e.g., Toyota"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleModel">Vehicle Model *</Label>
          <Input
            id="vehicleModel"
            value={formData.vehicleModel}
            onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
            placeholder="e.g., Camry"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleYear">Vehicle Year *</Label>
          <Input
            id="vehicleYear"
            value={formData.vehicleYear}
            onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
            placeholder="e.g., 2020"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="licensePlate">License Plate *</Label>
          <Input
            id="licensePlate"
            value={formData.licensePlate}
            onChange={(e) => handleInputChange('licensePlate', e.target.value)}
            placeholder="Enter license plate"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Weekly Availability</Label>
        <div className="space-y-3">
          {Object.entries(formData.availability).map(([day, schedule]) => (
            <div key={day} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-24">
                <Label className="capitalize">{day}</Label>
              </div>
              <Checkbox
                checked={schedule.isAvailable}
                onCheckedChange={(checked) => 
                  handleAvailabilityChange(day, 'isAvailable', checked)
                }
              />
              {schedule.isAvailable && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={schedule.start}
                    onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                    className="w-24"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={schedule.end}
                    onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                    className="w-24"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Upload Documents</Label>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume/CV</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('resume', file);
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="certifications">Certification Documents</Label>
            <Input
              id="certifications"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleFileUpload('certificationFiles', files);
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="insurance">Insurance Certificate</Label>
            <Input
              id="insurance"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('insurance', file);
              }}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Terms & Conditions</Label>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
            />
            <Label htmlFor="agreeToTerms" className="text-sm">
              I agree to the TechConnect Portal Terms of Service and Privacy Policy
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeToBackgroundCheck"
              checked={formData.agreeToBackgroundCheck}
              onCheckedChange={(checked) => handleInputChange('agreeToBackgroundCheck', checked)}
            />
            <Label htmlFor="agreeToBackgroundCheck" className="text-sm">
              I consent to a background check as part of the application process
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [
    { title: "Basic Information", icon: User },
    { title: "Professional Details", icon: Wrench },
    { title: "Vehicle & Availability", icon: Car },
    { title: "Documents & Terms", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Join Our Team</h1>
              <p className="text-muted-foreground">
                Become a TechConnect technician and start earning today
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isActive = step === index + 1;
                const isCompleted = step > index + 1;
                
                return (
                  <div key={index} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive ? 'border-primary bg-primary text-primary-foreground' :
                      isCompleted ? 'border-green-500 bg-green-500 text-white' :
                      'border-muted-foreground text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {stepItem.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Step {step} of 4: {steps[step - 1].title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {step < 4 ? (
                    <Button onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit}>
                      Submit Application
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Flexible Schedule</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose your own hours and work when it suits you
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Competitive Pay</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Earn up to $75/hour with bonuses and incentives
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Support Team</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get help from our experienced support team
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
