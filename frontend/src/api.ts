import axios from 'axios';

const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();
const API_URL = `${API_BASE_URL}/api/applications`;

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
  location?: string;
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
  location?: string;
  notes?: string;
  resume?: File | null;
}

export const api = {
  fetchApplications: async (): Promise<JobApplication[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createApplication: async (data: JobCreate): Promise<JobApplication> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    
    const response = await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateApplication: async (id: string, data: Partial<JobCreate>): Promise<JobApplication> => {
    // For simplicity, update still uses JSON. If file update is needed, would use FormData.
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  getResumeUrl: (id: string): string => {
    return `${API_URL}/${id}/resume`;
  },

  updateStatus: async (id: string, status: JobStatus): Promise<JobApplication> => {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  deleteApplication: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
