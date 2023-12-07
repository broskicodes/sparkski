import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { chat_description, chat_link, thread_id, run_id, call_id } = req.body;

    // if (!chat_description || !chat_link) {
    //   return res.status(400).json({ error: 'Invalid' });
    // }

    await openai.beta.threads.runs.submitToolOutputs(
      thread_id,
      run_id,
      {
        tool_outputs: [{
          tool_call_id: call_id,
          output: chat_link && chat_description ? `link: ${chat_link}, description: ${chat_description}` : "There was an error. No chat could be found matching the user's interests."
        }]
      }
    )

    res.status(200).send("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}