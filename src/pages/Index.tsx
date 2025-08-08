import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  Wrench, 
  Calendar, 
  Shield, 
  Home, 
  Settings,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Professional Services",
      description: "Licensed and insured technicians for all your home maintenance needs"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Booking",
      description: "Schedule appointments with just a few clicks, 24/7 availability"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Bank-level security to protect your personal information"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Quality Guaranteed",
      description: "Satisfaction guaranteed with our quality assurance program"
    }
  ];

  const services = [
    { name: "Plumbing", price: "$150", duration: "2 hours" },
    { name: "Electrical", price: "$200", duration: "3 hours" },
    { name: "HVAC", price: "$250", duration: "4 hours" },
    { name: "Cleaning", price: "$100", duration: "2 hours" },
    { name: "Carpentry", price: "$175", duration: "2.5 hours" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">FixMy Home Pro</h1>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Customer Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="flex items-center bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Home Services
            <span className="text-blue-600"> Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with licensed professionals for all your home maintenance and repair needs. 
            Book appointments instantly and get quality service guaranteed.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="flex items-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Get Started as Customer
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="flex items-center"
            >
              <Shield className="w-5 h-5 mr-2" />
              Admin Access
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FixMy Home Pro?</h2>
            <p className="text-lg text-gray-600">Professional, reliable, and convenient home services</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Professional services for every home need</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {service.name}
                    <Badge variant="secondary">{service.price}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Average duration: {service.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/auth')}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust FixMy Home Pro
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="flex items-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Sign Up as Customer
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="flex items-center bg-white text-blue-600 hover:bg-gray-50"
            >
              <Shield className="w-5 h-5 mr-2" />
              Admin Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FixMy Home Pro</h3>
              <p className="text-gray-400">
                Professional home services platform connecting customers with licensed technicians.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Plumbing</li>
                <li>Electrical</li>
                <li>HVAC</li>
                <li>Cleaning</li>
                <li>Carpentry</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Access</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="w-full justify-start"
                >
                  Customer Portal
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="w-full justify-start"
                >
                  Admin Portal
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FixMy Home Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;