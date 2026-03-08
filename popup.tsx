import { useEffect, useState } from "react"

type Lang = "is" | "en" | "pl"

const LANGS: { value: Lang; code: string; native: string }[] = [
  { value: "is", code: "IS", native: "Íslenska" },
  { value: "en", code: "EN", native: "English" },
  { value: "pl", code: "PL", native: "Polski" },
]

function IndexPopup() {
  const [lang, setLang] = useState<Lang>("is")

  useEffect(() => {
    chrome.storage.local.get("lang", (data) => {
      if (data.lang) setLang(data.lang as Lang)
    })
  }, [])

  function handleChange(value: Lang) {
    setLang(value)
    chrome.storage.local.set({ lang: value })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0f14; }

        .root {
          width: 320px;
          background: #0c0f14;
          color: #e2e5eb;
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .aurora {
          position: absolute;
          top: 0; left: 0; right: 0; height: 140px;
          background:
            radial-gradient(ellipse at 70% -10%, rgba(74,222,128,0.13) 0%, transparent 65%),
            radial-gradient(ellipse at 10% 10%, rgba(56,189,248,0.10) 0%, transparent 55%);
          pointer-events: none;
        }

        .content {
          position: relative;
          padding: 22px 20px 20px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1;
          background: linear-gradient(130deg, #f0f4f8 20%, #93c5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pip {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74,222,128,0.6);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .desc {
          font-size: 12px;
          font-weight: 300;
          color: #55606e;
          line-height: 1.65;
          margin-bottom: 20px;
        }

        .desc a {
          color: #38bdf8;
          text-decoration: none;
          border-bottom: 1px solid rgba(56,189,248,0.25);
          transition: color 0.1s, border-color 0.1s;
        }
        .desc a:hover {
          color: #7dd3fc;
          border-bottom-color: rgba(125,211,252,0.5);
        }

        .section-label {
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #374151;
          margin-bottom: 8px;
        }

        .lang-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .lang-btn {
          all: unset;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 6px 9px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
        }
        .lang-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.10);
        }
        .lang-btn.active {
          background: rgba(74,222,128,0.07);
          border-color: rgba(74,222,128,0.35);
        }

        .btn-code {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: #6b7280;
          margin-bottom: 3px;
          transition: color 0.12s;
        }
        .lang-btn.active .btn-code {
          color: #4ade80;
        }

        .btn-native {
          font-size: 10px;
          font-weight: 300;
          color: #374151;
          transition: color 0.12s;
        }
        .lang-btn.active .btn-native {
          color: rgba(74,222,128,0.5);
        }

        .rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, transparent);
          margin: 18px 0 12px;
        }

        .footer {
          text-align: center;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #1f2937;
        }
      `}</style>
      <div className="root">
        <div className="aurora" />
        <div className="content">
          <div className="header">
            <span className="title">
              Reinar
            </span>
            <div className="pip" />
          </div>

          <p className="desc">
            Looks up words from the{" "}
            <a href="https://ord.ruv.is" target="_blank" rel="noopener noreferrer">ord.ruv.is</a>{" "}
            player and injects a link to{" "}
            <a href="https://m.is/ordabok" target="_blank" rel="noopener noreferrer">m.is</a>.
          </p>

          <div className="section-label">Dictionary language</div>
          <div className="lang-grid">
            {LANGS.map(({ value, code, native }) => (
              <button
                key={value}
                className={`lang-btn${lang === value ? " active" : ""}`}
                onClick={() => handleChange(value)}>
                <span className="btn-code">{code}</span>
                <span className="btn-native">{native}</span>
              </button>
            ))}
          </div>

          <div className="rule" />
          <div className="footer">m.is · ord.ruv.is</div>
        </div>
      </div>
    </>
  )
}

export default IndexPopup
