export const runtime = 'edge';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://interests-api.sparkpods.xyz/graphic');
      const data = Buffer.from(await response.arrayBuffer());
      
      return new Response(data, {
        headers: {
          'Content-Type': 'image/png'
        },
        status: 200
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
}
