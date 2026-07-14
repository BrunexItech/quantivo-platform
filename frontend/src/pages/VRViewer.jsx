import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import api from '../services/api';

const VRViewer = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const viewerRef = useRef(null);
  const audioRef = useRef(null);
  const narrationRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const audioStartedRef = useRef(false);

  useEffect(() => {
    api.get(`/tours/${id}`).then(res => {
      const tourData = res.data.data;
      setTour(tourData);
      api.post(`/tours/${id}/view`).catch(() => {});
    });
  }, [id]);

  useEffect(() => {
    if (!tour) return;

    const scenes = tour.scenes && tour.scenes.length > 0 
      ? tour.scenes 
      : (tour.mediaUrl ? [{ title: tour.title, mediaUrl: tour.mediaUrl, hotspots: tour.hotspots || [] }] : []);
    
    if (scenes.length === 0) return;

    if (scriptLoadedRef.current) {
      loadScene(0);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.onload = () => {
      scriptLoadedRef.current = true;
      loadScene(0);
    };
    document.body.appendChild(script);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [tour]);

  const startAudio = () => {
    if (audioStartedRef.current) return;
    audioStartedRef.current = true;

    if (tour?.backgroundMusic && audioRef.current) {
      audioRef.current.src = tour.backgroundMusic + '?t=' + Date.now();
      audioRef.current.load();
      audioRef.current.play().catch(() => {
        console.log('Background music autoplay blocked');
      });
    }

    if (tour?.narration) {
      if (narrationRef.current) {
        narrationRef.current.pause();
        narrationRef.current.currentTime = 0;
      }
      narrationRef.current = new Audio(tour.narration + '?t=' + Date.now());
      narrationRef.current.load();
      narrationRef.current.play().catch((err) => {
        console.log('Narration autoplay blocked:', err);
      });
    }
  };

  const loadScene = (index) => {
    if (!tour) return;

    if (!window.pannellum) {
      console.log('Waiting for Pannellum to load...');
      setTimeout(() => loadScene(index), 300);
      return;
    }

    const scenes = tour.scenes && tour.scenes.length > 0 
      ? tour.scenes 
      : (tour.mediaUrl ? [{ title: tour.title, mediaUrl: tour.mediaUrl, hotspots: tour.hotspots || [] }] : []);
    
    if (index >= scenes.length) return;

    const scene = scenes[index];
    setIsTransitioning(true);
    setCurrentSceneIndex(index);
    audioStartedRef.current = false;

    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    const hotspots = (scene.hotspots || []).map((h) => ({
      pitch: h.pitch,
      yaw: h.yaw,
      type: 'info',
      text: h.text,
      clickHandlerFunc: () => {
        alert(`📍 ${h.text}`);
      }
    }));

    // ===== DETECT IF VIDEO =====
    const mediaUrl = scene.mediaUrl || tour.mediaUrl;
    const isVideo = tour.mediaType === '360_video' || 
                    (mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') || mediaUrl.includes('cloudinary.com/video')));

    // ===== CONFIG WITH VIDEO SUPPORT =====
    const config = {
      type: 'equirectangular',
      autoLoad: true,
      showControls: true,
      compass: false,
      hfov: 100,
      pitch: 0,
      yaw: 0,
      minPitch: -90,
      maxPitch: 90,
      minHfov: 30,
      maxHfov: 120,
      autoRotate: tour.autoRotate !== undefined ? tour.autoRotate : true,
      autoRotateSpeed: tour.autoRotateSpeed || 2.0,
      hotSpots: hotspots
    };

    // ===== IF VIDEO, USE video PROPERTY =====
    if (isVideo) {
      config.panorama = mediaUrl;
      config.video = mediaUrl;
    } else {
      config.panorama = mediaUrl;
    }

    viewerRef.current = window.pannellum.viewer('panorama', config);

    viewerRef.current.on('load', () => {
      startAudio();
    });

    const titleEl = document.getElementById('scene-title');
    if (titleEl) {
      titleEl.textContent = scene.title || tour.title;
    }

    const indicatorEl = document.getElementById('scene-indicator');
    if (indicatorEl) {
      indicatorEl.textContent = `${index + 1} / ${scenes.length}`;
    }

    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextScene = () => {
    const scenes = tour.scenes && tour.scenes.length > 0 
      ? tour.scenes 
      : (tour.mediaUrl ? [{ title: tour.title, mediaUrl: tour.mediaUrl, hotspots: tour.hotspots || [] }] : []);
    if (currentSceneIndex < scenes.length - 1) {
      loadScene(currentSceneIndex + 1);
    }
  };

  const prevScene = () => {
    if (currentSceneIndex > 0) {
      loadScene(currentSceneIndex - 1);
    }
  };

  if (!tour) return <div className="container">Loading VR experience...</div>;

  const scenes = tour.scenes && tour.scenes.length > 0 
    ? tour.scenes 
    : (tour.mediaUrl ? [{ title: tour.title, mediaUrl: tour.mediaUrl, hotspots: tour.hotspots || [] }] : []);
  const hasMultipleScenes = scenes.length > 1;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 3000 }}>
      <audio ref={audioRef} loop style={{ display: 'none' }} />

      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        zIndex: 10, 
        background: 'rgba(0,0,0,0.8)', 
        padding: '1rem', 
        borderRadius: 12, 
        color: 'white',
        backdropFilter: 'blur(10px)',
        maxWidth: '80%',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 id="scene-title" style={{ margin: 0 }}>{tour.title}</h2>
        <Link to={`/tours/${id}`} style={{ color: '#4fc3f7', fontSize: '0.9rem' }}>← Back to tour</Link>
        
        {hasMultipleScenes && (
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.3rem' }}>
            <span id="scene-indicator">1 / {scenes.length}</span>
            {isTransitioning && <span style={{ marginLeft: '0.5rem' }}>🔄 Loading...</span>}
          </div>
        )}
        
        {tour.backgroundMusic && (
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>🎵 Background music</div>
        )}
        {tour.narration && (
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>🎙️ Narration</div>
        )}
        {tour.autoRotate && (
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>🔄 Auto-rotate</div>
        )}
        {tour.mediaType === '360_video' && (
          <div style={{ fontSize: '0.8rem', color: '#4fc3f7' }}>🎥 360° Video</div>
        )}
      </div>

      <div id="panorama" style={{ width: '100%', height: '100%' }} />

      {hasMultipleScenes && (
        <>
          <button 
            onClick={prevScene}
            disabled={currentSceneIndex === 0}
            style={{ 
              position: 'absolute', 
              left: 20, 
              top: '50%', 
              transform: 'translateY(-50%)',
              zIndex: 10,
              padding: '1rem 1.2rem',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 50,
              cursor: currentSceneIndex === 0 ? 'not-allowed' : 'pointer',
              fontSize: '1.5rem',
              opacity: currentSceneIndex === 0 ? 0.3 : 1
            }}
          >
            ◀
          </button>
          <button 
            onClick={nextScene}
            disabled={currentSceneIndex === scenes.length - 1}
            style={{ 
              position: 'absolute', 
              right: 20, 
              top: '50%', 
              transform: 'translateY(-50%)',
              zIndex: 10,
              padding: '1rem 1.2rem',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 50,
              cursor: currentSceneIndex === scenes.length - 1 ? 'not-allowed' : 'pointer',
              fontSize: '1.5rem',
              opacity: currentSceneIndex === scenes.length - 1 ? 0.3 : 1
            }}
          >
            ▶
          </button>
        </>
      )}

      <button 
        onClick={() => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
        }} 
        style={{ 
          position: 'absolute', 
          bottom: 30, 
          right: 30, 
          zIndex: 10,
          padding: '0.8rem 1.5rem', 
          background: 'rgba(30, 136, 229, 0.9)', 
          color: 'white', 
          border: 'none', 
          borderRadius: 50, 
          cursor: 'pointer', 
          fontSize: '0.9rem',
          backdropFilter: 'blur(10px)'
        }}
      >
        ⛶ Fullscreen
      </button>
    </div>
  );
};

export default VRViewer;