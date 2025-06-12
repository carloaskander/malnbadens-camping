import React, { useState } from 'react';
import { Fab, Badge, Zoom } from '@mui/material';
import { SmartToy as BotIcon } from '@mui/icons-material';
import ChatBot from '../chat-bot/ChatBot';

const ChatButton = () => {
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
            bottom: 16,
            right: 16,
            zIndex: 1200,
            boxShadow: 3,
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
        >
          <Badge 
            badgeContent="Beta" 
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