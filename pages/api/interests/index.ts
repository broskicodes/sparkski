import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://interests-api.sparkpods.xyz/graphic');
      const data = Buffer.from(await response.arrayBuffer());
      
      res.setHeader('Content-Type', 'image/png');
      res.status(200).send(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, interest, thread_id, run_id, call_id } = req.body;
      const response = await fetch('https://interests-api.sparkpods.xyz/interests', {
        method: 'POST',
        body: JSON.stringify({
          name,
          interest,
          id: thread_id
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await openai.beta.threads.runs.submitToolOutputs(
        thread_id,
        run_id,
        {
          tool_outputs: [{
            tool_call_id: call_id,
            output: response.ok ? "User interests have been successfully recorded." : "An error occurred while recording user interests."
          }]
        }
      )

      const data = await response.json();

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
