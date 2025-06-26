import React from 'react';
import { HelpHub as QuestHelpHub } from '@questlabs/react-sdk';
import { questConfig } from '../../config/questConfig';

const HelpHub = () => {
  // Get user ID from localStorage or use default
  const userId = localStorage.getItem('userId') || questConfig.USER_ID;
  const token = localStorage.getItem('token') || questConfig.TOKEN;

  return (
    <div style={{ zIndex: 9999 }}>
      <QuestHelpHub
        uniqueUserId={userId}
        questId={questConfig.QUEST_HELP_QUESTID}
        accent={questConfig.PRIMARY_COLOR}
        token={token}
        botLogo={{
          logo: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1741000949338-Vector%20%282%29.png'
        }}
        style={{
          zIndex: 9999,
          position: 'fixed'
        }}
      />
    </div>
  );
};

export default HelpHub;