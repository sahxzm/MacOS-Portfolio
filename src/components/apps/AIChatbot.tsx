import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AIChatWindow from './AIChatWindow';

interface AIChatbotProps {
  onClose?: () => void;
}

export default function AIChatbot({ onClose }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    // Call the parent's onClose if it exists
    if (onClose) {
      onClose();
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    if (!message.trim() || isLoading) {
      throw new Error('Message cannot be empty');
    }

    setIsLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      const error = 'Error: Gemini API key is not set. Please check your .env file.';
      console.error(error);
      setIsLoading(false);
      return error;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const result = await model.generateContent(message);
      const response = await result.response;
      setIsLoading(false);
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      setIsLoading(false);
      return `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <AIChatWindow
          onClose={handleClose}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
