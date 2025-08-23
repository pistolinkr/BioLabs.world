import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Alert,
  Fade
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface SocialSignUpModalProps {
  open: boolean;
  onClose: () => void;
  socialUser: any; // Firebase에서 반환된 소셜 사용자 정보
  provider: 'google' | 'github' | 'microsoft' | 'twitter';
}

const SocialSignUpModal: React.FC<SocialSignUpModalProps> = ({
  open,
  onClose,
  socialUser,
  provider
}) => {
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google';
      case 'github': return 'GitHub';
      case 'microsoft': return 'Microsoft';
      case 'twitter': return 'Twitter';
      default: return '소셜';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return 'G';
      case 'github': return '🐙';
      case 'microsoft': return 'M';
      case 'twitter': return '🐦';
      default: return '👤';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 여기서 실제 소셜 가입 로직을 구현합니다
      // 임시로 성공으로 처리
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          // 로그인 완료 후 대시보드로 이동
          window.location.href = '/dashboard';
        }, 2000);
      }, 1000);
    } catch (error) {
      setError('가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !success) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#000000',
          border: '1px solid #ffffff',
          borderRadius: 0
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        color: '#ffffff',
        borderBottom: '1px solid #ffffff',
        padding: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 1 }}>
          <Avatar
            src={socialUser?.photoURL}
            sx={{
              width: 48,
              height: 48,
              marginRight: 2,
              border: '1px solid #ffffff',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '1.5rem'
            }}
          >
            {getProviderIcon(provider)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 400 }}>
              {getProviderName(provider)} 계정 가입
            </Typography>
            <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.75rem' }}>
              {socialUser?.email}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: 2 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', padding: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#ffffff', marginBottom: 2 }} />
            <Typography variant="h6" sx={{ color: '#ffffff', marginBottom: 1 }}>
              가입 완료!
            </Typography>
            <Typography variant="body2" sx={{ color: '#ffffff' }}>
              {getProviderName(provider)} 계정으로 가입이 완료되었습니다.
              잠시 후 대시보드로 이동합니다...
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" sx={{ color: '#ffffff', marginBottom: 2, textAlign: 'center' }}>
              추가 정보를 입력하여 {getProviderName(provider)} 계정 가입을 완료하세요.
            </Typography>

            <TextField
              fullWidth
              label="이름 또는 닉네임"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              margin="dense"
              size="small"
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ color: '#ffffff', fontSize: '1rem', marginRight: 1 }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '&:hover fieldset': { borderColor: '#ffffff' },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff', borderWidth: 1 }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.75rem'
                }
              }}
            />

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="dense"
              size="small"
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ color: '#ffffff', fontSize: '1rem', marginRight: 1 }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '&:hover fieldset': { borderColor: '#ffffff' },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff', borderWidth: 1 }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.75rem'
                }
              }}
            />

            <TextField
              fullWidth
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="dense"
              size="small"
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ color: '#ffffff', fontSize: '1rem', marginRight: 1 }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '&:hover fieldset': { borderColor: '#ffffff' },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff', borderWidth: 1 }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.75rem'
                }
              }}
            />

            {error && (
              <Fade in={true}>
                <Alert severity="error" sx={{ marginTop: 1, fontSize: '0.75rem' }}>
                  {error}
                </Alert>
              </Fade>
            )}
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ padding: 2, justifyContent: 'center' }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: '#ffffff',
              borderColor: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: '#ffffff'
              }
            }}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !displayName || !password || !confirmPassword}
            sx={{
              backgroundColor: '#ffffff',
              color: '#000000',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: '#ffffff',
                transform: 'none'
              },
              '&:disabled': {
                backgroundColor: '#666666',
                color: '#ffffff'
              }
            }}
          >
            {loading ? '가입 중...' : '가입 완료'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default SocialSignUpModal;
