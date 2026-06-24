import z from "zod";

// Alumni Directory (types used across the app)
// NOTE: This is declared before FrontendUserSchema so it can be referenced there.
export const AlumniProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  location: z.string(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  graduationYear: z.number().optional(),
  skills: z.array(z.string()),
  bio: z.string().optional()
});

export type AlumniProfile = z.infer<typeof AlumniProfileSchema>;

// User (from auth)

export const BackendUserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['admin', 'superadmin']),
  isActive: z.boolean().optional(),
  permissions: z.array(z.object({
    resource: z.string(),
    actions: z.array(z.string())
  })).optional(),
}); 

export type BackendUser = z.infer<typeof BackendUserSchema>;
export type UserRole = 'admin' | 'superadmin';

export const FrontendUserSchema = BackendUserSchema.extend({
  id: z.string(),
  username: z.string(),
  profile: AlumniProfileSchema.optional(),
}).omit({ _id: true });

export type FrontendUser = z.infer<typeof FrontendUserSchema>;


export interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  exp: number;
}

export type User = FrontendUser;



// Events
export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  location: z.string(),
  organizer: z.string(),
  attendees: z.array(z.string())
});

export type Event = z.infer<typeof EventSchema>;

// Jobs
export const JobPostingSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  salary: z.string().optional(),
  description: z.string(),
  postedBy: z.string(),
  applyUrl: z.string().optional()
});

export type JobPosting = z.infer<typeof JobPostingSchema>;

// Messages
export const MessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  content: z.string(),
  timestamp: z.string().datetime(),
  read: z.boolean()
});

export type Message = z.infer<typeof MessageSchema>;

// Notifications
export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['event', 'job', 'message', 'network']),
  read: z.boolean(),
  timestamp: z.string()
});

export type Notification = z.infer<typeof NotificationSchema>;

