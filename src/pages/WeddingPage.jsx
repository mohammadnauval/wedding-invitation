import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CoverSection from '../components/wedding/CoverSection';
import HeroSection from '../components/wedding/HeroSection';
import GreetingSection from '../components/wedding/GreetingSection';
import CoupleSection from '../components/wedding/CoupleSection';
import EventSection from '../components/wedding/EventSection';
import CountdownSection from '../components/wedding/CountdownSection';
import GallerySection from '../components/wedding/GallerySection';
import RsvpSection from '../components/wedding/RsvpSection';


import ClosingSection from '../components/wedding/ClosingSection';
import SectionDivider from '../components/wedding/SectionDivider';
import FloatingNav from '../components/wedding/FloatingNav';
import MusicPlayer from '../components/wedding/MusicPlayer';
import FallingHearts from '../components/wedding/FallingHearts';
import LoadingScreen from '../components/wedding/LoadingScreen';

function WeddingPage() {
  const { guestSlug } = useParams();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [guestData, setGuestData] = useState(null);
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Stop audio when user leaves the page (tab close, navigate away, or route change)
  useEffect(() => {
    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    // Tab hidden or browser closed
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') stopAudio();
    };

    // iOS Safari / mobile: fires reliably on page exit
    const handlePageHide = () => stopAudio();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      // React unmount (navigating to another route)
      stopAudio();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  const guestName = searchParams.get('to') || '';
  const token = searchParams.get('t') || '';

  useEffect(() => {
    fetchWeddingData();
  }, [guestSlug, guestName, token]);

  const fetchWeddingData = async () => {
    try {
      let url = '/api/invitations';
      if (guestSlug) {
        url = `/api/invitations/${guestSlug}`;
      } else if (token) {
        url = `/api/invitations?t=${token}`;
      } else if (guestName) {
        url = `/api/invitations?to=${encodeURIComponent(guestName)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          setError('not_found');
        } else {
          setError('server_error');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setWeddingData(data.wedding);
      setGuestData(data.guest);
      setLoading(false);
    } catch (err) {
      setError('network_error');
      setLoading(false);
    }
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current && weddingData?.settings?.music_enabled === '1') {
      audioRef.current.play().catch(() => {});
    }
  };

  if (loading) return <LoadingScreen />;

  if (error === 'not_found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-soft)]">
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold mb-2">Undangan Tidak Ditemukan</h1>
          <p className="text-[var(--color-text-muted)]">
            Link undangan tidak valid atau sudah tidak berlaku.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-soft)]">
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold mb-2">Terjadi Kesalahan</h1>
          <p className="text-[var(--color-text-muted)]">
            {error === 'network_error'
              ? 'Koneksi internet bermasalah. Silakan coba kembali.'
              : 'Terjadi kesalahan. Silakan coba kembali.'}
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-4">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const displayName = guestData?.name || guestName || 'Bapak/Ibu/Saudara/i';

  return (
    <div className="relative bg-[var(--color-bg)]">
      {/* Desktop decorative background */}
      <div className="hidden lg:block fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[var(--color-bg-dark)]" />
        <div className="absolute left-0 top-0 w-1/4 h-full opacity-20 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
        <div className="absolute right-0 top-0 w-1/4 h-full opacity-20 bg-gradient-to-l from-[var(--color-primary)] to-transparent" />
      </div>

      {/* Main content - centered card on desktop */}
      <div className="relative z-10 max-w-[480px] mx-auto min-h-screen bg-[var(--color-bg)] lg:shadow-2xl">
        {!isOpen ? (
          <CoverSection
            weddingData={weddingData}
            guestName={displayName}
            guestData={guestData}
            onOpen={handleOpenInvitation}
          />
        ) : (
          <>
            <HeroSection weddingData={weddingData} />
            <SectionDivider variant="hearts" />
            <GreetingSection weddingData={weddingData} />
            <SectionDivider variant="hearts" />
            <CoupleSection weddingData={weddingData} />
            <SectionDivider variant="hearts" />
            <EventSection weddingData={weddingData} />
            <SectionDivider variant="hearts" />
            <CountdownSection weddingData={weddingData} />
            {weddingData?.settings?.rsvp_enabled === '1' && (
              <>
                <SectionDivider variant="hearts" />
                <RsvpSection guestData={guestData} weddingData={weddingData} />
              </>
            )}
            <SectionDivider variant="hearts" />
            <ClosingSection weddingData={weddingData} />
            {weddingData?.settings?.gallery_enabled === '1' && (
              <>
                <SectionDivider variant="hearts" />
                <GallerySection weddingData={weddingData} />
              </>
            )}
            <FloatingNav weddingData={weddingData} />
            <MusicPlayer audioRef={audioRef} weddingData={weddingData} />
            <FallingHearts />
          </>
        )}
      </div>

      {/* Audio element */}
      {weddingData?.music && (
        <audio ref={audioRef} loop preload="auto">
          <source src={weddingData.music.url} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}

export default WeddingPage;
