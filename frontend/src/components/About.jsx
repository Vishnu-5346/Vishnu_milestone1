import React from 'react';
import { Shield, Sparkles, Send, BrainCircuit } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About the Platform</h1>
        <p className="text-lg text-gray-600">
          The AI-Based Multilingual Mass Communication Platform is designed to break language barriers and streamline outreach for organizations worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            In an interconnected world, effective communication shouldn't stop at geographical or linguistic borders. Our platform utilizes advanced AI language models to translate, optimize, and safely distribute official notifications to target cohorts.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you are coordinating public health updates, managing internal communications inside a multinational enterprise, or distributing product bulletins, our platform ensures your audience receives messages in their preferred language.
          </p>
        </div>
        <div className="bg-gradient-to-tr from-primary-50 to-secondary-50 p-8 rounded-2xl border border-primary-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-bold text-gray-900">Key Architectural Core</h3>
          </div>
          <ul className="space-y-3.5 text-sm text-gray-700">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
              <span><strong>Role-Based Access Control (RBAC):</strong> Segmented workflows for Administrators, Campaign Managers, and Communication Teams.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
              <span><strong>Contextual AI Generators:</strong> Generates tailored layouts depending on recipient context.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
              <span><strong>Security-First Architecture:</strong> Full encryption using bcrypt hashing and cryptographically signed JWT credentials.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
