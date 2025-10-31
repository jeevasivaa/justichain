import React, { useState, createContext, useContext, useCallback } from 'react';
import { Page, Petition, PetitionCategory, PetitionStatus, Location, BlockchainEntry, Admin } from './types';
import { Home } from './pages/Home';
import { PetitionComplaint } from './pages/PetitionComplaint';
import { LegalChatbot } from './pages/LegalChatbot';
import { Dashboard } from './pages/Dashboard';
import { AdminPanel } from './pages/AdminPanel';
import { TrackPetition } from './pages/TrackPetition';
import { AdminLogin } from './pages/AdminLogin';
import { AdminSignUp } from './pages/AdminSignUp';
import { HomeIcon, PetitionIcon, ChatIcon, DashboardIcon, AdminIcon, TrackIcon } from './components/icons';

interface AppContextType {
  petitions: Petition[];
  blockchainLog: BlockchainEntry[];
  addPetition: (title: string, description: string, category: PetitionCategory, location: Location | null, detailedLocation: { district: string; blockOrTaluk: string; panchayatOrVillage: string; } | null) => string;
  updatePetitionStatus: (id: string, status: PetitionStatus) => void;
  addFeedbackToPetition: (id: string, feedback: string) => void;
  login: (username: string, pass: string) => boolean;
  signup: (username: string, pass: string) => boolean;
  logout: () => void;
  isAdminLoggedIn: boolean;
  setCurrentPage: (page: Page) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactNode;
  label: string;
  isSidebar?: boolean;
}> = ({ page, currentPage, setCurrentPage, icon, label, isSidebar = false }) => {
  const isActive = currentPage === page;
  
  if(isSidebar) {
    return (
       <button
        onClick={() => setCurrentPage(page)}
        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  // Mobile bottom nav style
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex flex-col items-center justify-center space-y-1 w-full py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
        isActive
          ? 'text-blue-400'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [blockchainLog, setBlockchainLog] = useState<BlockchainEntry[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([{ username: 'admin', password: 'password' }]);

  const addPetition = useCallback((title: string, description: string, category: PetitionCategory, location: Location | null, detailedLocation: { district: string; blockOrTaluk: string; panchayatOrVillage: string; } | null): string => {
    const newPetition: Petition = {
      id: `pet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      category,
      timestamp: Date.now(),
      status: PetitionStatus.Submitted,
      location,
      detailedLocation,
    };
    setPetitions(prev => [newPetition, ...prev]);
    
    const previousHash = blockchainLog.length > 0 ? blockchainLog[blockchainLog.length - 1].hash : '0'.repeat(64);
    const blockData = JSON.stringify({ ...newPetition, previousHash });
    const hash = `hash-${Date.now()}-${btoa(blockData).substring(0, 50)}`;
    const newEntry: BlockchainEntry = {
        hash,
        timestamp: newPetition.timestamp,
        reportId: newPetition.id,
        previousHash
    };
    setBlockchainLog(prev => [newEntry, ...prev]);
    return newPetition.id;
  }, [blockchainLog]);

  const updatePetitionStatus = useCallback((id: string, status: PetitionStatus) => {
    setPetitions(prev =>
      prev.map(p => (p.id === id ? { ...p, status } : p))
    );
  }, []);

  const addFeedbackToPetition = useCallback((id: string, feedback: string) => {
    setPetitions(prev =>
      prev.map(p => (p.id === id ? { ...p, adminFeedback: feedback } : p))
    );
  }, []);

  const login = (username: string, password: string): boolean => {
    const adminExists = admins.some(admin => admin.username === username && admin.password === password);
    if (adminExists) {
      setIsAdminLoggedIn(true);
      setCurrentPage(Page.AdminPanel);
      return true;
    }
    return false;
  };
  
  const signup = (username: string, password: string): boolean => {
      if (admins.some(admin => admin.username === username)) {
          return false; // Username already exists
      }
      const newAdmin: Admin = { username, password };
      setAdmins(prev => [...prev, newAdmin]);
      return true;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setCurrentPage(Page.Home);
  };
  
  const appContextValue: AppContextType = {
    petitions,
    blockchainLog,
    addPetition,
    updatePetitionStatus,
    addFeedbackToPetition,
    login,
    signup,
    logout,
    isAdminLoggedIn,
    setCurrentPage,
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <Home setCurrentPage={setCurrentPage} />;
      case Page.PetitionComplaint: return <PetitionComplaint addPetition={addPetition} />;
      case Page.LegalChatbot: return <LegalChatbot />;
      case Page.Dashboard: return <Dashboard petitions={petitions} />;
      case Page.TrackPetition: return <TrackPetition petitions={petitions} />;
      case Page.AdminSignUp: return <AdminSignUp signup={signup} setCurrentPage={setCurrentPage} />;
      case Page.AdminPanel:
        return isAdminLoggedIn ? <AdminPanel petitions={petitions} blockchainLog={blockchainLog} updatePetitionStatus={updatePetitionStatus} addFeedbackToPetition={addFeedbackToPetition} logout={logout} /> : <AdminLogin login={login} setCurrentPage={setCurrentPage} />;
      default: return <Home setCurrentPage={setCurrentPage} />;
    }
  };
  
  const navItems = [
    { page: Page.Home, icon: <HomeIcon />, label: "Home", shortLabel: "Home" },
    { page: Page.PetitionComplaint, icon: <PetitionIcon />, label: "File Petition", shortLabel: "Petition" },
    { page: Page.TrackPetition, icon: <TrackIcon />, label: "Track Petition", shortLabel: "Track" },
    { page: Page.LegalChatbot, icon: <ChatIcon />, label: "Legal AI", shortLabel: "AI" },
    { page: Page.Dashboard, icon: <DashboardIcon />, label: "Dashboard", shortLabel: "Stats" },
    { page: Page.AdminPanel, icon: <AdminIcon />, label: "Admin", shortLabel: "Admin" }
  ];

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 space-y-2">
          <div className="flex-shrink-0 text-white text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-balance-scale mr-2"></i>
              JustiChain
          </div>
          <nav className="flex-grow">
             {navItems.map(item => <NavItem key={item.page} {...item} currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebar />)}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow pb-16 md:pb-0 h-screen overflow-y-auto">
          {renderPage()}
        </main>
        
        {/* Bottom Nav for Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
            <div className="flex justify-around items-center">
                {navItems.map(item => <NavItem key={item.page} {...item} label={item.shortLabel} currentPage={currentPage} setCurrentPage={setCurrentPage} />)}
            </div>
        </nav>
      </div>
    </AppContext.Provider>
  );
};

export default App;