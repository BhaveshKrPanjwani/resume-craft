// C:\Resume-builder\resume-builder\client\src\utils\aiUtils.js

const BACKEND_URL = 'https://server-mu-smoky.vercel.app'; // Your Vercel backend URL

export async function getGroqCompletion(userMessage, model = 'llama3-8b-8192') {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
        model: model,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content; // Assuming the backend sends back { content: "..." }
  } catch (error) {
    console.error("Error communicating with backend (getGroqCompletion):", error);
    throw error;
  }
}

// --- NEW FUNCTION FOR COVER LETTER ---
export async function generateCoverLetter(resumeData, jobDescription, model = 'llama3-8b-8192') {
  try {
    const response = await fetch(`${BACKEND_URL}/generate-cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume: resumeData, // Pass resume data
        job_description: jobDescription, // Pass job description
        model: model,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Assuming the backend returns the generated cover letter content directly,
    // or wraps it in an object like { content: "..." }
    return data; // Return the whole response as the component expects `letter.content`
  } catch (error) {
    console.error("Error generating cover letter with backend (generateCoverLetter):", error);
    throw error;
  }
}