async function copyPngDataUrlToClipboard(dataUrl) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  await navigator.clipboard.write([
    new ClipboardItem({ [blob.type || "image/png"]: blob })
  ]);
}

(async () => {
  const status = document.getElementById("status");
  const detail = document.getElementById("detail");

  try {
    const resp = await chrome.runtime.sendMessage({ type: "CAPTURE_VISIBLE" });
    if (!resp?.ok || !resp?.dataUrl) throw new Error(resp?.error || "Capture failed");

    await copyPngDataUrlToClipboard(resp.dataUrl);

    status.textContent = "Copied ✓";
    setTimeout(() => window.close(), 250);
  } catch (e) {
    console.error(e);
    status.textContent = "Failed !";
    detail.textContent = String(e);
  }
})();
