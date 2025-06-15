import React, { useState } from 'react';
import { Fab, Badge, Zoom } from '@mui/material';
import { SmartToy as BotIcon } from '@mui/icons-material';
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
          color="secondary"
          onClick={handleToggleChat}
          sx={{
            position: 'fixed',
            // Use inset for better mobile Safari support
            inset: 'auto 16px 16px auto',
            zIndex: 1200,
            boxShadow: 3,
            // Ensure fixed positioning works properly on mobile
            transform: 'translateZ(0)',
            '&:hover': {
              transform: 'translateZ(0) scale(1.1)',
              transition: 'transform 0.2s ease-in-out'
            }
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
                padding: '0 4px'
              }
            }}
          >
            <BotIcon />
          </Badge>
        </Fab>
      </Zoom>
      
      <ChatBot open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default ChatButton; 