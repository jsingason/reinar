export const config = {
  matches: ["https://ord.ruv.is/player/*"]
}

const CONTAINER_ID = "ruv-ord-link"

function queryShadowRoots(selector: string): Element | null {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
  let node: Node | null = walker.currentNode
  while (node) {
    const el = node as Element
    if (el.shadowRoot) {
      const found = el.shadowRoot.querySelector(selector)
      if (found) return found
    }
    node = walker.nextNode()
  }
  return null
}

function getWord(): string | null {
  const el = queryShadowRoots(".poly-box-header-word-lemma")
  if (!el) return null
  const word = el.textContent?.replace(/\u00A0/g, " ").trim() || null
  return word || null
}

async function lookupWord(word: string): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "LOOKUP_WORD", word }, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null)
        return
      }
      resolve(response?.id ?? null)
    })
  })
}

async function getLang(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.local.get("lang", (data) => {
      resolve((data.lang as string) ?? "is")
    })
  })
}

async function injectLink(id: string) {
  queryShadowRoots(`#${CONTAINER_ID}`)?.remove()
  document.getElementById(CONTAINER_ID)?.remove()

  const lang = await getLang()

  const anchor = document.createElement("a")
  anchor.href = `https://m.is/ordabok/${id}?lang=${lang}`
  anchor.target = "_blank"
  anchor.rel = "noopener noreferrer"
  anchor.textContent = "m.is - Orðabók"
  anchor.style.cssText =
    "display:inline;font-size:2em;color:#4a9eff"

  const div = document.createElement("div")
  div.id = CONTAINER_ID
  div.style.cssText = "display:block;width:100%;text-align:center;margin-bottom:1em;"
  div.appendChild(anchor)

  const insertTarget = queryShadowRoots("#poly-box-web-dictionary-text")
  if (!insertTarget) return

  insertTarget.textContent = "Google Translate"

  const block = insertTarget.closest("li") ?? insertTarget.parentElement ?? insertTarget
  block.insertAdjacentElement("afterend", div)
}

let currentWord: string | null = null
let pending = false

async function update() {
  const word = getWord()
  if (!word) return
  if (word === currentWord) return
  currentWord = word

  document.getElementById(CONTAINER_ID)?.remove()

  if (pending) return
  pending = true
  const id = await lookupWord(word)
  pending = false

  if (word !== currentWord) {
    update()
    return
  }

  if (id) {
    await injectLink(id)
  }
}

const observer = new MutationObserver(() => update())
observer.observe(document.body, { childList: true, subtree: true, characterData: true })

setInterval(() => update(), 500)

update()
