import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const WhatsAppChat = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "👋 Hi there! Welcome to Quantivo. How can we help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { label: '🎓 View Tours', value: 'I want to see virtual tours' },
    { label: '💰 Pricing', value: 'How much does a tour cost?' },
    { label: '🎬 Become a Creator', value: 'How do I become a content creator?' },
    { label: '❓ Ask Question', value: 'I have a question' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { text: text, sender: 'user', language: language };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setShowBubble(false);

    try {
      const history = messages.slice(-10).map(msg => ({
        sender: msg.sender,
        text: msg.text,
        language: msg.language || 'en'
      }));

      const reply = await chatAPI.sendMessage(text, history, language);
      setMessages(prev => [...prev, { text: reply, sender: 'bot', language: language }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting. Please try again later.", 
        sender: 'bot',
        language: language
      }]);
    }
    setIsLoading(false);
  };

  const handleQuickReply = (text) => {
    handleSend(text);
  };

  // Inline styles for guaranteed positioning
  const floatingButtonStyle = {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  };

  const chatWindowStyle = {
    position: 'fixed',
    bottom: '6rem',
    right: '1.5rem',
    zIndex: 9999,
    width: '380px',
    maxWidth: 'calc(100vw - 2rem)',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '500px',
    transition: 'all 0.3s ease'
  };

  const bubbleStyle = {
    backgroundColor: 'white',
    color: '#1f2937',
    padding: '0.5rem 1rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    marginBottom: '0.75rem',
    position: 'relative',
    maxWidth: '280px',
    animation: 'bounce 2s infinite'
  };

  const bubbleArrowStyle = {
    position: 'absolute',
    bottom: '-8px',
    right: '24px',
    width: '12px',
    height: '12px',
    backgroundColor: 'white',
    transform: 'rotate(45deg)'
  };

  return (
    <>
      {/* Floating Button with Bubble */}
      <div style={floatingButtonStyle}>
        {showBubble && !isOpen && (
          <div style={bubbleStyle}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>💬 Need help? Chat with us!</span>
            <div style={bubbleArrowStyle}></div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            padding: '1rem',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(34,197,94,0.4)',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Chat"
        >
          {isOpen ? (
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div style={chatWindowStyle}>
          {/* Header */}
          <div style={{
            backgroundColor: '#1a237e',
            color: 'white',
            borderRadius: '16px 16px 0 0',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              💬
            </div>
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: '0.875rem', margin: 0 }}>QuantivoVR</h3>
              <p style={{ fontSize: '0.75rem', color: '#93c5fd', margin: 0 }}>Online • Usually replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            maxHeight: '280px'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '0.75rem'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '0.5rem 1rem',
                    borderRadius: '16px',
                    fontSize: '0.875rem',
                    backgroundColor: msg.sender === 'user' ? '#1a237e' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#1f2937',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e5e7eb',
                    borderBottomRightRadius: msg.sender === 'user' ? '0' : '16px',
                    borderBottomLeftRadius: msg.sender === 'user' ? '16px' : '0',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  padding: '0.5rem 1rem',
                  borderRadius: '16px',
                  borderBottomLeftRadius: 0,
                  fontSize: '0.875rem',
                  color: '#1f2937'
                }}>
                  <span style={{ animation: 'pulse 1.5s infinite' }}>Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div style={{
            padding: '0.5rem 1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            borderTop: '1px solid #f3f4f6'
          }}>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(reply.value)}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                {reply.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            padding: '0.5rem',
            display: 'flex',
            gap: '0.5rem',
            borderRadius: '0 0 16px 16px',
            backgroundColor: 'white'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1a237e'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
            <button
              onClick={() => handleSend(input)}
              style={{
                backgroundColor: '#1a237e',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d1b2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a237e'}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 480px) {
          .chat-window {
            right: 10px !important;
            width: calc(100% - 20px) !important;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppChat;