import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  Slide
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  ArrowUpward as ArrowUpIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ChatBot = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: 1,
        text: t('chatBot.welcomeMessage'),
        sender: 'bot',
        timestamp: new Date(),
        confidence: 'high',
        isWelcomeMessage: true
      }]);
    }
  }, [open, messages.length, t]);

  // Update translatable messages when language changes
  useEffect(() => {
    if (messages.length > 0) {
      setMessages(prevMessages => 
        prevMessages.map(message => {
          if (message.isWelcomeMessage) {
            return { ...message, text: t('chatBot.welcomeMessage') };
          } else if (message.isErrorMessage) {
            return { ...message, text: t('chatBot.errorMessage') };
          }
          return message;
        })
      );
    }
  }, [i18n.language, t]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text
        })
      });

      // Debug: Log the raw response (for developers)
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Get the raw text first to see what we're actually receiving
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw response that failed to parse:', responseText);
        // User-friendly error instead of technical JSON parsing error
        throw new Error('TECHNICAL_ERROR');
      }

      // Handle different types of API errors with user-friendly messages
      if (!response.ok) {
        // Log technical details for developers
        console.error('API Error:', {
          status: response.status,
          error: data.error,
          reason: data.reason,
          retryAfter: data.retryAfter
        });

        // Handle specific error types with user-friendly messages
        if (response.status === 429) {
          // Rate limiting errors - explain what user did wrong
          if (data.reason === 'Too many requests in short time') {
            throw new Error('RATE_LIMIT_BURST');
          } else if (data.reason === 'Too many identical messages') {
            throw new Error('DUPLICATE_MESSAGES');
          } else if (data.reason === 'Requests too frequent') {
            throw new Error('TOO_FAST');
          } else if (data.reason === 'Invalid message format') {
            throw new Error('INVALID_MESSAGE');
          } else if (data.reason === 'Message contains suspicious content') {
            throw new Error('CONTENT_FILTER');
          } else {
            throw new Error('RATE_LIMIT');
          }
        } else if (response.status === 503) {
          throw new Error('SERVICE_UNAVAILABLE');
        } else {
          throw new Error(data.error || 'GENERIC_ERROR');
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        confidence: data.confidence,
        similarity: data.similarity,
        fallback: data.fallback
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Determine user-friendly error message based on error type
      let userErrorMessage;
      let isSystemError = false; // Flag to determine if red error alert should show
      
      switch (error.message) {
        case 'RATE_LIMIT_BURST':
          userErrorMessage = t('chatBot.errors.rateLimitBurst');
          break;
        case 'DUPLICATE_MESSAGES':
          userErrorMessage = t('chatBot.errors.duplicateMessages');
          break;
        case 'TOO_FAST':
          userErrorMessage = t('chatBot.errors.tooFast');
          break;
        case 'INVALID_MESSAGE':
          userErrorMessage = t('chatBot.errors.invalidMessage');
          break;
        case 'CONTENT_FILTER':
          userErrorMessage = t('chatBot.errors.contentFilter');
          break;
        case 'RATE_LIMIT':
          userErrorMessage = t('chatBot.errors.rateLimit');
          break;
        case 'SERVICE_UNAVAILABLE':
          userErrorMessage = t('chatBot.errors.serviceUnavailable');
          isSystemError = true; // Show red alert for system issues
          break;
        case 'TECHNICAL_ERROR':
          userErrorMessage = t('chatBot.errors.technicalError');
          isSystemError = true; // Show red alert for technical issues
          break;
        default:
          // For any other errors, treat as system error
          userErrorMessage = t('chatBot.errorMessage');
          isSystemError = true;
      }
      
      // Only show red error alert for actual system/technical errors
      if (isSystemError) {
        setError(userErrorMessage);
      }
      
      // Always add bot message response (this feels more natural for user)
      const errorMessage = {
        id: Date.now() + 1,
        text: userErrorMessage,
        sender: 'bot',
        timestamp: new Date(),
        confidence: 'error',
        isErrorMessage: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'success';      // Green - High confidence, trust this
      case 'medium': return 'warning';    // Yellow - Medium confidence, proceed with caution
      case 'low': return 'error';         // Red - Low confidence, very uncertain
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getConfidenceText = (confidence) => {
    switch (confidence) {
      case 'high': return t('chatBot.confidence.high');
      case 'medium': return t('chatBot.confidence.medium');
      case 'low': return t('chatBot.confidence.low');
      case 'error': return t('chatBot.confidence.error');
      default: return '';
    }
  };

  if (!open) return null;

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          // Use inset instead of individual positioning to prevent Safari jumps
          inset: { xs: '20px', sm: 'auto' },
          // On desktop, override inset with specific positioning
          bottom: { sm: 20 },
          right: { sm: 20 },
          top: { sm: 'auto' },
          left: { sm: 'auto' },
          width: { xs: 'auto', sm: 450 },
          height: { xs: 'auto', sm: 600 },
          // Use dvh for proper mobile viewport handling, fallback to vh
          maxHeight: { 
            xs: ['calc(100vh - 40px)', 'calc(100dvh - 40px)'], 
            sm: 600 
          },
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1300,
          // Match your site's design - remove border radius for consistency
          borderRadius: 0,
          overflow: 'hidden',
          // Prevent iOS Safari bounce scrolling issues
          WebkitOverflowScrolling: 'touch',
          // Ensure fixed positioning works properly on mobile
          transform: 'translateZ(0)',
          // Add subtle border like your cards
          boxShadow: '0px 2px 8px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            // Add subtle border like your AppBar styling
            borderBottom: `2px solid rgba(214, 107, 39, 0.3)`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BotIcon />
            <Typography variant="h6" sx={{ fontFamily: 'system-ui, -apple-system, Roboto, sans-serif', letterSpacing: '0.5px' }}>
              {t('chatBot.title')}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: 'white' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Beta Notice */}
        <Box sx={{ p: 1, bgcolor: 'warning.light' }}>
          <Typography variant="caption" sx={{ 
            display: 'block', 
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
            fontWeight: 500
          }}>
            {t('chatBot.betaNotice')}
          </Typography>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <List sx={{ py: 0 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1,
                  py: 1
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                    width: 32,
                    height: 32
                  }}
                >
                  {message.sender === 'user' ? <PersonIcon fontSize="small" /> : <BotIcon fontSize="small" />}
                </Avatar>
                
                <Box
                  sx={{
                    maxWidth: '75%',
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    p: 1.5,
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography variant="body2" sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '17px',
                    lineHeight: 1.4
                  }}>
                    {message.text}
                  </Typography>
                  
                  {message.sender === 'bot' && message.confidence && message.confidence !== 'error' && (
                    <Box sx={{ mt: 1 }}>
                                        <Chip
                    label={getConfidenceText(message.confidence)}
                    size="small"
                    color={getConfidenceColor(message.confidence)}
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 20,
                      fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
                      letterSpacing: '0.5px',
                      fontWeight: 500
                    }}
                  />
                    </Box>
                  )}
                  
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      opacity: 0.8,
                      fontSize: '0.7rem',
                      fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
                      fontWeight: 400
                    }}
                  >
                    {message.timestamp.toLocaleTimeString('sv-SE', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Typography>
                </Box>
              </ListItem>
            ))}
            
            {isLoading && (
              <ListItem sx={{ justifyContent: 'flex-start' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <BotIcon fontSize="small" />
                </Avatar>
                <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" sx={{ 
                    fontStyle: 'italic',
                    fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
                    fontWeight: 400
                  }}>
                    {t('chatBot.typing')}
                  </Typography>
                </Box>
              </ListItem>
            )}
          </List>
          <div ref={messagesEndRef} />
        </Box>

        {/* Error Alert */}
        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ mx: 1, mb: 1 }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Input */}
        <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              ref={inputRef}
              fullWidth
              size="small"
              placeholder={t('chatBot.placeholder')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              multiline
              maxRows={3}
              variant="filled"
              sx={{
                // Remove default TextField margins and spacing
                margin: 0,
                '& .MuiInputBase-root': {
                  margin: 0,
                },
                '& .MuiFilledInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
                  minHeight: 'auto', // Remove default min-height
                  paddingTop: 0, // Remove default top padding
                  paddingBottom: 0, // Remove default bottom padding
                  '&:hover': {
                    backgroundColor: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  },
                  '&:before': {
                    display: 'none',
                  },
                  '&:after': {
                    display: 'none',
                  }
                },
                '& .MuiFilledInput-input::placeholder': {
                  fontSize: { xs: '16px' },
                  fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
                  opacity: 0.6,
                },
                '& .MuiFilledInput-input': {
                  fontSize: { xs: '16px', sm: '14px' },
                  fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
                  padding: '16px',
                  lineHeight: 1.2, // Tighter line height
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 48,
                height: 48,
                flexShrink: 0,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  bgcolor: 'rgba(214, 107, 39, 0.8)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-1px)'
                },
                '&.Mui-disabled': {
                  bgcolor: 'grey.300',
                  boxShadow: 'none',
                  transform: 'none'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <ArrowUpIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
};

export default ChatBot; 