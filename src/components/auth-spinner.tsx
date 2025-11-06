"use client";

import { useEffect, useState } from "react";

export default function AuthSpinner() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAuthAction = () => {
      setLoading(true);
      
      // Set a timeout to hide the spinner if it's been showing too long
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10 second timeout
      
      return timeout;
    };

    const onClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for sign-in/sign-up buttons
      if (target.closest('.sign-in-btn') || target.closest('.sign-up-btn')) {
        handleAuthAction();
        return;
      }

      // Check for sign-out button
      if (target.closest('.sign-out-btn')) {
        handleAuthAction();
        return;
      }
    };

    const onSubmit = (e: Event) => {
      const form = (e.target as HTMLElement).closest('form');
      if (!form) return;
      
      // Only show spinner for auth-related forms
      const isAuthForm = form.querySelector('.sign-in-btn, .sign-up-btn, .sign-out-btn');
      if (isAuthForm) {
        const timeout = handleAuthAction();
        
        // Clear the timeout if the form submission completes
        Promise.resolve().then(() => {
          clearTimeout(timeout);
          // Give a small delay before hiding the spinner to ensure the UI updates
          setTimeout(() => setLoading(false), 500);
        });
      }
    };

    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit, true);

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('submit', onSubmit, true);
    };
  }, []);

  if (!loading) return null;

  return (
    <div style={overlayStyle} aria-hidden={false}>
      <div style={spinnerWrapStyle}>
        <div style={spinnerStyle} />
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const spinnerWrapStyle: React.CSSProperties = {
  padding: 20,
  borderRadius: 12,
  background: "rgba(0,0,0,0.06)",
};

const spinnerStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "4px solid #e5e7eb",
  borderTopColor: "#2563eb",
  animation: "spin 1s linear infinite",
};

// Keyframes are injected via global style element to avoid editing CSS files
(function injectKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById("auth-spinner-keyframes")) return;
  const style = document.createElement("style");
  style.id = "auth-spinner-keyframes";
  style.innerHTML = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
})();
