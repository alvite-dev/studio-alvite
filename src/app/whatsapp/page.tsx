'use client';

import { useState } from 'react';
import { Search, Phone, MoreVertical, Paperclip, Send } from 'lucide-react';

// Dados mockados das conversas - será substituído pela API do WhatsApp futuramente
const conversations = [
  {
    id: 1,
    name: 'João Silva',
    lastMessage: 'Preciso de um site para minha empresa',
    time: '10:30',
    unread: 2,
    status: 'active'
  },
  {
    id: 2,
    name: 'Maria Santos',
    lastMessage: 'Obrigada pelo atendimento!',
    time: '09:15',
    unread: 0,
    status: 'inactive'
  },
  {
    id: 3,
    name: 'Pedro Costa',
    lastMessage: 'Quando podemos agendar?',
    time: 'Ontem',
    unread: 1,
    status: 'active'
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    lastMessage: 'Adorei o portfólio!',
    time: 'Ontem',
    unread: 0,
    status: 'inactive'
  }
];

// Mensagens mockadas - será substituído pela API do WhatsApp futuramente
const messages = [
  {
    id: 1,
    sender: 'client',
    content: 'Oi! Preciso de um site para minha empresa',
    time: '10:25'
  },
  {
    id: 2,
    sender: 'studio',
    content: 'Olá! Ficamos felizes com seu interesse. Que tipo de site você tem em mente?',
    time: '10:26'
  },
  {
    id: 3,
    sender: 'client',
    content: 'Algo moderno, com design minimalista e responsivo',
    time: '10:28'
  },
  {
    id: 4,
    sender: 'studio',
    content: 'Perfeito! Nosso foco é exatamente criar designs limpos e funcionais. Podemos agendar uma conversa?',
    time: '10:30'
  }
];

export default function WhatsappPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Futuramente aqui será integrado com a API do WhatsApp
      console.log('Enviando mensagem:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">WhatsApp Business</h1>
            <p className="text-sm text-slate-600 mt-1">
              Central de atendimento e relacionamento com clientes
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
            <button className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors">
              Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-72 sm:w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${
                  selectedChat.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-slate-900 truncate">{conversation.name}</h3>
                      {conversation.status === 'active' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 truncate mt-1">{conversation.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1 ml-3">
                    <span className="text-xs text-slate-500">{conversation.time}</span>
                    {conversation.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-slate-700">
                    {selectedChat.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="font-medium text-slate-900 truncate">{selectedChat.name}</h2>
                  <p className="text-xs text-slate-500">
                    {selectedChat.status === 'active' ? 'Online agora' : 'Última atividade: hoje'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'studio' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl ${
                    message.sender === 'studio'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-slate-900 border border-slate-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className={`flex justify-end mt-2 ${
                    message.sender === 'studio' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    <span className="text-xs">{message.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="px-4 sm:px-6 py-4 bg-white border-t border-slate-200">
            <div className="flex items-end space-x-2 sm:space-x-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Digite sua mensagem..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={1}
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                disabled={!messageInput.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}