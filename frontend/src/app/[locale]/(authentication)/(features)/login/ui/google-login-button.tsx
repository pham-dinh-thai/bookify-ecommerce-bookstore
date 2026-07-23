'use client';

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full h-11 rounded-full border-[1.5px] border-[#e8ede9] bg-white text-[#58615b] text-[13px] font-semibold hover:bg-[#f7faf5] transition-colors flex items-center justify-center gap-2.5 mt-5"
    >
      <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://w3.org/2000/svg">
        <path fill="#4285F4" d="M24 9.5c3.9 0 6.7 1.6 8.5 3.1l6.4-6.4C34.5 2.5 29.8 0 24 0 14.6 0 6.5 6.6 3.2 14l7.4 5.7C12.5 14.8 17.6 9.5 24 9.5z"/>
        <path fill="#34A853" d="M46.6 24.5c0-1.6-.1-2.9-.4-4.1H24v8.4h12.8c-.5 2.5-2.1 4.6-4.5 6.1l7.1 5.5c4.1-3.8 6.5-9.4 6.5-15.9z"/>
        <path fill="#FBBC05" d="M10.6 19C10 20.9 9.5 22.9 9.5 25s.5 4.1 1.1 6l-7.1 5.5C1.3 31.5 0 28.3 0 25s1.3-6.5 3.5-9.5l7.1 5.5z"/>
        <path fill="#EA4335" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2.2 1.5-5 2.3-8.8 2.3-6.4 0-11.5-4.5-13.4-10C.5 22.5 2.5 18.5 6 16l-2.5-2C1.3 16.5 0 20.5 0 25s1.3 8.5 3.5 11.5l7.1-5.5z"/>
      </svg>
      Continue with Google
    </button>
  );
}
