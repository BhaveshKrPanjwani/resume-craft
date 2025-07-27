// aiUtils.js
import { fetchWithRetry } from './apiClient';

export async function getGroqCompletion(userMessage, model = 'llama3-70b-8192') {
  try {
    const data = await fetchWithRetry('/chat', {
      messages: [{ role: 'user', content: userMessage }],
      model,
    });
    return data.content || '';
  } catch (error) {
    console.error("AI Completion Error:", error);
    throw error;
  }
}

export async function generateCoverLetter(resumeData, jobDescription, model = 'llama3-70b-8192') {
  try {
    const data = await fetchWithRetry('/generate-cover-letter', {
      resume: resumeData,
      job_description: jobDescription,
      model,
    });
    return data.content || data;
  } catch (error) {
    console.error("Cover Letter Generation Error:", error);
    throw error;
  }
}