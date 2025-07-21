import axios from 'axios';

const BACKEND_URL = 'https://server-mu-smoky.vercel.app';
const DEFAULT_MODEL = 'llama3-70b-8192';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// Shared fetch utility with retry logic
async function fetchWithRetry(endpoint, body, retries = MAX_RETRIES) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429 && attempt < retries) {
          const delay = Math.pow(2, attempt) * INITIAL_RETRY_DELAY;
          await new Promise(resolve => setTimeout(resolve, delay));
          attempt++;
          continue;
        }
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt >= retries) throw error;
      attempt++;
    }
  }
}

export async function getGroqCompletion(userMessage, model = DEFAULT_MODEL) {
  try {
    const data = await fetchWithRetry('/chat', {
      messages: [{ role: 'user', content: userMessage }],
      model,
    });
    
    return data.content || '';
  } catch (error) {
    console.error("AI Completion Error:", error);
    throw new Error("Failed to get AI completion. Please try again later.");
  }
}

export async function generateCoverLetter(resumeData, jobDescription, model = DEFAULT_MODEL) {
  try {
    const data = await fetchWithRetry('/generate-cover-letter', {
      resume: resumeData,
      job_description: jobDescription,
      model,
    });
    
    return data.content || data;
  } catch (error) {
    console.error("Cover Letter Generation Error:", error);
    throw new Error("Failed to generate cover letter. Please try again later.");
  }
}

export const generateAIDescription = async (section, data) => {
  // Enhanced mock responses (only used when absolutely necessary)
  const mockResponses = {
    experience: [
      `• Developed innovative solutions as ${data.position || 'a professional'} at ${data.company || 'a company'}`,
      `• Optimized key processes resulting in measurable improvements`,
      `• Collaborated with teams to deliver technical solutions`
    ].join('\n'),
    project: [
      `• Implemented ${data.title || 'the project'} using ${data.techStack?.join(', ') || 'modern technologies'}`,
      `• Solved technical challenges in ${data.techStack?.[0] || 'the stack'}`,
      `• Delivered project outcomes ahead of schedule`
    ].join('\n')
  };

  try {
    console.log('Generating for:', section, data);

    // First try to use backend API
    try {
      const response = await fetchWithRetry('/api/generate-description', {
        section,
        data
      });
      return response.content || mockResponses[section];
    } catch (backendError) {
      console.log('Backend API failed, trying direct Groq API:', backendError);
    }

    // Fallback to direct Groq API if backend fails
    const apiToken = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiToken) {
      console.error('No API key available');
      return mockResponses[section];
    }

    // Metric-focused prompts
    const prompts = {
      experience: `Generate 3 specific achievement bullet points for ${data.position} at ${data.company}. Requirements:
- Each must begin with "• " and be 15-25 words
- Must include at least one quantifiable metric (%, $, timeframes)
- Focus on technical accomplishments, not responsibilities
Example:
• Optimized database queries reducing API response time by 65% (from 1200ms to 420ms)`,
      
      project: `Generate 3 technical bullet points for "${data.title}" using ${data.techStack?.join(', ') || 'these technologies'}. Requirements:
- Each must begin with "• " and mention specific technologies
- Must include measurable outcomes
- Describe technical challenges overcome
Example:
• Built real-time dashboard with React and D3.js visualizing 1M+ data points with 200ms refresh`
    };

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a resume expert. Generate ONLY 3 bullet points that: 1) Start with "• " 2) Include specific numbers 3) Show technical depth 4) Never use placeholders'
          },
          {
            role: 'user',
            content: prompts[section] || prompts.experience
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      console.warn('Empty response from API');
      return mockResponses[section];
    }

    // Strict validation
    const bulletPoints = content.split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map(line => line.trim())
      .slice(0, 3);

    // Verify we got proper bullets with metrics
    const isValid = bulletPoints.length === 3 && 
                   bulletPoints.some(point => /\d|%|\$|time|reduced|increased/i.test(point));

    return isValid ? bulletPoints.join('\n') : mockResponses[section];

  } catch (error) {
    console.error('Generation failed:', {
      error: error.message,
      response: error.response?.data
    });
    return mockResponses[section];
  }
};

// Helper function for consistent formatting
export const formatDescription = (text) => {
  if (!text) return '';
  return text.split('\n')
    .filter(line => line.trim())
    .map(line => line.startsWith('•') ? line : `• ${line}`)
    .join('\n');
};