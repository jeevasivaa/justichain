import React from 'react';
import { Page } from '../types';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
}

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer" onClick={onClick}>
    <i className={`fas ${icon} text-4xl text-blue-500 mb-4`}></i>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {
  return (
    <div className="animate-fade-in">
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block">Welcome to JustiChain</span>
            <span className="block text-blue-400">Your Voice for Justice and Transparency</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300 sm:max-w-3xl">
            A secure and anonymous platform to file petitions, seek legal guidance, and promote accountability for a better society.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <button
              onClick={() => setCurrentPage(Page.PetitionComplaint)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              File a Petition Now
            </button>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A better way to ensure justice
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              We provide the tools necessary for individuals to act and for communities to monitor progress.
            </p>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon="fa-user-secret"
              title="Anonymous Petitions"
              description="Safely file petitions without revealing your identity. Your privacy is our priority."
              onClick={() => setCurrentPage(Page.PetitionComplaint)}
            />
            <FeatureCard
              icon="fa-gavel"
              title="AI Legal Guidance"
              description="Get initial legal information and guidance from our AI-powered chatbot."
              onClick={() => setCurrentPage(Page.LegalChatbot)}
            />
            <FeatureCard
              icon="fa-search"
              title="Track Your Petition"
              description="Check the status of your submitted petition using a unique tracking ID."
              onClick={() => setCurrentPage(Page.TrackPetition)}
            />
            <FeatureCard
              icon="fa-shield-alt"
              title="Secure Ledger"
              description="Petitions are logged in a simulated immutable ledger for enhanced integrity and trust."
              onClick={() => setCurrentPage(Page.AdminPanel)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
