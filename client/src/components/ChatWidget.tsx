import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Globe } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  language: 'en' | 'tn'; // English or Setswana
}

interface ChatWidgetProps {
  propertyId?: string;
  agentId?: string;
  className?: string;
}

/** 
 * Feature: Real-time Bilingual Chat Widget
 * Addresses pain point: Communication barriers and language accessibility in Botswana
 * Supports English and Setswana with real-time translation capabilities
 */
export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  propertyId, 
  agentId, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'tn'>('en');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TODO: Implement WebSocket connection for real-time messaging
  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setIsConnected(true);
      // Add welcome message
      setMessages([{
        id: '1',
        text: currentLanguage === 'en' 
          ? "Hello! How can I assist you with this property?" 
          : "Dumela! Ke ka go thusa jang ka ntlo e?",
        sender: 'system',
        timestamp: new Date(),
        language: currentLanguage
      }]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentLanguage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // TODO: Send message via WebSocket and handle responses
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage === 'en'
          ? "Thank you for your inquiry. Let me get that information for you."
          : "Ke a leboga potso ya gago. Ke tla go naya tshedimosetso e.",
        sender: 'agent',
        timestamp: new Date(),
        language: currentLanguage
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'tn' : 'en');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 bg-beedab-blue hover:bg-beedab-darkblue text-white p-4 rounded-full shadow-lg z-50 ${className}`}
      >
        <MessageCircle className="h-6 w-6" />
        {!isConnected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 ${className}`}
    >
      {/* Header */}
      <div className="bg-beedab-blue text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="font-medium">
            {currentLanguage === 'en' ? 'Property Chat' : 'Puisano ya Ntlo'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleLanguage}
            className="p-1 hover:bg-beedab-darkblue rounded"
            title={currentLanguage === 'en' ? 'Switch to Setswana' : 'Switch to English'}
          >
            <Globe className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-beedab-darkblue rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-beedab-blue text-white'
                    : message.sender === 'system'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={
              currentLanguage === 'en' 
                ? 'Type a message...' 
                : 'Kwala molaetsa...'
            }
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent text-sm"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-beedab-blue text-white p-2 rounded-lg hover:bg-beedab-darkblue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWidget;