"use client";
import { useState } from "react";
import { useLang, UI, pick } from "./lang-context";
import { PROFILE } from "./cs-data";
import { Reveal } from "./cs-reveal";
import { Check, Play } from "./cs-icons";

export function Personalization() {
  const { lang } = useLang();
  const u = UI[lang].perso;
  const [tab, setTab] = useState(0);
  const [inst, setInst] = useState(PROFILE.instrumentation);
  const [formality, setFormality] = useState(PROFILE.formality);

  const toggleInst = (id: string) =>
    setInst((prev) => prev.map((x) => x.id === id ? { ...x, on: !x.on } : x));

  const formalityLabel = formality < 40 ? u.relaxed : formality < 72 ? u.refined : u.blacktie;

  return (
    <section className="section-pad perso" id="engine">
      <div className="wrap perso-wrap">
        <div className="perso-copy">
          <Reveal><div className="eyebrow">{u.eyebrow}</div></Reveal>
          <Reveal delay={80} as="h2" className="display">{u.title}</Reveal>
          <Reveal delay={140}><p className="lead">{u.lead}</p></Reveal>
          <Reveal delay={200} className="perso-points">
            {u.points.map((p) => (
              <span key={p} className="perso-point"><Check s={13} /> {p}</span>
            ))}
          </Reveal>
        </div>

        <Reveal delay={120} className="dash">
          <div className="dash-bar">
            <div className="dash-dots"><i /><i /><i /></div>
            <span className="dash-bar-title">studio.ciasinfonica.com</span>
            <span className="dash-bar-tag">{u.live}</span>
          </div>

          <div className="dash-body">
            <div className="dash-profile">
              <div className="dash-avatar">
                {PROFILE.couple.split(" ").filter((w) => w !== "&").map((w) => w[0]).join("")}
              </div>
              <div>
                <div className="dash-couple">{PROFILE.couple}</div>
                <div className="dash-meta">{pick(PROFILE.date, lang)} · {pick(PROFILE.venue, lang)}</div>
              </div>
              <div className="dash-ready">{u.ready}</div>
            </div>

            <div className="dash-tabs">
              {u.tabs.map((t, i) => (
                <button key={t} className={`dash-tab${tab === i ? " on" : ""}`} onClick={() => setTab(i)}>{t}</button>
              ))}
            </div>

            <div className="dash-panel">
              {tab === 0 && (
                <div className="dash-pref">
                  <div className="dash-row">
                    <label>{u.formality}</label>
                    <input
                      type="range" min="0" max="100" value={formality}
                      onChange={(e) => setFormality(+e.target.value)}
                      className="dash-range"
                    />
                    <div className="dash-rangeval">
                      <span>{u.relaxed}</span>
                      <b>{formalityLabel}</b>
                      <span>{u.blacktie}</span>
                    </div>
                  </div>
                  <div className="dash-instr">
                    <label>{u.instrumentation}</label>
                    <div className="dash-chips">
                      {inst.map((x) => (
                        <button
                          key={x.id}
                          className={`dash-chip${x.on ? " on" : ""}`}
                          onClick={() => toggleInst(x.id)}
                        >
                          <span className="dash-chip-dot" /> {pick(x.name, lang)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 1 && (
                <div className="dash-emotion">
                  {Object.entries(PROFILE.emotion[lang]).map(([k, v]) => (
                    <div className="dash-emo" key={k}>
                      <div className="dash-emo-top"><span>{k}</span><b>{v}</b></div>
                      <div className="dash-emo-track">
                        <div className="dash-emo-fill" style={{ width: `${v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 2 && (
                <div className="dash-songs">
                  {PROFILE.songs.map((s, i) => (
                    <div className="dash-song" key={i}>
                      <div className="dash-song-play"><Play s={10} /></div>
                      <div className="dash-song-main">
                        <div className="dash-song-title">{pick(s.title, lang)}</div>
                        <div className="dash-song-artist">{pick(s.artist, lang)} · {pick(s.moment, lang)}</div>
                      </div>
                      <div className="dash-song-match"><b>{s.match}%</b><span>{u.match}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
