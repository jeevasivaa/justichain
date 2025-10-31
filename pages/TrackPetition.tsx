import React, { useState } from 'react';
import { Petition, PetitionStatus } from '../types';

interface TrackPetitionProps {
    petitions: Petition[];
}

const statusColorMap: Record<PetitionStatus, string> = {
    [PetitionStatus.Submitted]: 'bg-gray-200 text-gray-800',
    [PetitionStatus.Verified]: 'bg-yellow-200 text-yellow-800',
    [PetitionStatus.Resolved]: 'bg-green-200 text-green-800',
};

const statusDescriptionMap: Record<PetitionStatus, string> = {
    [PetitionStatus.Submitted]: 'Your petition has been successfully submitted and is awaiting review.',
    [PetitionStatus.Verified]: 'An administrator has verified your petition, and it is currently under investigation.',
    [PetitionStatus.Resolved]: 'The issue has been addressed, and your petition is now marked as resolved.',
};

export const TrackPetition: React.FC<TrackPetitionProps> = ({ petitions }) => {
    const [trackingId, setTrackingId] = useState('');
    const [foundPetition, setFoundPetition] = useState<Petition | null>(null);
    const [searched, setSearched] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
        const petition = petitions.find(p => p.id === trackingId.trim());
        setFoundPetition(petition || null);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Track Your Petition</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Enter your tracking ID to see the current status of your petition.</p>

                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2 mb-8">
                    <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter your tracking ID"
                        className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!trackingId.trim()}
                        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Track
                    </button>
                </form>

                {searched && (
                    <div className="animate-fade-in">
                        {foundPetition ? (
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Petition Status</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</label>
                                            <p className="font-semibold">{foundPetition.title}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted On</label>
                                            <p>{new Date(foundPetition.timestamp).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</label>
                                            <p className="flex items-center">
                                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusColorMap[foundPetition.status]}`}>
                                                    {foundPetition.status}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{statusDescriptionMap[foundPetition.status]}</p>
                                        </div>
                                    </div>
                                </div>
                                {foundPetition.adminFeedback && (
                                     <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                                         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Official Response</h3>
                                         <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                             <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{foundPetition.adminFeedback}</p>
                                         </div>
                                     </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                 <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Petition Not Found</p>
                                <p className="text-gray-500 dark:text-gray-400">Please check your tracking ID and try again.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};