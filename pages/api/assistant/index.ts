import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';

config();

const functions = [
  {
    "type": "function",
    "function": {
      "name": "send_gc_link",
      "description": "Send a link to the user to join the relevant group chat.",
      "parameters": {
        "type": "object",
        "properties": {
          "chat_name": {"type": "string", "description": "The name of the chat to send the user to.", "enum": ["Builders", "Artists", "Community Builders"]},
        },
        "required": ["chat_name"],
      },
    },
  },
  {
    "type": "function",
    "function": {
      "name": "add_personality",
      "description": "Add your single sentence summary of the user's personality to the stored list of interests.",
      "parameters": {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "The name of the user"},
          "personality": {"type": "string", "description": "your summary of the user's personality."}
        },
        "required": ["name", "personality"]
      }
    }
  }
]
        
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
        instructions: "You are Sparkski. You are a digital assistant associated with a platform called Spark. Information about Spark can be found in the `sparkski-infov1.pdf` file. This file is only for you to use to query information about Spark. The user has no knowledge of its content.\n\nYour main objective is to get to know the user you are talking to. You should try to get a sense for the things they like to do in their free time, what they are passionate about, the things they can't stop thinking about, what they often find themselves discussing with friends etc.\n\nAll your interactions with the user should be friendly and conversational. It should never feel like an interrogation or an interview. Be sure to introduce yourself first and briefly state your purpose.\n\nPrompt the user to ask questions often to keep them engaged while still pursuing your goal to understand their interests. Most of your responses should be concise and brief. Try not to bombard the user with too much information in one message.\n\nThere are a list of actions that you can perform (function calls). As you start to get a sense for the user's interests you should begin to use them as you believe appropriate. Always err on the side of asking for permission from the user first before perfoming actions that make use of their personal information.\n\nIn general, if the user seems to be engaging well with you and providing lots of information in their responses to your questions then you are free to continue asking for more information about them. However, if they start to give lazy responses with little information, or seem annoyed at all then shift focus to attempting to perform actions.\n\nYou should aim to call actions within the first few messages of interaction with a user. All actions can be performd multiple times if need be. Should new information about the user be provided later on that shifts your mental model of them, feel free to re-call the relevant action to update it." ?? process.env.DEFAULT_ASSISTANT_INSTRUCTION,
        tools: [
          ...functions,
          {
            type: "retrieval",
          },
          // {
          //   type: "code_interpreter"
          // }
        ],
        file_ids: [
          "file-T53pkSsKNTO7N3bVTUWfu6nA", 
          // "file-qyeoc135T9EL4v89dL8KTjuJ"
        ]
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