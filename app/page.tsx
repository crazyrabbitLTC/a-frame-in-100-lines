import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Dad Joke',
    },

  ],
  image: `https://placehold.co/600x400/blue/white?text=hello`,
  post_url: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'Dennison Testing',
  description: 'LFG Frames!',
  openGraph: {
    title: 'Testing!',
    description: 'LFG Frames!',
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>dennisonbertram.com</h1>
    </>
  );
}
