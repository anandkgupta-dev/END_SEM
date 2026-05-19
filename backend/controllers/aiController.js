const axios = require('axios');

const analyzeComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required for analysis.' });
    }

    const prompt = `
      Analyze the following complaint:
      Title: ${title}
      Description: ${description}
      Category: ${category || 'Unknown'}

      Please provide the following in a strict JSON format:
      {
        "priority": "High / Medium / Low",
        "department": "Suggested Department Name",
        "summary": "A concise 1-2 sentence summary of the issue.",
        "responseMessage": "A polite auto-generated response to the user acknowledging their specific issue."
      }
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000', // Optional
          'Content-Type': 'application/json'
        }
      }
    );

    const aiContent = response.data.choices[0].message.content;
    let result = {};
    
    try {
        result = JSON.parse(aiContent);
    } catch (e) {
        // Fallback parsing if JSON isn't perfect
        const match = aiContent.match(/\{[\s\S]*\}/);
        if (match) {
            result = JSON.parse(match[0]);
        }
    }

    res.json(result);
  } catch (error) {
    console.error('AI Analysis Error:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to analyze complaint' });
  }
};

module.exports = {
  analyzeComplaint
};
