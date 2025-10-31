export enum Page {
  Home = 'Home',
  PetitionComplaint = 'PetitionComplaint',
  LegalChatbot = 'LegalChatbot',
  Dashboard = 'Dashboard',
  AdminPanel = 'AdminPanel',
  TrackPetition = 'TrackPetition',
  AdminSignUp = 'AdminSignUp',
}

export enum PetitionCategory {
  Corruption = 'Corruption',
  HumanRights = 'Human Rights Violation',
  Environmental = 'Environmental Crime',
  Fraud = 'Fraud',
  Other = 'Other',
}

export enum PetitionStatus {
  Submitted = 'Submitted',
  Verified = 'Verified',
  Resolved = 'Resolved',
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Admin {
  username: string;
  password: string;
}

export interface Petition {
  id: string;
  title: string;
  description: string;
  category: PetitionCategory;
  timestamp: number;
  status: PetitionStatus;
  location: Location | null;
  detailedLocation?: {
    district: string;
    blockOrTaluk: string;
    panchayatOrVillage: string;
  } | null;
  adminFeedback?: string;
}

export interface BlockchainEntry {
  hash: string;
  timestamp: number;
  reportId: string;
  previousHash: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}