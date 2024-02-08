// import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
// import { NextRequest, NextResponse } from 'next/server';
// import { NEXT_PUBLIC_URL } from '../../config';

// async function getResponse(req: NextRequest): Promise<NextResponse> {
//   let accountAddress: string | undefined = '';
//   let text: string | undefined = '';

//   const body: FrameRequest = await req.json();
//   const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

//   if (isValid) {
//     accountAddress = message.interactor.verified_accounts[0];
//   }

//   if (message?.input) {
//     text = message.input;
//   }

//   if (message?.button === 3) {
//     return NextResponse.redirect(
//       'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
//       { status: 302 },
//     );
//   }

//   return new NextResponse(
//     getFrameHtmlResponse({
//       buttons: [
//         {
//           label: `🌲 Text: ${text}`,
//         },
//       ],
//       image: `${NEXT_PUBLIC_URL}/park-2.png`,
//       post_url: `${NEXT_PUBLIC_URL}/api/frame`,
//     }),
//   );
// }

// export async function POST(req: NextRequest): Promise<Response> {
//   return getResponse(req);
// }

// export const dynamic = 'force-dynamic';

import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

// Helper function to fetch a random dad joke
async function fetchDadJoke() {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { 'Accept': 'application/json', 'User-Agent': 'My Frame App (https://github.com/myusername/myrepo)' }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch dad joke');
  }
  const data = await response.json();
  return data.joke;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (message?.button === 1) {
    // Fetch a dad joke when the dad joke button is clicked
    try {
      const joke = await fetchDadJoke();
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: 'Dad Joke',
            },
          ],
          image: `https://placehold.co/600x400?text=${joke}`,
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    } catch (error) {
      console.error('Error fetching dad joke:', error);
      // Handle error or return a default message
    }
  }

  // Default response if no button is clicked or if fetching dad joke fails
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Dad Joke',
        },
      ],
      image: `${NEXT_PUBLIC_URL}/default.png`,
      post_url: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
