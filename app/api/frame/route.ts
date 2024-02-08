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
// Function to insert newline characters into a long text and URL encode for use in an image URL
function formatJokeForImage(joke: string, maxLength: number) {
  let result = '';
  let currentLine = '';

  // Split the joke into words
  const words = joke.split(' ');
  words.forEach((word: string, index: number) => {
    // Add the word to the current line if it fits
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine.length > 0 ? '+' : '') + word; // Separate words with a '+'
    } else {
      // If the current line is full, append it to the result and start a new line
      result += (result.length > 0 ? '\n' : '') + currentLine; // Separate lines with '%0A'
      currentLine = word; // Start a new line with the current word
    }

    // If it's the last word, append the current line to the result
    if (index === words.length - 1) {
      result += (result.length > 0 ? '\n' : '') + currentLine;
    }
  });

  return result;
}


async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (message?.button === 1) {
    try {
      const joke = await fetchDadJoke();
      // Convert the joke to an SVG format
      const svg = generateSvgImage(joke, 600, 400); // Width and height can be adjusted
      return new NextResponse(svg, {
        headers: { 'Content-Type': 'image/svg+xml' },
      });
    } catch (error) {
      console.error('Error fetching dad joke:', error);
      // Handle error or return a default message
    }
  }

  // Default response if no button is clicked or if fetching dad joke fails
  const defaultSvg = generateSvgImage("Default Text", 600, 400);
  return new NextResponse(defaultSvg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}

// Helper function to generate SVG image with text
function generateSvgImage(text: string, width: number, height: number): string {
  const formattedText = formatJokeForImage(text, 50); // Use this function if you want to format text
  // SVG template with text. Adjust styles as needed.
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <text x="10" y="20" font-family="Arial" font-size="16" fill="black">
        ${formattedText.split('\n').map((line, index) => `<tspan x="10" dy="${index * 20}">${line}</tspan>`).join('')}
      </text>
    </svg>
  `;
}


export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
