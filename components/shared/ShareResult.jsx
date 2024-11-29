'use client';

import { ShareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import * as htmlToImage from 'html-to-image';

const ShareResult = ({ artist, score, time }) => {
  const [capturedImageUrl, setCapturedImageUrl] = useState('');

  useEffect(() => {
    async function handleCapture() {
      if (document.getElementById('result-card')) {
        try {
          const dataUrl = await htmlToImage.toPng(document.getElementById('result-card'));
          setCapturedImageUrl(dataUrl);
        } catch (error) {
          console.error('Error capturing image:', error);
        }
      }
    }

    handleCapture();
  }, []);

  const dataURLToBlob = (dataURL) => {
    const parts = dataURL.split(',');
    const byteString = atob(parts[1]); // Decode base64
    const mimeString = parts[0].split(':')[1].split(';')[0]; // Extract MIME type

    const arrayBuffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  const handleShare = async () => {
    if (window.location === undefined) return

    const title = `I scored ${score}/10 on the ${artist} quiz in ${(time / 1000).toFixed(1)} seconds! You get 5 seconds to name each song — think you can do better? 🎶 Try it now!`;

    try {
      if (capturedImageUrl) {
        // Convert the data URL to a Blob
        const blob = dataURLToBlob(capturedImageUrl);

        // Create a File object from the Blob
        const file = new File([blob], 'guessthesong.png', { type: 'image/png' });

        const data = {
          files: [file],
          title: title,
          text: title,
        };

        await navigator.share(data);
      } else {
        console.error('No image captured for sharing.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <Button className="mt-8" onClick={() => handleShare()}>
      <ShareIcon /> Share
    </Button>
  );
};

export default ShareResult;
