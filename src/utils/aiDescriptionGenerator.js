import axios from 'axios';

export const generateAIDescription = async (section, data) => {
  // Enhanced mock responses with strict 3-point formatting
  const mockResponses = {
    experience: [
      `• Spearheaded key initiatives as ${data.position || 'a professional'} at ${data.company || 'a company'}, driving operational excellence`,
      `• Collaborated with cross-functional teams to deliver ${data.achievements || 'measurable business outcomes'} through innovative solutions`,
      `• Optimized processes resulting in ${data.impact || 'significant efficiency improvements and cost savings'}`
    ].join('\n'),
    education: `Earned a ${data.degree || 'degree'} in ${data.field || 'a field'} from ${data.institution || 'an institution'}`,
    project: [
      `• Engineered "${data.title || 'the project'}" using ${data.techStack?.join(', ') || 'modern technologies'} to solve ${data.purpose || 'key challenges'}`,
      `• Implemented robust features including ${data.features || 'user authentication, data analytics'} to enhance functionality`,
      `• Delivered ${data.impact || 'tangible results'} with ${data.metrics || '30% performance improvement and positive user feedback'}`
    ].join('\n')
  };

  try {
    const apiToken = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiToken) {
      throw new Error('Groq API key is missing. Set VITE_GROQ_API_KEY in .env.');
    }

    // Strict prompts with 3-point requirement
    const prompt = {
      experience: `Generate EXACTLY 3 bullet points for a ${data.position || 'professional'} role at ${data.company || 'a company'}. Each bullet must:
- Begin with "• " 
- Be 12-20 words
- Cover: 1) Core responsibilities 2) Key achievements 3) Business impact
Example:
• Led team of 5 developers to deliver SaaS platform, reducing client onboarding time by 40%
• Implemented CI/CD pipeline cutting deployment time from 2 hours to 15 minutes
• Received 2023 Innovation Award for developing AI-powered customer support chatbot`,
      project: `Generate EXACTLY 3 bullet points for "${data.title || 'the project'}" using ${data.techStack?.join(', ') || 'modern technologies'}. Each bullet must:
- Begin with "• "
- Be 12-20 words
- Cover: 1) Project purpose 2) Technical implementation 3) Measurable outcomes
Example:
• Developed mobile app using React Native to streamline field service operations for 500+ users
• Integrated IoT sensors with Node.js backend to enable real-time equipment monitoring
• Reduced service ticket resolution time by 35% within first 3 months of launch`
    }[section] || 'Generate a professional description.';

    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.1-8b-instant',
            messages: [
              { 
                role: 'system', 
                content: 'STRICTLY format responses with EXACTLY 3 bullet points. Each must start with "• " and be on a new line. Never use Markdown or numbered lists.' 
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 200,
            temperature: 0.6 // Lower for more consistent formatting
          },
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        let description = response.data.choices[0]?.message?.content?.trim();
        if (!description) throw new Error('Empty API response');

        // Strict formatting enforcement
        const bulletPoints = description
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('•'))
          .slice(0, 3); // Take only first 3 bullets

        // Ensure we have exactly 3 properly formatted points
        if (bulletPoints.length !== 3) {
          return mockResponses[section];
        }

        return bulletPoints.join('\n');
      } catch (error) {
        if (error.response?.status === 429 && attempts < maxAttempts - 1) {
          attempts++;
          const delay = Math.pow(2, attempts) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return mockResponses[section];
  }
};