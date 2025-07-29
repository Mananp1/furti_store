import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contactId?: string;
}

// Submit contact form
export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/contact/submit`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit contact form"
    );
  }
};
