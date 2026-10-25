"use client";

export function CookieSettingsButton() {
  const reopen = () => {
    window.dispatchEvent(new Event("hw:show-cookie-banner"));
  };

  return (
    <button
      type="button"
      onClick={reopen}
      className="transition hover:text-brand-blue"
    >
      Cookie Settings
    </button>
  );
}
