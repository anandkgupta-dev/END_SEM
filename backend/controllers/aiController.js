const axios = require('axios');

const analyzeComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required for analysis.'
      });
    }

    // Prompt
    const prompt = `
Analyze the following complaint carefully.

Title: ${title}
Description: ${description}
Category: ${category || 'Unknown'}

Return ONLY valid JSON in this exact format:

{
  "priority": "High / Medium / Low",
  "department": "Suggested Department Name",
  "summary": "A concise 1-2 sentence summary of the issue.",
  "responseMessage": "A polite auto-generated response to the user acknowledging their specific issue."
}
`;

    // API Request
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemma-2-9b-it:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://end-sem-backend-e8cx.onrender.com',
          'Content-Type': 'application/json'
        }
      }
    );

    // Raw AI Response
    const aiContent = response.data.choices[0].message.content;

    console.log('RAW AI RESPONSE:', aiContent);

    let result = {};

    // Try Direct JSON Parse
    try {
      result = JSON.parse(aiContent);
    } catch (e) {

      // Try Extracting JSON from text
      try {
        const match = aiContent.match(/\{[\s\S]*\}/);

        if (match) {
          result = JSON.parse(match[0]);
        } else {

          // Fallback Result
          result = {
            priority: 'Medium',
            department: 'General Support',
            summary: aiContent,
            responseMessage:
              'Your complaint has been received and is currently under review.'
          };
        }
      } catch (err) {

        // Final Safe Fallback
        result = {
          priority: 'Medium',
          department: 'General Support',
          summary: 'AI analysis could not be completed properly.',
          responseMessage:
            'Your complaint has been received successfully.'
        };
      }
    }

    // Send Response
    res.status(200).json(result);

  } catch (error) {

    console.error(
      'AI Analysis Error:',
      error?.response?.data || error.message
    );

    res.status(500).json({
      message: 'Failed to analyze complaint',
      error: error?.response?.data || error.message
    });
  }
};

module.exports = {
  analyzeComplaint
};