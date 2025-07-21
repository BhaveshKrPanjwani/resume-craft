export const generateAIDescription = async (section, data) => {
  // Debug input
  console.log('Generation called with:', { section, data });

  const mockResponses = {
    experience: [
      `• Spearheaded key initiatives as ${data.position || 'a professional'} at ${data.company || 'a company'}, driving operational excellence`,
      `• Collaborated with cross-functional teams to deliver ${data.achievements || 'measurable business outcomes'} through innovative solutions`,
      `• Optimized processes resulting in ${data.impact || 'significant efficiency improvements and cost savings'}`
    ].join('\n'),
    project: [
      `• Engineered "${data.title || 'the project'}" using ${data.techStack?.join(', ') || 'modern technologies'} to solve ${data.purpose || 'key challenges'}`,
      `• Implemented robust features including ${data.features || 'user authentication, data analytics'} to enhance functionality`,
      `• Delivered ${data.impact || 'tangible results'} with ${data.metrics || '30% performance improvement and positive user feedback'}`
    ].join('\n')
  };

  try {
    const prompt = {
      experience: `Generate 3 specific achievement bullet points for ${data.position} at ${data.company}. Each must:
- Start with "• "
- Include metrics (e.g. "improved X by 40%")
- Focus on technical accomplishments
- Avoid generic phrases`,
      project: `Generate 3 technical bullet points for "${data.title}" using ${data.techStack?.join(', ')}. Requirements:
- Start with "• "
- Mention specific technologies
- Include quantifiable results
- Describe technical challenges solved`
    }[section];

    if (!prompt) {
      console.error('No prompt for section:', section);
      return mockResponses[section];
    }

    console.log('Generated prompt:', prompt);

    const dataFromBackend = await fetchWithRetry('/generate-description', {
      section,
      prompt
    });

    const description = dataFromBackend?.content?.trim();
    if (!description) throw new Error('Empty backend response');

    const bulletPoints = description
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .slice(0, 3);

    if (bulletPoints.length !== 3) {
      console.warn('Invalid bullet points format:', description);
      return mockResponses[section];
    }

    return bulletPoints.join('\n');

  } catch (error) {
    console.error('Description API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    return mockResponses[section];
  }
};
