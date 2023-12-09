import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://interests-api.sparkpods.xyz/graphic');
      const data = Buffer.from(await response.arrayBuffer());
      
      // res.setHeader('Content-Type', 'image/png');
      // res.status(200).send(data);
      return new Response(data, {
        headers: {
          'Content-Type': 'image/png'
        },
        status: 200
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
      // res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, interest, thread_id, run_id, call_id } = await req.json();
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

      // res.status(200).json(data);
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      // res.status(500).json({ message: 'Internal Server Error' });
      return new Response('Internal Server Error', { status: 500 });
    }
  } else {
    // res.status(405).json({ message: 'Method Not Allowed' });
    return new Response('Method Not Allowed', { status: 405 });
  }
}
