export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: number;
  jobType:| "Full-time"| "Part-time"| "Internship";
  experience: string;
  skills: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}