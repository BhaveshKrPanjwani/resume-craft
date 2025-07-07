// aiUtils.js
const apiKey = import.meta.env.VITE_API_KEY;
 // Set in your environment variables

export const analyzeResume = async (resumeData) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "You are a professional resume analyzer..."
        }],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    return {
      score: Math.floor(Math.random() * 30) + 70, // Still using mock score
      suggestions: content.split('\n').filter(line => line.trim().length > 0)
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return {
      score: 0,
      suggestions: ['Failed to analyze resume. Please try again.']
    };
  }
};

export const generateCoverLetter = async (resumeData, jobDescription) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "You are a professional cover letter writer. Generate a tailored cover letter based on the resume and job description."
        }, {
          role: "user",
          content: `Resume Data: ${JSON.stringify(resumeData)}\n\nJob Description: ${jobDescription}`
        }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || 'Failed to generate cover letter.',
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return {
      content: 'Failed to generate cover letter. Please try again.',
      generatedAt: new Date().toISOString()
    };
  }
};

export const generateProjectDescription = async (title, techStack = []) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "You are a technical writer. Generate concise project descriptions for resumes."
        }, {
          role: "user",
          content: `Create a 2-3 sentence description for a project titled "${title}" ${
            techStack.length ? `using ${techStack.join(', ')}` : ''
          }. Focus on what was built and technologies used.`
        }],
        temperature: 0.5,
        max_tokens: 200
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || `A project about ${title} demonstrating technical skills.`;
  } catch (error) {
    console.error('Error generating project description:', error);
    return `Developed ${title} project${techStack.length ? ` using ${techStack.join(', ')}` : ''}.`;
  }
};