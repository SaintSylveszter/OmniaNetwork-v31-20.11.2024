import React, { useState, useEffect } from 'react';

interface CookieBannerProps {
  language?: 'EN' | 'RO';
  position?: 'bottom' | 'top';
  onAccept?: () => void;
  onReject?: () => void;
}

const COOKIE_CONSENT_KEY = 'cookie_consent';

const translations = {
  EN: {
    message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
    accept: 'Accept',
    reject: 'Reject',
    settings: 'Cookie Settings',
    learnMore: 'Learn more'
  },
  RO: {
    message: 'Folosim cookie-uri pentru a îmbunătăți experiența dumneavoastră. Continuând să vizitați acest site, sunteți de acord cu utilizarea cookie-urilor.',
    accept: 'Accept',
    reject: 'Refuz',
    settings: 'Setări Cookie',
    learnMore: 'Află mai multe'
  }
};

const CookieBanner: React.FC<CookieBannerProps> = ({
  language = 'EN',
  position = 'bottom',
  onAccept,
  onReject
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    onAccept?.();
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setIsVisible(false);
    onReject?.();
  };

  if (!isVisible) return null;

  const text = translations[language];

  return (
    <div
      className={`fixed ${position}-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50`}
      style={{
        animation: `${position === 'bottom' ? 'slideUp' : 'slideDown'} 0.5s ease-out`
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm">{text.message}</p>
          <button
            onClick={() => window.open('/cookie-policy', '_blank')}
            className="text-sm text-blue-400 hover:text-blue-300 underline mt-1"
          >
            {text.learnMore}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            {text.reject}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
          >
            {text.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;