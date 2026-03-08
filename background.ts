export {}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "LOOKUP_WORD") return false

  const word: string = message.word
  fetch(`https://malid.is/api_proxy/${encodeURIComponent(word)}`)
    .then((response) => response.json())
    .then((data) => {
      const id = data?.malid?.kata?.[0]?.id ?? null
      sendResponse({ id: id ? String(id) : null })
    })
    .catch(() => sendResponse({ id: null }))

  return true;
})
