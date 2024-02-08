import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, registerFont, loadImage } from 'canvas';
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


async function generatePngImage(text: string, width: number, height: number) {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Fill background
  context.fillStyle = '#FFFFFF'; // White background
  context.fillRect(0, 0, width, height);

  // Set text properties
  context.fillStyle = '#000000'; // Black text
  context.font = '16px Arial'; // Adjust as needed
  context.textBaseline = 'top';

  // Split text into lines
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    context.fillText(line, 10, 10 + index * 20); // Adjust positioning as needed
  });

  // Convert canvas to PNG
  return canvas.toBuffer();
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  // Assuming body contains the necessary information to fetch the dad joke
  // and determine if a PNG should be generated

  try {
    const joke = await fetchDadJoke(); // Fetch the dad joke
    const pngBuffer = await generatePngImage(joke, 600, 400); // Generate PNG image
    return new NextResponse(pngBuffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    console.error('Error:', error);
    // Handle error or return a default message
    return new NextResponse('Error generating image', { status: 500 });
  }
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
