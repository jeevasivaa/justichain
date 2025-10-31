import React, { useState, useMemo, useEffect } from 'react';
import { Petition, PetitionStatus, BlockchainEntry } from '../types';
import { LogoutIcon } from '../components/icons';

interface AdminPanelProps {
  petitions: Petition[];
  blockchainLog: BlockchainEntry[];
  updatePetitionStatus: (id: string, status: PetitionStatus) => void;
  addFeedbackToPetition: (id: string, feedback: string) => void;
  logout: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center space-x-4">
        <div className={`rounded-full p-3 ${color}`}>
            <i className={`fas ${icon} text-xl text-white`}></i>
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const statusColorMap: Record<PetitionStatus, string> = {
    [PetitionStatus.Submitted]: 'bg-gray-200 text-gray-800',
    [PetitionStatus.Verified]: 'bg-yellow-200 text-yellow-800',
    [PetitionStatus.Resolved]: 'bg-green-200 text-green-800',
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ petitions, blockchainLog, updatePetitionStatus, addFeedbackToPetition, logout }) => {
    const [selectedPetition, setSelectedPetition] = useState<Petition | null>(petitions.length > 0 ? petitions[0] : null);
    const [feedbackText, setFeedbackText] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        if (selectedPetition) {
            setFeedbackText(selectedPetition.adminFeedback || '');
        }
    }, [selectedPetition]);

    const stats = useMemo(() => ({
        total: petitions.length,
        submitted: petitions.filter(p => p.status === PetitionStatus.Submitted).length,
        verified: petitions.filter(p => p.status === PetitionStatus.Verified).length,
        resolved: petitions.filter(p => p.status === PetitionStatus.Resolved).length,
    }), [petitions]);

    const handleStatusChange = (id: string, status: PetitionStatus) => {
        updatePetitionStatus(id, status);
        if(selectedPetition && selectedPetition.id === id) {
            setSelectedPetition({...selectedPetition, status});
        }
    };

    const handleFeedbackSave = () => {
        if (selectedPetition) {
            addFeedbackToPetition(selectedPetition.id, feedbackText);
             if(selectedPetition) {
                setSelectedPetition({...selectedPetition, adminFeedback: feedbackText});
            }
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 3000);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 animate-fade-in bg-gray-50 dark:bg-gray-900 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
                <button onClick={logout} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm">
                    <LogoutIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Petitions" value={stats.total} icon="fa-file-alt" color="bg-blue-500" />
                <StatCard title="Submitted" value={stats.submitted} icon="fa-inbox" color="bg-gray-500" />
                <StatCard title="Verified" value={stats.verified} icon="fa-check-circle" color="bg-yellow-500" />
                <StatCard title="Resolved" value={stats.resolved} icon="fa-gavel" color="bg-green-500" />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Petitions List */}
                <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Petitions ({petitions.length})</h3>
                    </div>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
                        {petitions.length === 0 && <p className="p-4 text-center text-gray-500">No petitions yet.</p>}
                        {petitions.map(p => (
                            <li key={p.id} onClick={() => setSelectedPetition(p)} className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedPetition?.id === p.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{p.title}</p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[p.status]}`}>{p.status}</span>
                                </div>
                                <p className="text-sm font-mono text-gray-400">{p.id.substring(0, 12)}...</p>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Petition Details */}
                <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Petition Details</h3>
                    {selectedPetition ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Title:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPetition.title}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Description:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded max-h-24 overflow-y-auto">{selectedPetition.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">ID:</h4>
                                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{selectedPetition.id}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Category:</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPetition.category}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Timestamp:</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(selectedPetition.timestamp).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Geo Location:</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPetition.location ? `${selectedPetition.location.latitude.toFixed(4)}, ${selectedPetition.location.longitude.toFixed(4)}` : 'Not provided'}</p>
                                </div>
                            </div>
                            {selectedPetition.detailedLocation && (
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Detailed Location:</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{`District: ${selectedPetition.detailedLocation.district}, Block/Taluk: ${selectedPetition.detailedLocation.blockOrTaluk}, Panchayat/Village: ${selectedPetition.detailedLocation.panchayatOrVillage}`}</p>
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Update Status:</h4>
                                <div className="flex space-x-2">
                                    {Object.values(PetitionStatus).map(status => (
                                        <button 
                                            key={status}
                                            onClick={() => handleStatusChange(selectedPetition.id, status)}
                                            className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedPetition.status === status ? statusColorMap[status] : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Feedback</h4>
                                 <textarea
                                    rows={4}
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Provide feedback or updates for the user..."
                                ></textarea>
                                <button 
                                    onClick={handleFeedbackSave}
                                    className="mt-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Save Feedback
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center pt-16">Select a petition to view details.</p>
                    )}
                </div>
            </div>

            {showSuccessPopup && (
                <div className="fixed bottom-8 right-8 z-50 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 px-6 py-4 rounded-lg shadow-xl border border-green-300 dark:border-green-600 flex items-center space-x-3 animate-fade-in-up">
                    <i className="fas fa-check-circle text-2xl"></i>
                    <span className="font-semibold">Feedback saved successfully!</span>
                </div>
            )}
        </div>
    );
};