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
  Close as CloseIcon
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

      // Debug: Log the raw response
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
        throw new Error(`API returned invalid JSON: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.error || t('chatBot.errorMessage'));
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
      setError(error.message);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: t('chatBot.errorMessage'),
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
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'info';
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
          width: { xs: 'auto', sm: 400 },
          height: { xs: 'auto', sm: 500 },
          // Use dvh for proper mobile viewport handling, fallback to vh
          maxHeight: { 
            xs: ['calc(100vh - 40px)', 'calc(100dvh - 40px)'], 
            sm: 500 
          },
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1300,
          borderRadius: 2,
          overflow: 'hidden',
          // Prevent iOS Safari bounce scrolling issues
          WebkitOverflowScrolling: 'touch',
          // Ensure fixed positioning works properly on mobile
          transform: 'translateZ(0)',
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
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BotIcon />
            <Typography variant="h6">{t('chatBot.title')}</Typography>
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
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
            {t('chatBot.betaNotice')}
          </Typography>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
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
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    p: 1.5,
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.text}
                  </Typography>
                  
                  {message.sender === 'bot' && message.confidence && message.confidence !== 'error' && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={getConfidenceText(message.confidence)}
                        size="small"
                        color={getConfidenceColor(message.confidence)}
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  )}
                  
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      opacity: 0.8,
                      fontSize: '0.7rem'
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
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
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
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              color="primary"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 40,
                height: 40,
                flexShrink: 0,
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&.Mui-disabled': {
                  bgcolor: 'grey.300'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
};

export default ChatBot; 