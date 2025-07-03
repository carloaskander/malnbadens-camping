import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const messagesContainerRef = useRef(null);

  // Clean body scroll lock - keep it simple
  useEffect(() => {
    if (!open) return;

    // Prevent page scroll while chat is open
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [open]);

  // Professional auto-scroll function using scrollHeight
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

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

  // Auto-scroll on new messages (including streaming tokens)
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 50);
    }
  }, [messages, scrollToBottom]);

  // Focus input and scroll when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 300); // Longer delay for mobile keyboard
    }
  }, [open, scrollToBottom]);

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

  // Simple auto-scroll on input focus
  const handleInputFocus = () => {
    setTimeout(scrollToBottom, 100);
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
          // Clean fixed positioning - chat overlay on top of everything
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          // Mobile-first, then desktop override
          borderRadius: { xs: 0, sm: 2 },
          // Desktop positioning
          ...(window.innerWidth >= 600 && {
            position: 'fixed',
            top: 'auto',
            left: 'auto',
            right: 20,
            bottom: 20,
            width: 450,
            height: 600,
          }),
          overflow: 'hidden',
          boxShadow: { 
            xs: 'none', 
            sm: '0px 2px 8px 4px rgba(0, 0, 0, 0.1)' 
          },
        }}
      >
        {/* Header - Fixed at top */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `2px solid rgba(214, 107, 39, 0.3)`,
            flexShrink: 0, // Don't allow shrinking
            zIndex: 2,
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

        {/* Beta Notice - Fixed below header */}
        <Box sx={{ p: 1, bgcolor: 'warning.light', flexShrink: 0 }}>
          <Typography variant="caption" sx={{ 
            display: 'block', 
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
            fontWeight: 500
          }}>
            {t('chatBot.betaNotice')}
          </Typography>
        </Box>

        {/* Messages - Flexible, scrollable area */}
        <Box 
          ref={messagesContainerRef}
          sx={{ 
            flex: '1 1 auto', // Flex grow, shrink, auto basis
            minHeight: 0, // Critical: allows flex item to shrink below content size
            overflowY: 'auto',
            overflowX: 'hidden',
            // Prevent pull-to-refresh and block page scroll propagation
            overscrollBehavior: 'contain',
            p: 1,
            // Smooth scrolling
            scrollBehavior: 'smooth',
            // Improve touch scrolling on mobile
            WebkitOverflowScrolling: 'touch',
            // Prevent horizontal scrolling
            width: '100%',
            // Remove flex-end to allow proper scrolling
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Spacer to push content to bottom when there's only one message */}
          {messages.length === 1 && <Box sx={{ flex: '1 1 auto' }} />}
          
          <List sx={{ py: 0 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 0.5,
                  px: 1,
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
                    px: 1.5,
                    py: 1.5,
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
              sx={{ mx: 1, mb: 1, flexShrink: 0 }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Input Row - Clean sticky positioning */}
        <Box 
          sx={{ 
            px: 3, 
            py: 2, 
            bgcolor: 'grey.50',
            flexShrink: 0,
            position: 'sticky',
            bottom: 0,
            zIndex: 3,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              ref={inputRef}
              fullWidth
              size="small"
              placeholder={t('chatBot.placeholder')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              disabled={isLoading}
              multiline
              maxRows={3}
              variant="filled"
              sx={{
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
                  minHeight: 'auto',
                  paddingTop: 0,
                  paddingBottom: 0,
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
                  fontSize: { xs: '16px' }, // Prevent zoom on iOS
                  fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
                  opacity: 0.6,
                },
                '& .MuiFilledInput-input': {
                  fontSize: { xs: '16px', sm: '14px' }, // Prevent zoom on iOS
                  fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
                  padding: '16px',
                  lineHeight: 1.2,
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: { xs: 52, sm: 49 },
                height: { xs: 52, sm: 49 },
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
          
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 1, 
              color: 'text.primary', 
              fontSize: '0.7rem',
              fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
              opacity: 0.7,
              textAlign: 'center',
              display: 'block'
            }}
          >
            {t('chatBot.dataNotice')}
          </Typography>
        </Box>
      </Paper>
    </Slide>
  );
};

export default ChatBot; 