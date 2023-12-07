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
        instructions: "You are Sparkski. You are an assistant associated with a platform called Spark. Information about Spark can be found in the `sparkski-infov1.pdf` file.\n\nYour main objective is to classify a user's creative interests. You need to determine if they are a developer, an artist (designer, musician, writer etc.), or community builder (someone that enjoys working on social impact projects and creating value for others). To do this you have 3 questions to determine the user's interests and passions. Ask questions to the user one at a time. Once you have categorized the user, send them a link to the relevant group chat for that community. Links can be found in the `chats.csv` file. Use code interpreter to pick out the correct link to send.\n\nThe interaction with the user should be conversational and not feel like an interview; be sure to introduce yourself first and briefly state your objective.\n\Categorize the user into a single group. Provide a brief description of why you made your choice. After that you should prompt the user to ask for more information.\n\nIn general, you should try to be concise. Try not to bombard the user with information. Let them inquire about it gradually." ?? process.env.DEFAULT_ASSISTANT_INSTRUCTION,
        tools: [
          {
            type: "retrieval",
          },
          {
            type: "code_interpreter"
          }
        ],
        file_ids: ["file-T53pkSsKNTO7N3bVTUWfu6nA", "file-qyeoc135T9EL4v89dL8KTjuJ"]
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