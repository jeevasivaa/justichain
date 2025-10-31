import React, { useState } from 'react';
import { PetitionCategory, Location } from '../types';
import { karurLocations, KarurBlock } from '../data/karurLocations';
import { namakkalLocations, NamakkalTaluk } from '../data/namakkalLocations';
import { Modal } from '../components/Modal';

interface PetitionComplaintProps {
  addPetition: (title: string, description: string, category: PetitionCategory, location: Location | null, detailedLocation: { district: string; blockOrTaluk: string; panchayatOrVillage: string; } | null) => string;
}

const locationData = {
  Karur: karurLocations,
  Namakkal: namakkalLocations,
};

type District = keyof typeof locationData;

export const PetitionComplaint: React.FC<PetitionComplaintProps> = ({ addPetition }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PetitionCategory>(PetitionCategory.Other);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationStatus, setLocationStatus] = useState('Fetching location...');
  const [error, setError] = useState('');
  
  const [trackingId, setTrackingId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy ID');
  
  const [locationChoice, setLocationChoice] = useState<'district' | 'geo'>('district');
  const [selectedDistrict, setSelectedDistrict] = useState<District | ''>('');
  const [selectedBlockOrTaluk, setSelectedBlockOrTaluk] = useState('');
  const [selectedPanchayatOrVillage, setSelectedPanchayatOrVillage] = useState('');
  
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationStatus('Location captured successfully.');
        },
        () => {
          setLocationStatus('Unable to retrieve location. You can still submit the petition.');
        }
      );
    } else {
      setLocationStatus('Geolocation is not supported by this browser.');
    }
  }, []);
  
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const district = e.target.value as District;
      setSelectedDistrict(district);
      setSelectedBlockOrTaluk('');
      setSelectedPanchayatOrVillage('');
  };

  const handleBlockOrTalukChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const blockOrTaluk = e.target.value;
      setSelectedBlockOrTaluk(blockOrTaluk);
      setSelectedPanchayatOrVillage('');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(PetitionCategory.Other);
    setSelectedDistrict('');
    setSelectedBlockOrTaluk('');
    setSelectedPanchayatOrVillage('');
    setTrackingId('');
    setError('');
    setLocationChoice('district');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(trackingId).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy ID'), 2000);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Title and Description are required.');
      return;
    }

    let detailedLocation = null;
    if (locationChoice === 'district') {
        if (!selectedDistrict || !selectedBlockOrTaluk || !selectedPanchayatOrVillage) {
            setError('Please provide the complete location details (District, Block/Taluk, and Panchayat/Village).');
            return;
        }
        detailedLocation = { 
            district: selectedDistrict, 
            blockOrTaluk: selectedBlockOrTaluk, 
            panchayatOrVillage: selectedPanchayatOrVillage 
        };
    } else { // locationChoice === 'geo'
        if (!location) {
            setError('Could not fetch your location. Please grant permission, or choose to enter your district manually.');
            return;
        }
    }
    
    setError('');
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newPetitionId = addPetition(title, description, category, location, detailedLocation);
      setIsSubmitting(false);
      setTrackingId(newPetitionId);
      setIsModalOpen(true);
    }, 1500);
  };

  const blocksOrTaluks = selectedDistrict ? Object.keys(locationData[selectedDistrict]) : [];
  const panchayatsOrVillages = selectedDistrict && selectedBlockOrTaluk ? locationData[selectedDistrict][selectedBlockOrTaluk as keyof typeof locationData[District]] : [];

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">File a Petition Anonymously</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Your voice matters. Help us build a more just society.</p>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="A brief title for the petition"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as PetitionCategory)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {Object.values(PetitionCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Provide a detailed description of the issue. Include dates, times, and any other relevant information."
              required
            ></textarea>
          </div>
          
           <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location Method</label>
              <div className="flex items-center space-x-4 rounded-md bg-gray-100 dark:bg-gray-900/50 p-2">
                  <label className="flex-1 text-center">
                      <input 
                          type="radio" 
                          value="district" 
                          checked={locationChoice === 'district'} 
                          onChange={() => setLocationChoice('district')}
                          className="sr-only"
                      />
                      <div className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors ${locationChoice === 'district' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                          From Karur/Namakkal
                      </div>
                  </label>
                  <label className="flex-1 text-center">
                      <input 
                          type="radio" 
                          value="geo" 
                          checked={locationChoice === 'geo'} 
                          onChange={() => setLocationChoice('geo')}
                          className="sr-only"
                      />
                       <div className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors ${locationChoice === 'geo' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                          Use Current Location
                      </div>
                  </label>
              </div>
          </div>


          {locationChoice === 'district' && (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md space-y-4 animate-fade-in">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Location Details (Required)</h3>
              <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300">District</label>
                  <select
                    id="district"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required={locationChoice === 'district'}
                  >
                    <option value="">-- Select a District --</option>
                    {Object.keys(locationData).map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                {selectedDistrict && (
                  <div className="animate-fade-in">
                    <label htmlFor="blockOrTaluk" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Block / Taluk</label>
                    <select
                      id="blockOrTaluk"
                      value={selectedBlockOrTaluk}
                      onChange={handleBlockOrTalukChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      disabled={!selectedDistrict}
                      required={locationChoice === 'district'}
                    >
                      <option value="">-- Select a Block / Taluk --</option>
                      {blocksOrTaluks.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedBlockOrTaluk && (
                  <div className="animate-fade-in">
                    <label htmlFor="panchayatOrVillage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Panchayat / Village</label>
                    <select
                      id="panchayatOrVillage"
                      value={selectedPanchayatOrVillage}
                      onChange={(e) => setSelectedPanchayatOrVillage(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      disabled={!selectedBlockOrTaluk}
                      required={locationChoice === 'district'}
                    >
                      <option value="">-- Select a Panchayat / Village --</option>
                      {panchayatsOrVillages.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                )}
            </div>
          )}

          {locationChoice === 'geo' && (
            <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md animate-fade-in">
              <i className="fas fa-map-marker-alt mr-2"></i>
              {locationStatus}
            </div>
          )}


          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Petition Securely'
              )}
            </button>
          </div>
        </form>
      </div>

       <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Submission Successful!"
      >
        <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <i className="fas fa-check h-6 w-6 text-green-600"></i>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Your petition has been submitted anonymously. Please save your unique tracking ID to check its status later.</p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Your Tracking ID</p>
                <p className="text-lg font-bold font-mono text-gray-900 dark:text-white break-all">{trackingId}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <button
                    onClick={handleCopyId}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                    <i className="fas fa-copy mr-2"></i>
                    {copyButtonText}
                </button>
                <button
                    onClick={handleCloseModal}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                    Close
                </button>
            </div>
        </div>
      </Modal>

    </div>
  );
};