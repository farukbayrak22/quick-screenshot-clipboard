chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (msg?.type !== "CAPTURE_VISIBLE") {
      sendResponse({ ok: false, error: "Unknown message" });
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.windowId || !tab?.url) {
      sendResponse({ ok: false, error: "No active tab" });
      return;
    }

    if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) {
      sendResponse({ ok: false, error: "Cannot capture chrome:// pages" });
      return;
    }

    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
    sendResponse({ ok: true, dataUrl });
  })().catch((e) => {
    console.error("SW error:", e);
    sendResponse({ ok: false, error: String(e) });
  });

  return true; // async
});
