import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const CreateTour = () => {
  const navigate = useNavigate();
  const { language, translateContent } = useLanguage();
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'wildlife',
    mediaType: '360_image', mediaUrl: '', thumbnailUrl: '',
    videoUrl: '',
    location: { county: '', subCounty: '', ward: '' },
    cbcAlignment: { grades: [], subjects: [] },
    voiceOver: { enabled: true, languages: [] },
    arEnabled: false,
    autoRotate: true,
    autoRotateSpeed: 2,
    backgroundMusic: '',
    narration: '',
    scenes: [],
    hotspots: []
  });
  
  const [counties, setCounties] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState({ counties: false, constituencies: false, wards: false });
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('image');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [translatedTexts, setTranslatedTexts] = useState({});
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const API_KEY = 'keyPub1569gsvndc123kg9sjhg';
  const BASE_URL = 'https://kenyaareadata.vercel.app/api/areas';

  const texts = {
    title: '🎬 Create New Virtual Tour',
    tourTitle: 'Tour Title',
    category: 'Category',
    description: 'Description',
    uploadThumbnail: '📸 Upload Thumbnail Image',
    clickToUploadThumbnail: 'Click to upload thumbnail image',
    thumbnailHelper: 'This image will appear on the tour card (JPEG, PNG)',
    videoUrl: '🎥 Video URL (Optional - YouTube or direct video link)',
    videoPlaceholder: 'https://www.youtube.com/watch?v=... or https://example.com/video.mp4',
    videoHelper: 'Paste a video link (YouTube, Vimeo, or direct MP4 URL). The video will be displayed in the VR viewer.',
    upload360: '📸 Upload 360° Image',
    clickToUpload360: 'Click to upload 360° image',
    imageHelper: 'JPEG, PNG, GIF (Max 500MB)',
    imageReady: 'Image ready to add as scene',
    addScene: '➕ Add Current Image as Scene',
    scenesList: '📋 Scenes',
    backgroundMusic: '🎵 Background Music (Optional)',
    clickToUploadMusic: 'Click to upload background music (MP3)',
    voiceNarration: '🎙️ Voice Narration',
    recordAudio: 'Record Audio',
    startRecording: '🎤 Start Recording',
    stopRecording: '⏹️ Stop',
    recordHelper: 'Click record, speak into your microphone, then stop.',
    orUpload: '— OR Upload Audio File —',
    clickToUploadNarration: 'Click to upload voice narration (MP3)',
    autoRotate: 'Auto-Rotate',
    enabled: 'Enabled',
    disabled: 'Disabled',
    rotationSpeed: 'Rotation Speed',
    speedHelper: 'Default: 2 (degrees per second)',
    hotspots: '📍 Points of Interest (Hotspots)',
    addHotspot: '+ Add Hotspot',
    noHotspots: 'No hotspots added yet.',
    hotspotHelper: 'Hotspots appear as clickable points in the VR view.',
    location: 'Location',
    county: 'County',
    subCounty: 'Sub-County',
    ward: 'Ward',
    loadingCounties: 'Loading counties...',
    selectCounty: 'Select County',
    selectCountyFirst: 'Select a county first',
    loadingSubCounties: 'Loading sub-counties...',
    selectSubCounty: 'Select Sub-County',
    selectSubCountyFirst: 'Select a sub-county first',
    loadingWards: 'Loading wards...',
    selectWard: 'Select Ward',
    submissionProcess: '⚠️ Submission Process:',
    submissionItem1: 'Your tour will be reviewed by admin for quality',
    submissionItem2: 'Upon approval, it goes live and you start earning 70% of bookings',
    submissionItem3: 'Pricing: Ksh 300 / student (fixed)',
    submitTour: 'Submit Tour for Review',
    uploading: 'Uploading...',
    noImageError: 'Please upload a 360° image, add a scene, or enter a video URL.',
    sceneAdded: '✅ Scene added! You can now upload another image for the next scene.',
    enterSceneTitle: 'Enter scene title:',
    scenePrefix: 'Scene',
    uploadSuccess: '✅ {type} uploaded successfully!',
    uploadFailed: '❌ Upload failed: {message}',
    recordingUploaded: '✅ Audio recording uploaded successfully!',
    recordingFailed: '❌ Failed to upload recording: {message}',
    submitSuccess: '✅ Tour submitted for admin review!',
    submitFailed: 'Submission failed',
    countiesFailed: 'Could not load counties. Please refresh and try again.',
    subCountiesFailed: 'Could not load sub-counties. Please try again.',
    wardsFailed: 'Could not load wards. Please try again.',
    micDenied: 'Microphone access denied. Please allow microphone permissions.'
  };

  useEffect(() => {
    const translateTexts = async () => {
      if (language === 'en') {
        setTranslatedTexts(texts);
        return;
      }

      const translated = {};
      for (const [key, value] of Object.entries(texts)) {
        const result = await translateContent(value);
        translated[key] = result;
      }
      setTranslatedTexts(translated);
    };

    translateTexts();
  }, [language]);

  const t = translatedTexts;

  // Fetch counties...
  useEffect(() => {
    const fetchCounties = async () => {
      setLoading(prev => ({ ...prev, counties: true }));
      try {
        const response = await fetch(`${BASE_URL}?apiKey=${API_KEY}`);
        const data = await response.json();
        const countyNames = Object.keys(data).sort();
        setCounties(countyNames);
      } catch (err) {
        console.error('Failed to fetch counties:', err);
        alert(t.countiesFailed);
      } finally {
        setLoading(prev => ({ ...prev, counties: false }));
      }
    };
    fetchCounties();
  }, []);

  // Fetch constituencies...
  useEffect(() => {
    if (!formData.location.county) {
      setConstituencies([]);
      setWards([]);
      return;
    }
    const fetchConstituencies = async () => {
      setLoading(prev => ({ ...prev, constituencies: true }));
      try {
        const response = await fetch(`${BASE_URL}?apiKey=${API_KEY}&county=${encodeURIComponent(formData.location.county)}`);
        const data = await response.json();
        const countyData = data[formData.location.county];
        if (countyData) {
          const constituencyNames = Object.keys(countyData).sort();
          setConstituencies(constituencyNames);
        } else {
          setConstituencies([]);
        }
        setFormData(prev => ({
          ...prev,
          location: { ...prev.location, subCounty: '', ward: '' }
        }));
        setWards([]);
      } catch (err) {
        console.error('Failed to fetch constituencies:', err);
        alert(t.subCountiesFailed);
      } finally {
        setLoading(prev => ({ ...prev, constituencies: false }));
      }
    };
    fetchConstituencies();
  }, [formData.location.county]);

  // Fetch wards...
  useEffect(() => {
    if (!formData.location.county || !formData.location.subCounty) {
      setWards([]);
      return;
    }
    const fetchWards = async () => {
      setLoading(prev => ({ ...prev, wards: true }));
      try {
        const response = await fetch(`${BASE_URL}?apiKey=${API_KEY}&county=${encodeURIComponent(formData.location.county)}&constituency=${encodeURIComponent(formData.location.subCounty)}`);
        const data = await response.json();
        const countyData = data[formData.location.county];
        if (countyData && countyData[formData.location.subCounty]) {
          const wardNames = countyData[formData.location.subCounty].sort();
          setWards(wardNames);
        } else {
          setWards([]);
        }
        setFormData(prev => ({
          ...prev,
          location: { ...prev.location, ward: '' }
        }));
      } catch (err) {
        console.error('Failed to fetch wards:', err);
        alert(t.wardsFailed);
      } finally {
        setLoading(prev => ({ ...prev, wards: false }));
      }
    };
    fetchWards();
  }, [formData.location.county, formData.location.subCounty]);

  // ===== AUDIO RECORDING =====
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        uploadRecordedAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert(t.micDenied);
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const uploadRecordedAudio = async (blob) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', blob, `recording-${Date.now()}.mp3`);

    try {
      setUploading(true);
      const res = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData(prev => ({
          ...prev,
          narration: res.data.data.url
        }));
        alert(t.recordingUploaded);
      }
    } catch (err) {
      alert(t.recordingFailed.replace('{message}', err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ===== SCENE MANAGEMENT =====
  const addScene = () => {
    if (!formData.mediaUrl) {
      alert(t.noImageError);
      return;
    }
    const sceneTitle = prompt(t.enterSceneTitle) || `${t.scenePrefix} ${formData.scenes.length + 1}`;
    const newScene = {
      id: Date.now(),
      title: sceneTitle,
      mediaUrl: formData.mediaUrl,
      hotspots: [...formData.hotspots]
    };
    setFormData(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
      mediaUrl: '',
      hotspots: []
    }));
    alert(t.sceneAdded);
  };

  const removeScene = (index) => {
    setFormData(prev => ({
      ...prev,
      scenes: prev.scenes.filter((_, i) => i !== index)
    }));
  };

  // ===== FILE UPLOAD HANDLER =====
  const handleFileUpload = async (e, type = 'image') => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadType(type);
    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        const url = res.data.data.url;
        if (type === 'image') {
          setFormData(prev => ({
            ...prev,
            mediaUrl: url
          }));
        } else if (type === 'thumbnail') {
          setFormData(prev => ({
            ...prev,
            thumbnailUrl: url
          }));
        } else if (type === 'audio') {
          setFormData(prev => ({
            ...prev,
            backgroundMusic: url
          }));
        } else if (type === 'narration') {
          setFormData(prev => ({
            ...prev,
            narration: url
          }));
        }
        alert(t.uploadSuccess.replace('{type}', type));
      }
    } catch (err) {
      alert(t.uploadFailed.replace('{message}', err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // ===== HOTSPOT MANAGEMENT =====
  const addHotspot = () => {
    const pitch = prompt('Enter pitch (vertical angle, -90 to 90):');
    if (pitch === null) return;
    const yaw = prompt('Enter yaw (horizontal angle, -180 to 180):');
    if (yaw === null) return;
    const text = prompt('Enter hotspot label:');
    if (text === null) return;

    setFormData(prev => ({
      ...prev,
      hotspots: [...prev.hotspots, { pitch: parseFloat(pitch), yaw: parseFloat(yaw), text }]
    }));
  };

  const removeHotspot = (index) => {
    setFormData(prev => ({
      ...prev,
      hotspots: prev.hotspots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mediaUrl && formData.scenes.length === 0 && !formData.videoUrl) {
      alert(t.noImageError);
      return;
    }
    if (formData.mediaUrl) {
      const newScene = {
        id: Date.now(),
        title: formData.title || 'Main Scene',
        mediaUrl: formData.mediaUrl,
        hotspots: [...formData.hotspots]
      };
      setFormData(prev => ({
        ...prev,
        scenes: [...prev.scenes, newScene],
        mediaUrl: '',
        hotspots: []
      }));
      setTimeout(async () => {
        await submitTour();
      }, 100);
    } else {
      await submitTour();
    }
  };

  const submitTour = async () => {
    try {
      const scenesData = formData.scenes.map(scene => ({
        title: scene.title,
        mediaUrl: scene.mediaUrl,
        hotspots: scene.hotspots || []
      }));

      const tourData = {
        ...formData,
        scenes: scenesData,
        hasMultipleScenes: scenesData.length > 1,
        mediaUrl: formData.videoUrl || formData.mediaUrl
      };

      await api.post('/tours', tourData);
      alert(t.submitSuccess);
      navigate('/creator/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || t.submitFailed);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h1 style={{ color: '#1a237e', marginBottom: '1.5rem' }}>{t.title}</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="grid-2">
            <div className="form-group">
              <label>{t.tourTitle}</label>
              <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t.category}</label>
              <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="wildlife">Wildlife</option>
                <option value="history">History</option>
                <option value="geography">Geography</option>
                <option value="culture">Culture</option>
                <option value="science">Science</option>
                <option value="environment">Environment</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{t.description}</label>
            <textarea rows="3" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          {/* ===== THUMBNAIL IMAGE UPLOAD ===== */}
          <div className="form-group">
            <label>{t.uploadThumbnail}</label>
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '10px',
              padding: '1.5rem',
              textAlign: 'center',
              background: '#f9f9f9',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={(e) => handleFileUpload(e, 'thumbnail')}
                disabled={uploading}
                style={{ display: 'none' }}
                id="thumbnailInput"
              />
              <label htmlFor="thumbnailInput" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: '2.5rem' }}>🖼️</div>
                <p>{uploading && uploadType === 'thumbnail' ? t.uploading : t.clickToUploadThumbnail}</p>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>{t.thumbnailHelper}</p>
              </label>
            </div>
            {formData.thumbnailUrl && (
              <div style={{ marginTop: '0.5rem' }}>
                <img src={formData.thumbnailUrl} alt="Thumbnail" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
            )}
          </div>

          {/* ===== VIDEO URL INPUT ===== */}
          <div className="form-group">
            <label>{t.videoUrl}</label>
            <input 
              type="url" 
              value={formData.videoUrl} 
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} 
              placeholder={t.videoPlaceholder}
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #ddd', borderRadius: '8px' }}
            />
            <small style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginTop: '0.3rem' }}>
              {t.videoHelper}
            </small>
          </div>

          {/* ===== 360° IMAGE UPLOAD ===== */}
          <div className="form-group">
            <label>{t.upload360}</label>
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '10px',
              padding: '2rem',
              textAlign: 'center',
              background: '#f9f9f9',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={(e) => handleFileUpload(e, 'image')}
                disabled={uploading}
                style={{ display: 'none' }}
                id="fileInput"
              />
              <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: '3rem' }}>🖼️</div>
                <p>{uploading && uploadType === 'image' ? t.uploading : t.clickToUpload360}</p>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>{t.imageHelper}</p>
              </label>
            </div>
            {formData.mediaUrl && (
              <div style={{ marginTop: '0.5rem', color: '#2e7d32' }}>
                ✅ {t.imageReady}
              </div>
            )}
          </div>

          {/* ===== ADD SCENE BUTTON ===== */}
          <button 
            type="button" 
            onClick={addScene} 
            className="btn btn-primary" 
            style={{ marginBottom: '1rem', width: '100%' }}
            disabled={!formData.mediaUrl}
          >
            {t.addScene}
          </button>

          {/* ===== SCENES LIST ===== */}
          {formData.scenes.length > 0 && (
            <div className="form-group">
              <label>{t.scenesList} ({formData.scenes.length})</label>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {formData.scenes.map((scene, index) => (
                  <div key={scene.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span>{index + 1}. {scene.title}</span>
                    <button type="button" onClick={() => removeScene(index)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== BACKGROUND MUSIC ===== */}
          <div className="form-group">
            <label>{t.backgroundMusic}</label>
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '10px',
              padding: '1rem',
              textAlign: 'center',
              background: '#f9f9f9',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav"
                onChange={(e) => handleFileUpload(e, 'audio')}
                disabled={uploading}
                style={{ display: 'none' }}
                id="audioInput"
              />
              <label htmlFor="audioInput" style={{ cursor: 'pointer', display: 'block' }}>
                <p>{uploading && uploadType === 'audio' ? t.uploading : t.clickToUploadMusic}</p>
              </label>
            </div>
            {formData.backgroundMusic && (
              <div style={{ marginTop: '0.5rem', color: '#2e7d32' }}>
                ✅ Music uploaded
              </div>
            )}
          </div>

          {/* ===== VOICE NARRATION - RECORD OR UPLOAD ===== */}
          <div className="form-group">
            <label>{t.voiceNarration}</label>
            
            {/* Recording Section */}
            <div style={{
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1rem',
              background: '#f5f5f5'
            }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{t.recordAudio}</p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={startRecording} 
                  disabled={isRecording || uploading}
                  style={{
                    padding: '0.6rem 1.5rem',
                    background: isRecording ? '#ff5252' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: isRecording || uploading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  {isRecording ? '🔴 Recording...' : t.startRecording}
                </button>
                {isRecording && (
                  <button 
                    type="button" 
                    onClick={stopRecording}
                    style={{
                      padding: '0.6rem 1.5rem',
                      background: '#ff5252',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    {t.stopRecording}
                  </button>
                )}
                {isRecording && (
                  <span style={{ fontSize: '1.2rem', color: '#ff5252' }}>
                    ⏱️ {formatTime(recordingTime)}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                {t.recordHelper}
              </p>
              {audioUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <audio controls src={audioUrl} style={{ width: '100%' }} />
                </div>
              )}
            </div>

            {/* Or Upload */}
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '10px',
              padding: '1rem',
              textAlign: 'center',
              background: '#f9f9f9',
              cursor: 'pointer'
            }}>
              <p style={{ marginBottom: '0.5rem', color: '#888' }}>{t.orUpload}</p>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav"
                onChange={(e) => handleFileUpload(e, 'narration')}
                disabled={uploading}
                style={{ display: 'none' }}
                id="narrationInput"
              />
              <label htmlFor="narrationInput" style={{ cursor: 'pointer', display: 'block' }}>
                <p>{uploading && uploadType === 'narration' ? t.uploading : t.clickToUploadNarration}</p>
              </label>
            </div>
            {formData.narration && (
              <div style={{ marginTop: '0.5rem', color: '#2e7d32' }}>
                ✅ Narration uploaded
              </div>
            )}
          </div>

          {/* ===== AUTO-ROTATE SETTINGS ===== */}
          <div className="grid-2">
            <div className="form-group">
              <label>{t.autoRotate}</label>
              <select 
                value={formData.autoRotate} 
                onChange={(e) => setFormData({ ...formData, autoRotate: e.target.value === 'true' })}
              >
                <option value="true">{t.enabled}</option>
                <option value="false">{t.disabled}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t.rotationSpeed}</label>
              <input 
                type="number" 
                min="0.5" 
                max="10" 
                step="0.5"
                value={formData.autoRotateSpeed} 
                onChange={(e) => setFormData({ ...formData, autoRotateSpeed: parseFloat(e.target.value) })}
              />
              <small style={{ fontSize: '0.8rem', color: '#888' }}>{t.speedHelper}</small>
            </div>
          </div>

          {/* ===== HOTSPOTS ===== */}
          <div className="form-group">
            <label>{t.hotspots}</label>
            <button type="button" onClick={addHotspot} className="btn btn-primary" style={{ marginBottom: '1rem' }}>
              {t.addHotspot}
            </button>
            {formData.hotspots.length === 0 ? (
              <p style={{ color: '#888', fontSize: '0.9rem' }}>{t.noHotspots}</p>
            ) : (
              <div>
                {formData.hotspots.map((hotspot, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span>{hotspot.text} (Pitch: {hotspot.pitch}°, Yaw: {hotspot.yaw}°)</span>
                    <button type="button" onClick={() => removeHotspot(index)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <small style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginTop: '0.5rem' }}>
              {t.hotspotHelper}
            </small>
          </div>

          {/* ===== LOCATION ===== */}
          <h3 style={{ marginTop: '1.5rem', color: '#1a237e' }}>{t.location}</h3>
          <div className="grid-3">
            <div className="form-group">
              <label>{t.county}</label>
              <select 
                value={formData.location.county} 
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, county: e.target.value } })}
                disabled={loading.counties}
              >
                <option value="">{loading.counties ? t.loadingCounties : t.selectCounty}</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t.subCounty}</label>
              <select 
                value={formData.location.subCounty} 
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, subCounty: e.target.value } })}
                disabled={!formData.location.county || loading.constituencies}
              >
                <option value="">
                  {!formData.location.county 
                    ? t.selectCountyFirst
                    : loading.constituencies 
                      ? t.loadingSubCounties
                      : t.selectSubCounty}
                </option>
                {constituencies.map(sc => <option key={sc} value={sc}>{sc}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t.ward}</label>
              <select 
                value={formData.location.ward} 
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, ward: e.target.value } })}
                disabled={!formData.location.subCounty || loading.wards}
              >
                <option value="">
                  {!formData.location.subCounty 
                    ? t.selectSubCountyFirst
                    : loading.wards 
                      ? t.loadingWards
                      : t.selectWard}
                </option>
                {wards.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3e0', borderRadius: 10 }}>
            <p><strong>{t.submissionProcess}</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>{t.submissionItem1}</li>
              <li>{t.submissionItem2}</li>
              <li>{t.submissionItem3}</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={uploading}>
              {uploading ? t.uploading : t.submitTour}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTour;