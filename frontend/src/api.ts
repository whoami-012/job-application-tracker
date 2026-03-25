import axios from 'axios';

const API_URL = '/api/applications';

export type JobStatus = 
  | "Applied"
  | "Under Review"
  | "Interview Scheduled"
  | "Interviewed"
  | "Offer Received"
  | "Accepted"
  | "Rejected"
  | "Withdrawn";

export interface JobApplication {
  id: string;
  company_name: string;
  job_title: string;
  job_description?: string;
  job_url?: string;
  status: JobStatus;
  notes?: string;
  resume_filename?: string;
  applied_at: string;
  updated_at: string;
}

export interface JobCreate {
  company_name: string;
  job_title: string;
  job_description?: string;
  job_url?: string;
  status?: JobStatus;
  notes?: string;
}

export const api = {
  fetchApplications: async (): Promise<JobApplication[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createApplication: async (data: JobCreate): Promise<JobApplication> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  updateApplication: async (id: string, data: Partial<JobCreate>): Promise<JobApplication> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: JobStatus): Promise<JobApplication> => {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  deleteApplication: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
