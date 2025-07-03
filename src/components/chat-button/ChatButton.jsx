import React, { useState } from 'react';
import { Fab, Badge, Zoom } from '@mui/material';
import { AutoAwesome as AIIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ChatBot from '../chat-bot/ChatBot';

const ChatButton = () => {
  const { t } = useTranslation();
  const [chatOpen, setChatOpen] = useState(false);

  const handleToggleChat = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <>
      <Zoom in={!chatOpen}>
        <Fab
          onClick={handleToggleChat}
          sx={{
            position: 'fixed',
            inset: 'auto 16px 16px auto',
            zIndex: 1200,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.25)',
            
            '&:hover': {
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
              boxShadow: '0 8px 25px rgba(255, 107, 107, 0.35)',
            },
          }}
        >
          <Badge 
            badgeContent={t('chatBot.badge')} 
            color="warning"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                height: 16,
                minWidth: 16,
                padding: '0 4px',
                background: 'linear-gradient(45deg, #ff6b6b, #ffa726)',
                fontWeight: 600,
              }
            }}
          >
            <AIIcon sx={{ fontSize: 28 }} />
          </Badge>
        </Fab>
      </Zoom>
      
      <ChatBot open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default ChatButton; 