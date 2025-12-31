
import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === Role.BOT;

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full shadow-sm mt-1 ${
          isBot ? 'bg-indigo-100 text-indigo-600 mr-2' : 'bg-emerald-100 text-emerald-600 ml-2'
        }`}>
          <i className={`fas ${isBot ? 'fa-robot' : 'fa-user'} text-xs`}></i>
        </div>
        
        <div className={`px-4 py-3 rounded-2xl shadow-sm ${
          isBot 
            ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100' 
            : 'bg-emerald-600 text-white rounded-tr-none'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <div className={`text-[10px] mt-1 opacity-60 text-right ${isBot ? 'text-slate-400' : 'text-emerald-100'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
