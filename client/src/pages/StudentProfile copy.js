import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Box,
  Grid,
  Paper,
  IconButton,
  LinearProgress,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentProfileCreation = () => {
  const { t, i18n } = useTranslation();

  // Core state
  const [currentStep, setCurrentStep] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [stepHistory, setStepHistory] = useState(['language']);
  const [micPersistentMode, setMicPersistentMode] = useState(false);

  // Profile data - Updated for sector_interests
  const [profileData, setProfileData] = useState({
    id: localStorage.getItem('id'),
    name: '',
    education: '',
    skills: [],
    sector_interests: [], // Changed from interests to sector_interests (ObjectIds)
    preferred_locations: [],
    language: 'en-IN',
  });

  // Step-by-step states
  const [stepData, setStepData] = useState({
    currentQuestion: 0,
    answers: {},
  });

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Sector management states
  const [availableSectors, setAvailableSectors] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(false);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceBuffer, setVoiceBuffer] = useState('');
  const [lastProcessedLength, setLastProcessedLength] = useState(0);
  const [voiceDisabledForQuestion, setVoiceDisabledForQuestion] = useState(false);

  // Recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  // Refs
  const recognitionRef = useRef(null);
  const voiceTimeoutRef = useRef(null);

  // Language options
  const languages = [
    { code: 'en-IN', name: 'English', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'ગુજરાતી', flag: '🇮🇳' },
  ];

  // Questions configuration - Updated
  const questionKeys = ['name', 'education', 'sector_interests', 'skills', 'locationPreferences'];
  const token = localStorage.getItem('token');

  // Fetch sectors on component mount
  useEffect(() => {
    fetchSectors();
  }, []);

  // Fetch sectors from API
  const fetchSectors = async () => {
    setLoadingSectors(true);
    try {
      const response = await axios.get('https://internship-recommendation-u8d3.onrender.com/api/sectors');
      setAvailableSectors(response.data.sectors || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
      toast.error('Failed to load sectors');
    } finally {
      setLoadingSectors(false);
    }
  };

  // Process voice input for tags with better phrase handling
  const processVoiceForTags = (text) => {
    const cleanText = text.toLowerCase().trim();
    const phrases = cleanText
      .split(/[,;.!?]+/)
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length > 0);

    phrases.forEach((phrase) => {
      const subPhrases = phrase
        .split(/\s+(?:and|or|also|plus)\s+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 2);

      subPhrases.forEach((subPhrase) => {
        const cleanPhrase = subPhrase
          .replace(/\b(i\s+like|i\s+want|i\s+am\s+interested\s+in|my\s+interest\s+is)\b/g, '')
          .replace(/\b(the|a|an|in|on|at|to|for|with|by)\b/g, '')
          .trim();

        if (
          cleanPhrase.length > 2 &&
          !currentTags.some((tag) => tag.toLowerCase().includes(cleanPhrase) || cleanPhrase.includes(tag.toLowerCase()))
        ) {
          setCurrentTags((prev) => [...prev, cleanPhrase]);
        }
      });
    });
  };

  // Initialize speech recognition
  useEffect(() => {
    const initializeSpeechRecognition = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setVoiceSupported(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = selectedLanguage;

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const currentQuestionKey = questionKeys[stepData.currentQuestion];
          const isTagQuestion = ['skills', 'locationPreferences'].includes(currentQuestionKey); // Removed sector_interests

          if (isTagQuestion) {
            const fullText = finalTranscript + interimTranscript;
            setVoiceBuffer(fullText);

            if (voiceTimeoutRef.current) {
              clearTimeout(voiceTimeoutRef.current);
            }

            if (finalTranscript.trim()) {
              processVoiceForTags(finalTranscript);
              setLastProcessedLength(finalTranscript.length);
            }

            voiceTimeoutRef.current = setTimeout(() => {
              const newContent = fullText.substring(lastProcessedLength);
              if (newContent.trim().length > 5) {
                processVoiceForTags(newContent);
                setLastProcessedLength(fullText.length);
              }
            }, 1500);
          } else if (finalTranscript.trim()) {
            setCurrentAnswer((prev) => {
              const newText = prev + (prev ? ' ' : '') + finalTranscript;
              return newText;
            });
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);

          switch (event.error) {
            case 'not-allowed':
              toast.error('Microphone permission denied. Please allow microphone access.');
              break;
            case 'no-speech':
              toast.warning('No speech detected. Please try speaking again.');
              break;
            case 'network':
              toast.error('Network error. Please check your internet connection.');
              break;
            default:
              toast.error('Voice recognition error. Please try again.');
          }
        };

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setVoiceBuffer('');
          setLastProcessedLength(0);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (voiceTimeoutRef.current) {
            clearTimeout(voiceTimeoutRef.current);
          }

          // Auto-restart if in persistent mode and not manually stopped
          if (micPersistentMode && !voiceDisabledForQuestion) {
            const currentQuestionKey = questionKeys[stepData.currentQuestion];
            if (currentQuestionKey !== 'sector_interests') {
              setTimeout(() => {
                if (recognitionRef.current && !isListening) {
                  try {
                    recognitionRef.current.start();
                  } catch (error) {
                    console.log('Could not restart recognition:', error);
                    setMicPersistentMode(false);
                  }
                }
              }, 100);
            }
          }
        };
      } else {
        setVoiceSupported(false);
      }
    };

    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
      }
    };
  }, [selectedLanguage, stepData.currentQuestion, currentTags, lastProcessedLength]);

  // Change language function
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setSelectedLanguage(langCode);
    setProfileData((prev) => ({ ...prev, language: langCode }));

    if (recognitionRef.current) {
      recognitionRef.current.lang = langCode;
    }
  };

  // Navigation functions
  const navigateToStep = (step) => {
    setStepHistory((prev) => [...prev, step]);
    setCurrentStep(step);
  };

  const goBack = () => {
    if (currentStep === 'step-by-step' && stepData.currentQuestion > 0) {
      const prevQuestion = stepData.currentQuestion - 1;
      const prevAnswers = { ...stepData.answers };
      delete prevAnswers[questionKeys[stepData.currentQuestion]];

      setStepData({
        currentQuestion: prevQuestion,
        answers: prevAnswers,
      });

      const prevQuestionKey = questionKeys[prevQuestion];
      const prevAnswer = stepData.answers[prevQuestionKey];

      if (prevQuestionKey === 'sector_interests') {
        const sectorsToSelect = Array.isArray(prevAnswer)
          ? prevAnswer.map((id) => availableSectors.find((s) => s._id === id)).filter(Boolean)
          : [];
        setSelectedSectors(sectorsToSelect);
        setCurrentAnswer('');
        setCurrentTags([]);
        setTagInput('');
      } else if (prevQuestionKey === 'skills' || prevQuestionKey === 'locationPreferences') {
        setCurrentTags(Array.isArray(prevAnswer) ? prevAnswer : []);
        setCurrentAnswer('');
        setTagInput('');
        setSelectedSectors([]);
      } else {
        setCurrentAnswer(prevAnswer || '');
        setCurrentTags([]);
        setSelectedSectors([]);
      }
      setVoiceBuffer('');
      setLastProcessedLength(0);
      return;
    }

    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory];
      newHistory.pop();
      const previousStep = newHistory[newHistory.length - 1];

      setStepHistory(newHistory);
      setCurrentStep(previousStep);
    }
  };

  const canGoBack = () => {
    if (currentStep === 'language') return false;
    if (currentStep === 'recommendations') return false;
    if (currentStep === 'step-by-step' && stepData.currentQuestion === 0 && stepHistory.length <= 1) return false;
    return true;
  };

  // Voice recognition functions - Updated to exclude sector_interests
  const startVoiceRecognition = async () => {
    const currentQuestionKey = questionKeys[stepData.currentQuestion];
    if (currentQuestionKey === 'sector_interests') {
      toast.info(t('voiceInputUnavailable'));
      return;
    }

    if (!voiceSupported) {
      toast.error(t('voiceInputNotSupported'));
      return;
    }

    if (!recognitionRef.current) {
      toast.error(t('voiceInputRecognitionNotAvailable'));
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isListening) {
        setVoiceBuffer('');
        setLastProcessedLength(0);
        setVoiceDisabledForQuestion(false);
        setMicPersistentMode(true); // Enable persistent mode
        recognitionRef.current.start();
      }
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone permission denied.');
      } else {
        toast.error('Unable to access microphone.');
      }
    }
  };

  // Update stopVoiceRecognition function
  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      setMicPersistentMode(false); // Disable persistent mode
      setVoiceDisabledForQuestion(true);
      recognitionRef.current.stop();
    }
  };

  // Tag management functions
  const addTag = (value = tagInput) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !currentTags.some((tag) => tag.toLowerCase() === trimmedValue.toLowerCase())) {
      setCurrentTags((prev) => [...prev, trimmedValue]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    }
  };

  // Handle language selection
  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    navigateToStep('step-by-step');
  };

  // Handle step-by-step progression - Updated for sectors
  const handleStepAnswer = (answer) => {
    const currentQuestionKey = questionKeys[stepData.currentQuestion];
    let processedAnswer = answer;

    if (currentQuestionKey === 'sector_interests') {
      processedAnswer = selectedSectors.map((sector) => sector._id);
    } else if (currentQuestionKey === 'skills' || currentQuestionKey === 'locationPreferences') {
      processedAnswer = currentTags;
    }

    const newAnswers = { ...stepData.answers, [currentQuestionKey]: processedAnswer };

    if (stepData.currentQuestion < questionKeys.length - 1) {
      setStepData({
        currentQuestion: stepData.currentQuestion + 1,
        answers: newAnswers,
      });

      const nextQuestionKey = questionKeys[stepData.currentQuestion + 1];

      // Reset voice disabled flag for new question if mic was persistent
      if (micPersistentMode) {
        setVoiceDisabledForQuestion(false);
      }

      if (nextQuestionKey === 'sector_interests') {
        setCurrentAnswer('');
        setCurrentTags([]);
        setTagInput('');
        setSelectedSectors([]);
        // Mic will be disabled for sector_interests automatically
      } else if (nextQuestionKey === 'skills' || nextQuestionKey === 'locationPreferences') {
        setCurrentAnswer('');
        setCurrentTags([]);
        setTagInput('');
        setSelectedSectors([]);
      } else {
        setCurrentAnswer('');
        setCurrentTags([]);
        setSelectedSectors([]);
      }
      setVoiceBuffer('');
      setLastProcessedLength(0);
    } else {
      processStepByStepAnswers(newAnswers);
    }
  };

  const processStepByStepAnswers = (answers) => {
    setProfileData((prev) => ({
      ...prev,
      name: answers.name || 'Student',
      education: answers.education || 'Not specified',
      skills: answers.skills || [],
      sector_interests: answers.sector_interests || [], // Updated
      preferred_locations: answers.locationPreferences || [],
    }));

    navigateToStep('review');
  };

  // Submit profile and get recommendations
  const submitProfile = async () => {
    try {
      setIsLoadingRecommendations(true);

      await axios.post('https://internship-recommendation-u8d3.onrender.com/api/auth/profile/create', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = localStorage.getItem('id');
      const recommendationsResponse = await axios.get(
        `https://internship-recommendation-u8d3.onrender.com/api/internships/recommendations/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecommendations(recommendationsResponse.data.recommendations || []);
      navigateToStep('recommendations');
      toast.success('Profile created successfully!');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Error creating profile. Please try again.');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Render back button
  const renderBackButton = () => {
    if (!canGoBack()) return null;
    return (
      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={goBack} sx={{ mb: 2 }}>
        {t('back')}
      </Button>
    );
  };

  // Unified input component - Updated for sectors
  const renderUnifiedInput = () => {
    const currentQuestionKey = questionKeys[stepData.currentQuestion];

    // Sector selection with dropdown (no voice)
    if (currentQuestionKey === 'sector_interests') {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('selectSectorInterest')}
          </Typography>

          {micPersistentMode && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('voiceInputPaused')}
            </Alert>
          )}

          {loadingSectors ? (
            <CircularProgress size={20} />
          ) : (
            <Autocomplete
              multiple
              options={availableSectors}
              getOptionLabel={(option) => option.name}
              value={selectedSectors}
              onChange={(event, newValue) => {
                setSelectedSectors(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t('selectSectorInterest')}
                  placeholder={t('chooseSectors')}
                  helperText={t('voiceInputWillResume')}
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option._id}
                    color="primary"
                    variant="filled"
                  />
                ))
              }
            />
          )}

          {selectedSectors.length > 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">{t('sectorsSelected', { count: selectedSectors.length })}</Typography>
            </Alert>
          )}
        </Box>
      );
    }

    const isTagQuestion = ['skills', 'locationPreferences'].includes(currentQuestionKey);

    if (!isTagQuestion) {
      return (
        <Box>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={t(`questions.${currentQuestionKey}.placeholder`)}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: voiceSupported && (
                <IconButton
                  color={isListening ? 'error' : 'primary'}
                  onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                  size="small"
                  sx={{
                    bgcolor: isListening ? 'error.light' : 'primary.light',
                    '&:hover': {
                      bgcolor: isListening ? 'error.main' : 'primary.main',
                    },
                  }}
                >
                  {isListening ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
              ),
            }}
          />

          {isListening && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  animation: 'pulse 1s infinite',
                }}
              />
              <Typography variant="body2" color="error.main">
                {t('listening')}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Box display="flex" gap={1} mb={2}>
          <TextField
            fullWidth
            size="small"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagInputKeyPress}
            placeholder={t('typeAndPress')}
            InputProps={{
              endAdornment: voiceSupported && (
                <IconButton
                  color={isListening ? 'error' : 'primary'}
                  onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                  size="small"
                  sx={{
                    bgcolor: isListening ? 'error.light' : 'primary.light',
                    '&:hover': {
                      bgcolor: isListening ? 'error.main' : 'primary.main',
                    },
                  }}
                >
                  {isListening ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
              ),
            }}
          />
          <Button variant="outlined" onClick={() => addTag()} disabled={!tagInput.trim()} startIcon={<AddIcon />}>
            {t('addTag')}
          </Button>
        </Box>

        {isListening && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">🎤 {t('listeningExample')}</Typography>
            {voiceBuffer && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                {t('detectedText', { text: voiceBuffer })}
              </Typography>
            )}
          </Alert>
        )}

        <Box
          sx={{
            minHeight: '60px',
            border: '1px dashed #ccc',
            borderRadius: 1,
            p: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'flex-start',
          }}
        >
          {currentTags.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
              {t('addedTags')}
            </Typography>
          ) : (
            currentTags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => removeTag(tag)}
                deleteIcon={<CloseIcon />}
                color="primary"
                variant="filled"
              />
            ))
          )}
        </Box>
      </Box>
    );
  };

  // Render language selection
  const renderLanguageSelection = () => (
    <Card elevation={3}>
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('chooseLanguage')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('languageDescription')}
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          {languages.map((lang) => (
            <Grid item key={lang.code}>
              <Button
                variant={selectedLanguage === lang.code ? 'contained' : 'outlined'}
                size="large"
                onClick={() => handleLanguageSelect(lang.code)}
                sx={{ minWidth: 120, height: 60 }}
              >
                <Box textAlign="center">
                  <Typography variant="h6">{lang.flag}</Typography>
                  <Typography variant="body2">{lang.name}</Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  // Render step-by-step - Updated for sectors
  const renderStepByStep = () => {
    const currentQuestionKey = questionKeys[stepData.currentQuestion];
    const isSectorQuestion = currentQuestionKey === 'sector_interests';
    const isTagQuestion = ['skills', 'locationPreferences'].includes(currentQuestionKey);

    return (
      <Card elevation={3}>
        <CardContent sx={{ py: 4 }}>
          {renderBackButton()}
          <Box sx={{ mb: 3 }}>
            <LinearProgress variant="determinate" value={(stepData.currentQuestion / questionKeys.length) * 100} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('questionOf', { current: stepData.currentQuestion + 1, total: questionKeys.length })}
            </Typography>
          </Box>

          <Typography variant="h5" gutterBottom>
            {t(`questions.${currentQuestionKey}.question`)}
          </Typography>

          {isSectorQuestion && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {t('selectSectorInterest')}
              {t('sectorSelectionUnavailable')}
            </Typography>
          )}

          {isTagQuestion && !isSectorQuestion && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {t('TechnicalInfo')}
              {t('TechnicalInfoNote')}
            </Typography>
          )}

          {renderUnifiedInput()}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            {stepData.currentQuestion > 0 && (
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={goBack}>
                {t('previous')}
              </Button>
            )}
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                if (isSectorQuestion) {
                  handleStepAnswer(selectedSectors);
                } else if (isTagQuestion) {
                  handleStepAnswer(currentTags);
                } else {
                  handleStepAnswer(currentAnswer);
                }
              }}
              disabled={(() => {
                if (isSectorQuestion) return selectedSectors.length === 0;
                if (isTagQuestion) return currentTags.length === 0;
                return !currentAnswer.trim();
              })()}
              sx={{ flex: 1 }}
            >
              {stepData.currentQuestion < questionKeys.length - 1 ? t('next') : t('review')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Render review - Updated to show sector names
  const renderReview = () => {
    const displaySectors =
      stepData.answers.sector_interests?.map((sectorId) => {
        const sector = availableSectors.find((s) => s._id === sectorId);
        return sector ? sector.name : 'Unknown Sector';
      }) || [];

    return (
      <Card elevation={3}>
        <CardContent sx={{ py: 4 }}>
          {renderBackButton()}
          <Typography variant="h4" gutterBottom textAlign="center">
            {t('reviewInfo')}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" color="primary">
                  {t('name')}
                </Typography>
                <Typography variant="body1">{profileData.name}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" color="primary">
                  {t('education')}
                </Typography>
                <Typography variant="body1">{profileData.education}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t('skills')}
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    minHeight: '60px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  {profileData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="filled"
                      color="primary"
                      sx={{ fontSize: '0.875rem', height: '32px' }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Sector Interests
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    minHeight: '60px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  {displaySectors.map((sectorName, index) => (
                    <Chip
                      key={index}
                      label={sectorName}
                      variant="filled"
                      color="secondary"
                      sx={{ fontSize: '0.875rem', height: '32px' }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t('preferredLocations')}
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    minHeight: '60px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  {profileData.preferred_locations.map((location, index) => (
                    <Chip
                      key={index}
                      label={location}
                      variant="filled"
                      color="info"
                      sx={{ fontSize: '0.875rem', height: '32px' }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button variant="contained" size="large" onClick={submitProfile} startIcon={<CheckIcon />}>
              {t('submitProfile')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Render recommendations
  const renderRecommendations = () => {
    const getRecommendationsContent = () => {
      if (isLoadingRecommendations) {
        return (
          <Box textAlign="center" sx={{ py: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Finding perfect matches for you...
            </Typography>
          </Box>
        );
      }

      if (recommendations.length > 0) {
        return (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {recommendations.map((internship, index) => (
              <Grid item xs={12} key={index}>
                <Paper sx={{ p: 3, border: '1px solid', borderColor: 'primary.light' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Typography variant="h6" color="primary">
                        {index + 1}. {internship.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {internship.company} • {internship.location}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                        {internship.description}
                      </Typography>
                      <Box>
                        <Typography variant="body2" color="success.main" display="block">
                          ✔ {internship.matchDetails?.skills || 'Skills match'}
                        </Typography>
                        <Typography variant="body2" color="success.main" display="block">
                          ✔ {internship.matchDetails?.location || 'Location match'}
                        </Typography>
                        <Typography variant="body2" color="success.main" display="block">
                          ✔ {internship.matchDetails?.sectors || 'Sector match'}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${internship.matchScore || 85}% Match`}
                      color="primary"
                      variant="filled"
                      sx={{ ml: 2, fontWeight: 'bold' }}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        );
      }

      return (
        <Alert severity="info">
          No matching internships found at the moment. We'll notify you when new opportunities become available!
        </Alert>
      );
    };

    return (
      <Card elevation={3}>
        <CardContent sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            {t('recommendedInternships')}
          </Typography>

          {getRecommendationsContent()}

          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => {
                setCurrentStep('language');
                setStepHistory(['language']);
                setProfileData({
                  id: localStorage.getItem('id'),
                  name: '',
                  education: '',
                  skills: [],
                  sector_interests: [],
                  preferred_locations: [],
                  language: 'en-IN',
                });
                setStepData({
                  currentQuestion: 0,
                  answers: {},
                });
                setRecommendations([]);
                setCurrentAnswer('');
                setCurrentTags([]);
                setSelectedSectors([]);
                setTagInput('');
                setVoiceBuffer('');
                setLastProcessedLength(0);
                setVoiceDisabledForQuestion(false);
              }}
            >
              {t('createNewProfile')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {currentStep === 'language' && renderLanguageSelection()}
      {currentStep === 'step-by-step' && renderStepByStep()}
      {currentStep === 'review' && renderReview()}
      {currentStep === 'recommendations' && renderRecommendations()}
    </Container>
  );
};

export default StudentProfileCreation;
