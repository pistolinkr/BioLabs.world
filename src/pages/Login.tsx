import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Fade,
  Grow,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 저장된 로그인 정보 복원
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('biolabs_remember_me');
    const savedEmail = localStorage.getItem('biolabs_remember_email');
    
    if (savedRememberMe === 'true' && savedEmail) {
      setRememberMe(true);
      setEmail(savedEmail);
    }
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        const result = await signUp(email, password, displayName);
        if (result.success) {
          setSuccess('회원가입이 완료되었습니다!');
          setTimeout(() => navigate('/home'), 1500);
        } else {
          setError(result.error || '회원가입 중 오류가 발생했습니다.');
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          // 로그인 상태 유지 설정 저장
          if (rememberMe) {
            localStorage.setItem('biolabs_remember_me', 'true');
            localStorage.setItem('biolabs_remember_email', email);
          } else {
            localStorage.removeItem('biolabs_remember_me');
            localStorage.removeItem('biolabs_remember_email');
          }
          
          setSuccess('로그인이 완료되었습니다!');
          setTimeout(() => navigate('/home'), 1500);
        } else {
          setError(result.error || '로그인 중 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      setError('인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      switch (provider) {
        case 'google':
          result = await signInWithGoogle();
          break;
        case 'github':
          result = await signInWithGithub();
          break;
        default:
          throw new Error('지원하지 않는 제공업체입니다.');
      }

      if (result.success) {
        setSuccess(`${provider} 로그인이 완료되었습니다!`);
        setTimeout(() => navigate('/home'), 1500);
      } else {
        setError(result.error || `${provider} 로그인 중 오류가 발생했습니다.`);
      }
    } catch (error: any) {
      setError(`${provider} 로그인 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: 2
      }}
    >
      <Grow in={true} timeout={800}>
        <Card
          sx={{
            maxWidth: 350,
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: 0,
            boxShadow: 'none',
            overflow: 'hidden'
          }}
        >
          {/* 헤더 */}
          <Box
            sx={{
              backgroundColor: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border-secondary)',
              padding: 2,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 400,
                color: 'var(--text-primary)',
                fontSize: '1.25rem'
              }}
            >
                              {isSignUp ? 'BioLabs 가입' : 'BioLabs 로그인'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-primary)',
                marginTop: 1,
                fontSize: '0.75rem'
              }}
            >
              {isSignUp ? '당신만의 연구실을 만들어보세요' : '당신의 연구실에 오신 것을 환영합니다'}
            </Typography>
          </Box>

          <CardContent sx={{ padding: 2 }}>
            {/* OAuth 로그인 버튼들 */}
            <Box sx={{ marginBottom: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  marginBottom: 1,
                  fontSize: '0.75rem'
                }}
              >
                소셜 계정으로 {isSignUp ? '가입' : '로그인'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, marginBottom: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={loading}
                  sx={{
                    borderColor: 'var(--text-primary)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 0,
                    fontSize: '0.75rem',
                    padding: '6px 12px',
                    '&:hover': {
                      borderColor: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-primary)'
                    }
                  }}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  onClick={() => handleOAuthSignIn('github')}
                  disabled={loading}
                  sx={{
                    borderColor: 'var(--text-primary)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 0,
                    fontSize: '0.75rem',
                    padding: '6px 12px',
                    '&:hover': {
                      borderColor: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-primary)'
                    }
                  }}
                >
                  GitHub
                </Button>
              </Box>

            </Box>

            <Divider sx={{ marginY: 2, borderColor: 'var(--text-primary)' }}>
              <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontSize: '0.75rem' }}>
                또는
              </Typography>
            </Divider>

            {/* 이메일/비밀번호 폼 */}
            <Box component="form" onSubmit={handleEmailAuth}>
              {isSignUp && (
                <TextField
                  fullWidth
                  label="이름"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  margin="dense"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'var(--text-primary)', fontSize: '1rem' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      '&:hover fieldset': { borderColor: 'var(--text-primary)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--text-primary)', borderWidth: 1 }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              )}

              <TextField
                fullWidth
                label="이메일"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="dense"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'var(--text-primary)', fontSize: '1rem' }} />
                    </InputAdornment>
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="dense"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'var(--text-primary)', fontSize: '1rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
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

              {!isSignUp && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginY: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: '#ffffff',
                          '&.Mui-checked': { color: '#ffffff' },
                          '& .MuiSvgIcon-root': {
                            fontSize: '1rem'
                          }
                        }}
                      />
                    }
                    label="로그인 상태 유지"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  <Link
                    to="/forgot-password"
                    style={{
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.75rem'
                    }}
                  >
                    비밀번호 찾기
                  </Link>
                </Box>
              )}

              {/* 에러/성공 메시지 */}
              {error && (
                <Fade in={true}>
                  <Alert severity="error" sx={{ marginY: 1, fontSize: '0.75rem' }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              {success && (
                <Fade in={true}>
                  <Alert severity="success" sx={{ marginY: 1, fontSize: '0.75rem' }}>
                    {success}
                  </Alert>
                </Fade>
              )}

              {/* 제출 버튼 */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  marginTop: 1,
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  fontWeight: 400,
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
                {loading ? '처리 중...' : (isSignUp ? '회원가입' : '로그인')}
              </Button>
            </Box>

            {/* 모드 전환 */}
            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.75rem' }}>
                {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
              </Typography>
              <Button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                }}
                sx={{
                  color: '#ffffff',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  marginTop: 0.5,
                  '&:hover': {
                    textDecoration: 'underline',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {isSignUp ? '로그인하기' : '회원가입하기'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
};

export default Login;
