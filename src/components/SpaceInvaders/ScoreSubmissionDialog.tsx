import React, { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid #b8860b;
    color: #b8860b;
  }
`;

const GoldText = styled(Typography)`
  color: #b8860b;
  text-align: center;
  margin-bottom: 1rem;
`;

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    color: #b8860b;
  }
  .MuiInputLabel-root {
    color: #b8860b;
  }
  .MuiOutlinedInput-notchedOutline {
    border-color: #b8860b;
  }
  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #b8860b;
  }
  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #b8860b;
  }
`;

const StyledButton = styled(Button)`
  color: #b8860b;
  border-color: #b8860b;
  &:hover {
    border-color: #b8860b;
    background-color: rgba(184, 134, 11, 0.1);
  }
`;

interface ScoreSubmissionDialogProps {
  open: boolean;
  score: number;
  onSubmit: (name: string) => void;
  onClose: () => void;
  isSubmitting?: boolean;
  isHighScore?: boolean;
}

const ScoreSubmissionDialog: React.FC<ScoreSubmissionDialogProps> = ({
  open,
  score,
  onSubmit,
  onClose,
  isSubmitting = false,
  isHighScore = false
}) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ padding: 0 }}>
        <div>
          <GoldText variant="h4">
            {isHighScore ? '🎉 High Score! 🎉' : '🏆 Great Score! 🏆'}
          </GoldText>
        </div>
      </DialogTitle>
      <DialogContent>
        <GoldText variant="h6">
          You scored {score.toLocaleString()} points!
        </GoldText>
        <GoldText variant="body1" style={{ marginBottom: '0.5rem' }}>
          Enter your name for the leaderboard:
        </GoldText>
        <GoldText variant="body2" style={{ marginBottom: '1rem', color: '#ff9800', fontStyle: 'italic' }}>
          Please use your actual name to be eligible for the prize!
        </GoldText>
        <StyledTextField
          autoFocus
          fullWidth
          label="Your Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
          inputProps={{ maxLength: 20 }}
        />
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Skip
        </StyledButton>
        <StyledButton 
          onClick={handleSubmit} 
          variant="outlined" 
          disabled={!name.trim() || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Score'}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default ScoreSubmissionDialog;
