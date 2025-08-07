import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Car,
  Languages,
  Skills,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface TechnicianFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Professional Information
  experience: string;
  hourlyRate: string;
  specialties: string[];
  certifications: string[];
  skills: string[];
  languages: string[];
  
  // Vehicle Information
  hasVehicle: boolean;
  vehicleType: string;
  vehicleInfo: string;
  
  // Availability
  availability: {
    monday: { morning: boolean; afternoon: boolean; evening: boolean };
    tuesday: { morning: boolean; afternoon: boolean; evening: boolean };
    wednesday: { morning: boolean; afternoon: boolean; evening: boolean };
    thursday: { morning: boolean; afternoon: boolean; evening: boolean };
    friday: { morning: boolean; afternoon: boolean; evening: boolean };
    saturday: { morning: boolean; afternoon: boolean; evening: boolean };
    sunday: { morning: boolean; afternoon: boolean; evening: boolean };
  };
  
  // Documents
  resume: File | null;
  certifications: File[];
  references: string;
  
  // Terms
  agreeToTerms: boolean;
  agreeToBackgroundCheck: boolean;
}

const serviceSpecialties = [
  "Computer Repair & Maintenance",
  "Network Installation & Setup",
  "Smart Home Installation",
  "Security System Installation",
  "Web Development",
  "Mobile App Development",
  "Graphic Design",
  "Video Editing",
  "Audio/Video Equipment Setup",
  "Office Equipment Repair",
  "Data Recovery",
  "Cloud Services Setup",
  "IoT Device Installation",
  "Home Theater Setup",
  "Gaming Console Setup",
  "Drone Setup & Repair",
  "3D Printing Services",
  "VR/AR Setup",
  "Home Automation",
  "Technical Consulting"
];

const timeSlots = [
  { id: "morning", label: "Morning (8 AM - 12 PM)" },
  { id: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
  { id: "evening", label: "Evening (5 PM - 9 PM)" }
];

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" }
];

export default function TechnicianRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<TechnicianFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    experience: "",
    hourlyRate: "",
    specialties: [],
    certifications: [],
    skills: [],
    languages: [],
    hasVehicle: false,
    vehicleType: "",
    vehicleInfo: "",
    availability: {
      monday: { morning: false, afternoon: false, evening: false },
      tuesday: { morning: false, afternoon: false, evening: false },
      wednesday: { morning: false, afternoon: false, evening: false },
      thursday: { morning: false, afternoon: false, evening: false },
      friday: { morning: false, afternoon: false, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false }
    },
    resume: null,
    certifications: [],
    references: "",
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

  const handleAvailabilityChange = (day: string, timeSlot: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          [timeSlot]: checked
        }
      }
    }));
  };

  const handleFileUpload = (field: string, file: File) => {
    if (field === "certifications") {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, file]
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would submit the technician application
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll review your application and contact you within 3-5 business days.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Professional Information</h2>
        <p className="text-muted-foreground">Tell us about your skills and experience</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience *</Label>
          <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">0-1 years</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Expected Hourly Rate ($) *</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
            placeholder="e.g., 50"
            required
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>Service Specialties *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {serviceSpecialties.map((specialty) => (
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
      
      <div className="space-y-2">
        <Label htmlFor="skills">Additional Skills</Label>
        <Textarea
          id="skills"
          placeholder="List any additional technical skills, tools, or software you're proficient with..."
          value={formData.skills.join(", ")}
          onChange={(e) => handleInputChange("skills", e.target.value.split(", ").filter(s => s.trim()))}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="languages">Languages Spoken</Label>
        <Input
          id="languages"
          placeholder="e.g., English, Spanish, French"
          value={formData.languages.join(", ")}
          onChange={(e) => handleInputChange("languages", e.target.value.split(", ").filter(s => s.trim()))}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Availability & Vehicle</h2>
        <p className="text-muted-foreground">When are you available to work?</p>
      </div>
      
      <div className="space-y-4">
        <Label>Weekly Availability *</Label>
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day.id} className="border rounded-lg p-4">
              <Label className="font-medium">{day.label}</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {timeSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${day.id}-${slot.id}`}
                      checked={formData.availability[day.id as keyof typeof formData.availability][slot.id as keyof typeof formData.availability.monday]}
                      onCheckedChange={(checked) => handleAvailabilityChange(day.id, slot.id, checked as boolean)}
                    />
                    <Label htmlFor={`${day.id}-${slot.id}`} className="text-sm">{slot.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasVehicle"
            checked={formData.hasVehicle}
            onCheckedChange={(checked) => handleInputChange("hasVehicle", checked)}
          />
          <Label htmlFor="hasVehicle">I have access to a vehicle for work</Label>
        </div>
        
        {formData.hasVehicle && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange("vehicleType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicleInfo">Vehicle Information</Label>
              <Textarea
                id="vehicleInfo"
                placeholder="Describe your vehicle (make, model, year, any special features for work)..."
                value={formData.vehicleInfo}
                onChange={(e) => handleInputChange("vehicleInfo", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Documents & References</h2>
        <p className="text-muted-foreground">Upload your documents and provide references</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resume">Resume/CV *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload("resume", e.target.files?.[0] || null)}
                className="hidden"
              />
              <Label htmlFor="resume" className="cursor-pointer text-blue-600 hover:text-blue-800">
                Click to upload resume
              </Label>
            </div>
            <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX (max 5MB)</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="certifications">Certifications (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <input
                type="file"
                id="certifications"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach(file => handleFileUpload("certifications", file));
                  }
                }}
                className="hidden"
              />
              <Label htmlFor="certifications" className="cursor-pointer text-blue-600 hover:text-blue-800">
                Click to upload certifications
              </Label>
            </div>
            <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, or images (max 5MB each)</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="references">Professional References</Label>
          <Textarea
            id="references"
            placeholder="Please provide 2-3 professional references with their names, positions, companies, and contact information..."
            value={formData.references}
            onChange={(e) => handleInputChange("references", e.target.value)}
            rows={4}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
          />
          <Label htmlFor="agreeToTerms" className="text-sm">
            I agree to the <Button variant="link" className="text-sm p-0">Terms of Service</Button> and{" "}
            <Button variant="link" className="text-sm p-0">Privacy Policy</Button>
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToBackgroundCheck"
            checked={formData.agreeToBackgroundCheck}
            onCheckedChange={(checked) => handleInputChange("agreeToBackgroundCheck", checked)}
          />
          <Label htmlFor="agreeToBackgroundCheck" className="text-sm">
            I consent to a background check as part of the application process
          </Label>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Join Our Team</h1>
              <p className="text-muted-foreground">Become a technician and start earning with FixNow</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Personal Info</span>
              <span>Professional</span>
              <span>Availability</span>
              <span>Documents</span>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {currentStep < 4 ? (
                      <Button type="button" onClick={nextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Competitive Pay</h3>
                <p className="text-sm text-muted-foreground">
                  Earn $50-150 per hour based on your skills and experience
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flexible Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your own hours and work when it suits you
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Growth Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Access to training, certifications, and career advancement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
