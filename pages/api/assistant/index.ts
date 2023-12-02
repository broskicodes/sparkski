import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';

config();
        
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {  
    // Create a new assistant
    const createAssistantResponse = await fetch('https://api.openai.com/v1/assistants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAi-Beta': 'assistants=v1', // Add the OpenAi-Beta header
      },
      body: JSON.stringify({
        name: 'Sparkski',
        model: 'gpt-4-1106-preview',
        // description: "",
        instructions: process.env.DEFAULT_ASSISTANT_INSTRUCTION ?? "",
        // tools: ["retrieval"]
      }),
    });

    const createAssistantData = await createAssistantResponse.json();

    if (createAssistantData.error) {
      console.error('Error creating assistant:', createAssistantData.error);
      return false;
    }

    res.status(200).json(createAssistantData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}