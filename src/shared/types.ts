export interface Profile {
  bio?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  graduationYear?: number;
  skills?: string[];
}

export interface AlumniProfile extends Profile {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  company?: string;
  jobTitle?: string;
  skills?: string[];
  bio?: string;
  location?: string;
  linkedin?: string;
  avatar?: string;
  password?: string; // mock only
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salaryRange?: string;
  salary?: string;
  type?: 'Full Time' | 'Part Time' | 'Contract' | 'Remote' | 'Internship';
  postedBy: string;
  datePosted: string;
  applyUrl?: string;
  status?: 'active' | 'closed';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  capacity: number;
  category?: 'Networking' | 'Workshops' | 'Reunions' | 'Conferences' | 'Career';
  attendees: string[];
}

export interface Story {
  id: string;
  title: string;
  author: string;
  year: number;
  excerpt: string;
  industry: string;
  image: string;
  fullContent: string;
  tags: string[];
  likes?: number;
  commentsCount?: number;
  datePosted?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  uploadedAt: string;
  category?: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'alumni' | 'admin' | 'super_admin';
  profile?: Profile;
  adminCompany?: string;
  password?: string; // Only for mock
}

