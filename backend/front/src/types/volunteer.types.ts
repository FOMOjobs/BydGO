export type VolunteerCategory = 
  | 'education' 
  | 'ecology' 
  | 'sport' 
  | 'culture' 
  | 'social' 
  | 'health';

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  organization: string;
  category: VolunteerCategory;
  location: {
    address: string;
    coordinates: [number, number]; // [lng, lat]
  };
  date: {
    start: string;
    end: string;
  };
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  maxVolunteers: number;
  currentVolunteers: number;
  imageUrl?: string;
  isUrgent?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  timeCommitment: string;
}

export interface VolunteerApplication {
  id: string;
  opportunityId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  motivation: string;
  experience?: string;
  availability: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface FilterState {
  categories: VolunteerCategory[];
  searchQuery: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  difficulty: ('easy' | 'medium' | 'hard')[];
  isUrgentOnly: boolean;
}

export interface ApplicationFormData {
  name: string;
  email: string;
  phone?: string;
  motivation: string;
  experience?: string;
  availability: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}