import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint as Paw, Calendar, FileText, Users, Clock, Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { UserRole } from '../types';
import Button from '../components/ui/Button';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (isAuthenticated && user) {
      const dashboardPath = 
        user.role === UserRole.OWNER ? '/owner' : '/staff';
      navigate(dashboardPath);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Modern Pet Care Management</span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-xl">
              Streamline your veterinary clinic operations and provide convenient access for pet owners.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">Learn More</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Clinic Management
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              Everything you need to manage your veterinary clinic and keep pet owners informed.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Calendar className="h-8 w-8 text-primary-600" />}
                title="Appointment Scheduling"
                description="Easily schedule, manage, and track appointments for efficient clinic operations."
              />
              <FeatureCard
                icon={<Paw className="h-8 w-8 text-primary-600" />}
                title="Pet Management"
                description="Maintain comprehensive records of pets, including medical history and treatment information."
              />
              <FeatureCard
                icon={<FileText className="h-8 w-8 text-primary-600" />}
                title="Automated Invoicing"
                description="Generate professional invoices automatically based on treatments provided."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-primary-600" />}
                title="Client Portal"
                description="Give pet owners secure access to their pets' information, appointments, and invoices."
              />
              <FeatureCard
                icon={<Clock className="h-8 w-8 text-primary-600" />}
                title="Treatment Tracking"
                description="Record treatments and procedures with detailed information for each appointment."
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-primary-600" />}
                title="Secure Access"
                description="Role-based access ensures that staff and pet owners see only what they need."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ready to transform your clinic management?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join veterinary clinics that streamline their workflow and improve client satisfaction.
            </p>
            <div className="mt-8">
              <Link to="/login">
                <Button size="lg">Get Started Today</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Paw className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-semibold">PetCare</span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} PetCare Clinic Management. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-base text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default LandingPage;