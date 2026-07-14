import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateTour = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'wildlife',
    mediaType: '360_image', mediaUrl: '', thumbnailUrl: '',
    videoUrl: '', // NEW: Video URL field
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
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const API_KEY = 'keyPub1569gsvndc123kg9sjhg';
  const BASE_URL = 'https://kenyaareadata.vercel.app/api/areas';

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
        alert('Could not load counties. Please refresh and try again.');
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
        alert('Could not load sub-counties. Please try again.');
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
        alert('Could not load wards. Please try again.');
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
      alert('Microphone access denied. Please allow microphone permissions.');
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
        alert('✅ Audio recording uploaded successfully!');
      }
    } catch (err) {
      alert('❌ Failed to upload recording: ' + (err.response?.data?.message || err.message));
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
      alert('Please upload a 360° image for the scene first.');
      return;
    }
    const sceneTitle = prompt('Enter scene title:') || `Scene ${formData.scenes.length + 1}`;
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
    alert('✅ Scene added! You can now upload another image for the next scene.');
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
        alert(`✅ ${type} uploaded successfully!`);
      }
    } catch (err) {
      alert('❌ Upload failed: ' + (err.response?.data?.message || err.message));
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
      alert('Please upload a 360° image, add a scene, or enter a video URL.');
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
        // If videoUrl is provided, use it as mediaUrl
        mediaUrl: formData.videoUrl || formData.mediaUrl
      };

      await api.post('/tours', tourData);
      alert('✅ Tour submitted for admin review!');
      navigate('/creator/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h1 style={{ color: '#1a237e', marginBottom: '1.5rem' }}>🎬 Create New Virtual Tour</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="grid-2">
            <div className="form-group">
              <label>Tour Title</label>
              <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category</label>
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
            <label>Description</label>
            <textarea rows="3" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          {/* ===== THUMBNAIL IMAGE UPLOAD ===== */}
          <div className="form-group">
            <label>📸 Upload Thumbnail Image</label>
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
                <p>{uploading && uploadType === 'thumbnail' ? 'Uploading...' : 'Click to upload thumbnail image'}</p>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>This image will appear on the tour card (JPEG, PNG)</p>
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
            <label>🎥 Video URL (Optional - YouTube or direct video link)</label>
            <input 
              type="url" 
              value={formData.videoUrl} 
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} 
              placeholder="https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #ddd', borderRadius: '8px' }}
            />
            <small style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginTop: '0.3rem' }}>
              Paste a video link (YouTube, Vimeo, or direct MP4 URL). The video will be displayed in the VR viewer.
            </small>
          </div>

          {/* ===== 360° IMAGE UPLOAD ===== */}
          <div className="form-group">
            <label>📸 Upload 360° Image</label>
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
                <p>{uploading && uploadType === 'image' ? 'Uploading...' : 'Click to upload 360° image'}</p>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>JPEG, PNG, GIF (Max 500MB)</p>
              </label>
            </div>
            {formData.mediaUrl && (
              <div style={{ marginTop: '0.5rem', color: '#2e7d32' }}>
                ✅ Image ready to add as scene
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
            ➕ Add Current Image as Scene
          </button>

          {/* ===== SCENES LIST ===== */}
          {formData.scenes.length > 0 && (
            <div className="form-group">
              <label>📋 Scenes ({formData.scenes.length})</label>
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
            <label>🎵 Background Music (Optional)</label>
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
                <p>{uploading && uploadType === 'audio' ? 'Uploading...' : 'Click to upload background music (MP3)'}</p>
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
            <label>🎙️ Voice Narration</label>
            
            {/* Recording Section */}
            <div style={{
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1rem',
              background: '#f5f5f5'
            }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Record Audio</p>
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
                  {isRecording ? '🔴 Recording...' : '🎤 Start Recording'}
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
                    ⏹️ Stop
                  </button>
                )}
                {isRecording && (
                  <span style={{ fontSize: '1.2rem', color: '#ff5252' }}>
                    ⏱️ {formatTime(recordingTime)}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                Click record, speak into your microphone, then stop.
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
              <p style={{ marginBottom: '0.5rem', color: '#888' }}>— OR Upload Audio File —</p>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav"
                onChange={(e) => handleFileUpload(e, 'narration')}
                disabled={uploading}
                style={{ display: 'none' }}
                id="narrationInput"
              />
              <label htmlFor="narrationInput" style={{ cursor: 'pointer', display: 'block' }}>
                <p>{uploading && uploadType === 'narration' ? 'Uploading...' : 'Click to upload voice narration (MP3)'}</p>
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
              <label>Auto-Rotate</label>
              <select 
                value={formData.autoRotate} 
                onChange={(e) => setFormData({ ...formData, autoRotate: e.target.value === 'true' })}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div className="form-group">
              <label>Rotation Speed</label>
              <input 
                type="number" 
                min="0.5" 
                max="10" 
                step="0.5"
                value={formData.autoRotateSpeed} 
                onChange={(e) => setFormData({ ...formData, autoRotateSpeed: parseFloat(e.target.value) })}
              />
              <small style={{ fontSize: '0.8rem', color: '#888' }}>Default: 2 (degrees per second)</small>
            </div>
          </div>

          {/* ===== HOTSPOTS ===== */}
          <div className="form-group">
            <label>📍 Points of Interest (Hotspots)</label>
            <button type="button" onClick={addHotspot} className="btn btn-primary" style={{ marginBottom: '1rem' }}>
              + Add Hotspot
            </button>
            {formData.hotspots.length === 0 ? (
              <p style={{ color: '#888', fontSize: '0.9rem' }}>No hotspots added yet.</p>
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
              Hotspots appear as clickable points in the VR view.
            </small>
          </div>

          {/* ===== LOCATION ===== */}
          <h3 style={{ marginTop: '1.5rem', color: '#1a237e' }}>Location</h3>
          <div className="grid-3">
            <div className="form-group">
              <label>County</label>
              <select 
                value={formData.location.county} 
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, county: e.target.value } })}
                disabled={loading.counties}
              >
                <option value="">{loading.counties ? 'Loading counties...' : 'Select County'}</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Sub-County</label>
              <select 
                value={formData.location.subCounty} 
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, subCounty: e.target.value } })}
                disabled={!formData.location.county || loading.constituencies}
              >
                <option value="">
                  {!formData.location.county 
                    ? 'Select a county first' 
                    : loading.constituencies 
                      ? 'Loading sub-counties...' 
                      : 'Select Sub-County'}
                </option>
                {constituencies.map(sc => <option key={sc} value={sc}>{sc}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Ward</label>
              <select 
                value={formData.location.ward} 
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, ward: e.target.value } })}
                disabled={!formData.location.subCounty || loading.wards}
              >
                <option value="">
                  {!formData.location.subCounty 
                    ? 'Select a sub-county first' 
                    : loading.wards 
                      ? 'Loading wards...' 
                      : 'Select Ward'}
                </option>
                {wards.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3e0', borderRadius: 10 }}>
            <p><strong>⚠️ Submission Process:</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Your tour will be reviewed by admin for quality</li>
              <li>Upon approval, it goes live and you start earning 70% of bookings</li>
              <li>Pricing: Ksh 300 / student (fixed)</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Submit Tour for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTour;