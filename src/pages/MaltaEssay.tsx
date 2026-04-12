import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from "recharts";

import taHagratImg from "@/assets/Ta__Hag_rat.jpg";
import talQadiImg from "@/assets/Tal-Qadi.jpg";
import ggantija from "@/assets/G_gantija.jpg";
import hagarQim from "@/assets/Hagar_Qim.jpg";
import halSaflieni from "@/assets/Hal_Saflieni.jpg";
import mnajdra from "@/assets/Mnajdra.jpg";
import elephantLeft from "@/assets/Elefante_izquierda.png";
import elephantRight from "@/assets/Elefante_derecha.png";
import diagrama from "@/assets/Diagrama.jpg";
import mediterraneoGlacial from "@/assets/Mediterraneo_glacial.jpg";
import heroMalta from "@/assets/hero_malta.jpg";
import taHagratCard from "@/assets/Ta_Hagrat_card.jpg";
import talQadiCard from "@/assets/Tal_Qadi_card.jpg";
import ggantijaCard from "@/assets/Ggantija_card.jpg";
import hagarQimCard from "@/assets/Hagar_Qim_card.jpg";
import halSaflieniCard from "@/assets/Hal_Saflieni_card.jpg";
import mnajdraCard from "@/assets/Mnajdra_card.jpg";

const SEA_LEVEL_DATA = [
  { year: "20000 a.C.", level: -120, raw: -20000 },
  { year: "17000 a.C.", level: -100, raw: -17000 },
  { year: "14000 a.C.", level: -80, raw: -14000 },
  { year: "12000 a.C.", level: -58, raw: -12000 },
  { year: "10000 a.C.", level: -35, raw: -10000 },
  { year: "8000 a.C.", level: -18, raw: -8000 },
  { year: "7000 a.C.", level: -10, raw: -7000 },
  { year: "6000 a.C.", level: -5, raw: -6000 },
  { year: "4000 a.C.", level: -2, raw: -4000 },
  { year: "2000 a.C.", level: -1, raw: -2000 },
  { year: "0", level: -0.5, raw: 0 },
  { year: "500", level: -0.3, raw: 500 },
  { year: "1000", level: -0.3, raw: 1000 },
  { year: "1500", level: -0.15, raw: 1500 },
  { year: "1700", level: -0.1, raw: 1700 },
  { year: "1850", level: -0.05, raw: 1850 },
  { year: "1900", level: 0, raw: 1900 },
  { year: "1950", level: 0.06, raw: 1950 },
  { year: "1980", level: 0.1, raw: 1980 },
  { year: "2000", level: 0.18, raw: 2000 },
  { year: "2010", level: 0.23, raw: 2010 },
  { year: "2026", level: 0.30, raw: 2026 },
];

const MARKERS = [
  { name: "Ta' Ħaġrat", lat: 35.9103, lng: 14.3697, img: taHagratImg, cardImg: taHagratCard, date: "4500 AC", desc: "El templo más antiguo de Europa" },
  { name: "Tal-Qadi", lat: 35.9347, lng: 14.3906, img: talQadiImg, cardImg: talQadiCard, date: "~3000 AC", desc: "Piedra lunar con ocho estrellas" },
  { name: "Ġgantija", lat: 36.0478, lng: 14.2689, img: ggantija, cardImg: ggantijaCard, date: "3600 AC — Gozo", desc: "Los megalitos erguidos más altos" },
  { name: "Ħagar Qim", lat: 35.8275, lng: 14.4420, img: hagarQim, cardImg: hagarQimCard, date: "~3000 AC", desc: "Alineación solar en solsticio de verano" },
  { name: "Hal Saflieni", lat: 35.8736, lng: 14.5022, img: halSaflieni, cardImg: halSaflieniCard, date: "4000 AC", desc: "Único hipogeo prehistórico conocido" },
  { name: "Mnajdra", lat: 35.8267, lng: 14.4358, img: mnajdra, cardImg: mnajdraCard, date: "~3000 AC", desc: "Arqueoastronomía: solsticios y equinoccios" },
];

const S = {
  title: "'Cormorant Garamond', serif",
  heading: "'Cormorant Garamond', serif",
  italic: "'Cormorant Garamond', serif",
  body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const CONTAINER: React.CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "0 24px" };

/* ── Info Card ── */
function InfoCard({ title, children, accent }: { title?: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? "#111" : "#0d0d0d",
      border: "1px solid #1a1a1a",
      borderRadius: 3,
      padding: "24px 28px",
      marginBottom: 16,
      borderLeft: accent ? "3px solid #c4993a" : "1px solid #1a1a1a",
    }}>
      {title && (
        <h3 style={{
          fontFamily: S.heading, fontSize: "1.1rem", color: "#ccc", fontWeight: 400,
          margin: "0 0 10px", letterSpacing: "0.02em",
        }}>{title}</h3>
      )}
      <div style={{ fontFamily: S.body, fontSize: 13, lineHeight: 1.8, color: "#888" }}>
        {children}
      </div>
    </div>
  );
}

/* ── Lightbox ── */
function Lightbox({ src, name, date, desc, onClose }: { src: string; name: string; date: string; desc: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "zoom-out", padding: 24,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 960, width: "100%", cursor: "default" }}>
        <img src={src} alt={name} style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", display: "block", borderRadius: 4 }} />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ fontFamily: S.heading, fontSize: "1.4rem", color: "#fff", fontWeight: 300 }}>{name}</div>
          <div style={{ fontFamily: S.body, fontSize: 12, color: "#888", marginTop: 4 }}>{date}</div>
          <div style={{ fontFamily: S.body, fontSize: 13, color: "#aaa", marginTop: 6 }}>{desc}</div>
        </div>
        <button onClick={onClose} style={{
          position: "absolute", top: 24, right: 24,
          background: "none", border: "none", color: "#666", fontSize: 28,
          cursor: "pointer", fontFamily: S.body, lineHeight: 1,
        }}>×</button>
      </div>
    </div>
  );
}

/* ── Temple Cards Grid ── */
function TempleCards() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="malta-temple-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
      }}>
        {MARKERS.map((m, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i)}
            style={{
              background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3,
              overflow: "hidden", cursor: "zoom-in", transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#333")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
          >
            <img src={m.cardImg} alt={m.name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontFamily: S.heading, fontSize: 15, color: "#fff", fontWeight: 400 }}>{m.name}</div>
              <div style={{ fontFamily: S.body, fontSize: 11, color: "#888", marginTop: 3 }}>{m.date}</div>
              <div style={{ fontFamily: S.body, fontSize: 11, color: "#666", marginTop: 4 }}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>
      {lightbox !== null && (
        <Lightbox
          src={MARKERS[lightbox].cardImg}
          name={MARKERS[lightbox].name}
          date={MARKERS[lightbox].date}
          desc={MARKERS[lightbox].desc}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}


function FactBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 2,
      padding: "16px 20px", textAlign: "center", flex: 1, minWidth: 160,
    }}>
      <div style={{ fontFamily: S.heading, fontSize: "1.3rem", color: "#c4993a", fontWeight: 300 }}>{value}</div>
      <div style={{ fontFamily: S.body, fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 6 }}>{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: S.heading, fontSize: "1.6rem", fontWeight: 300,
      textAlign: "center", padding: "56px 0 12px", margin: 0, color: "#fff",
      letterSpacing: "0.03em",
    }}>
      {children}
    </h2>
  );
}

function Pullquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{
      ...CONTAINER, maxWidth: 620, padding: "0 32px",
      margin: "32px auto", borderLeft: "2px solid #333",
      fontFamily: S.italic, fontStyle: "italic",
      fontSize: "1.05rem", lineHeight: 1.7, color: "#777", fontWeight: 300,
    }}>
      {children}
    </blockquote>
  );
}

/* ── Map ── */
function MaltaMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current, { zoomControl: false }).setView([35.95, 14.37], 11);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    const icon = L.divIcon({
      className: "",
      html: '<div style="width:12px;height:12px;border-radius:50%;background:#c4993a;border:1px solid #dab054;"></div>',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    MARKERS.forEach((m) => {
      const popup = L.popup({
        className: "malta-popup",
        closeButton: false,
        maxWidth: 240,
      }).setContent(`
        <div style="background:#111;border:1px solid #222;border-radius:2px;padding:8px;box-shadow:none;">
          <img src="${m.img}" style="width:220px;height:140px;object-fit:cover;border-radius:1px;display:block;margin-bottom:8px;" />
          <div style="font-family:${S.heading};font-size:13px;color:#fff;margin-bottom:2px;">${m.name}</div>
          <div style="font-family:${S.body};font-size:11px;color:#888;margin-bottom:2px;">${m.date}</div>
          <div style="font-family:${S.body};font-size:11px;color:#ccc;">${m.desc}</div>
        </div>
      `);
      L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(popup);
    });

    return () => { map.remove(); };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: 480, borderRadius: 4 }} />;
}

/* ── Elephant comparison slider ── */
function ElephantSlider() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePos(clientX);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [updatePos]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", width: "100%", height: 500, borderRadius: 4,
        overflow: "hidden", cursor: "ew-resize", userSelect: "none",
      }}
      onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; updatePos(e.touches[0].clientX); }}
    >
      <img src={elephantRight} alt="Reconstrucción" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={elephantLeft} alt="Esqueleto fósil" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
      </div>
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)",
        width: 2, background: "rgba(255,255,255,0.8)", zIndex: 10, pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.9)",
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}>
          <span style={{ color: "#fff", fontSize: 12, fontFamily: S.body, letterSpacing: 2 }}>◂▸</span>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 16, left: 16, fontFamily: S.body, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,0.9)", zIndex: 10 }}>
        Paleoxodon falconeri — esqueleto fósil
      </div>
      <div style={{ position: "absolute", bottom: 16, right: 16, fontFamily: S.body, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,0.9)", zIndex: 10 }}>
        Reconstrucción
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function MaltaEssay() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh", fontFamily: S.body, color: "#fff" }}>
      {/* ═══ HEADER ═══ */}
      <header style={{ position: "relative", textAlign: "center", borderBottom: "0.5px solid #1a1a1a", overflow: "hidden" }}>
        <div style={{ position: "relative", width: "100%", height: 320, overflow: "hidden" }}>
          <img src={heroMalta} alt="Templos megalíticos de Malta" style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.7) 60%, #080808 100%)",
          }} />
        </div>
        <div style={{ position: "relative", padding: "0 24px 48px", marginTop: -100 }}>
          <h1 style={{ fontFamily: S.title, fontSize: "3.2rem", letterSpacing: "0.04em", margin: 0, fontWeight: 300, color: "#fff" }}>
            Malta megalítica
          </h1>
          <p style={{ fontFamily: S.italic, fontStyle: "italic", fontSize: "0.85rem", color: "#999", margin: "12px 0 16px", fontWeight: 300 }}>
            La cultura más antigua de Europa
          </p>
          <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "#666", margin: 0 }}>
            Heresy & Beauty · Visual essay
          </p>
        </div>
      </header>

      {/* ═══ INTRO ═══ */}
      <section style={{ ...CONTAINER, padding: "48px 24px 40px" }}>
        <InfoCard>
          <p style={{ margin: 0 }}>Mucho antes de que los fenicios llegaran a la isla de Malta, la isla ya había sido cuna de otras civilizaciones. Contamos con numerosos vestigios de una cultura megalítica todavía muy desconocida, que habitó las islas del archipiélago maltés y construyó templos pétreos sin parangón, los más antiguos de toda la Europa prehistórica.</p>
        </InfoCard>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
          <FactBox label="Antigüedad" value="6000 AC" />
          <FactBox label="Desaparición" value="2500 AC" />
          <FactBox label="Templos conocidos" value="30+" />
          <FactBox label="Anterior a Stonehenge" value="2000 años" />
        </div>
      </section>

      {/* ═══ GEOLOGICAL CONTEXT ═══ */}
      <SectionTitle>Cambios geológicos en el Mediterráneo</SectionTitle>
      <section style={{ ...CONTAINER, padding: "12px 24px 40px" }}>
        <InfoCard title="La gran inundación del Mediterráneo" accent>
          <p style={{ margin: 0 }}>Hace seis millones de años, el Mediterráneo quedó aislado del Atlántico y su nivel descendió más de mil metros. Se convirtió en un desierto con lagos salinos. Un evento geológico posterior abrió el estrecho de Gibraltar y lo llenó de nuevo en menos de dos años, a un ritmo de diez metros al día.</p>
        </InfoCard>

        <InfoCard title="Especies atrapadas">
          <p style={{ margin: 0 }}>Durante el descenso de las aguas, Malta, Sicilia e Italia estaban conectadas, permitiendo la llegada de especies continentales. Tras la inundación, quedaron atrapadas. Lo demuestran restos de elefantes e hipopótamos enanos — <em style={{ color: "#aaa" }}>Paleoxodon mnaidriensis</em> y <em style={{ color: "#aaa" }}>Paleoxodon falconeri</em> — que, sin depredadores, redujeron su tamaño hasta apenas noventa centímetros de alto.</p>
        </InfoCard>

        <Pullquote>
          «El Mediterráneo quedó aislado del Atlántico y su nivel descendió más de mil metros por debajo del actual»
        </Pullquote>
      </section>

      {/* ═══ MEDITERRANEAN SEA LEVEL ═══ */}
      <section style={{ background: "#0a1628", padding: "64px 0", marginTop: 8 }}>
        <div style={{ textAlign: "center", padding: "0 24px", marginBottom: 40 }}>
          <h2 style={{ fontFamily: S.heading, fontSize: "2rem", fontWeight: 300, color: "#fff", margin: "0 0 14px", letterSpacing: "0.03em" }}>
            El Mediterráneo que no vemos
          </h2>
          <p style={{ fontFamily: S.body, fontSize: 14, color: "#6b8ab5", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
            Hace 20.000 años el nivel del mar estaba 120 metros más bajo. Malta era una península unida a Sicilia.
          </p>
        </div>

        <div className="malta-sea-grid" style={{ ...CONTAINER, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Left — Image */}
          <div>
            <img
              src={mediterraneoGlacial}
              alt="Mediterráneo durante el último máximo glacial"
              style={{ width: "100%", borderRadius: 4, border: "1px solid #1a2a44", display: "block" }}
            />
            <p style={{ fontFamily: S.body, fontSize: 10, color: "#4a6a8a", marginTop: 10, lineHeight: 1.6, fontStyle: "italic" }}>
              Recreación del Mediterráneo durante el último máximo glacial. Las zonas ocres eran tierra firme.
            </p>
          </div>

          {/* Right — Chart */}
          <div style={{ background: "#0d1b30", border: "1px solid #1a2a44", borderRadius: 4, padding: "20px 16px 12px" }}>
            <p style={{ fontFamily: S.body, fontSize: 11, color: "#6b8ab5", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16, textAlign: "center" }}>
              Nivel del mar — últimos 22.000 años
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={SEA_LEVEL_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="seaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c4993a" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#c4993a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2a44" />
                <ReferenceArea x1="20000 a.C." x2="7000 a.C." fill="#1a3a5a" fillOpacity={0.3} />
                <ReferenceLine y={0} stroke="#4a6a8a" strokeDasharray="6 4" label={{ value: "nivel actual", fill: "#6b8ab5", fontSize: 10, position: "right" }} />
                <XAxis dataKey="year" tick={{ fill: "#4a6a8a", fontSize: 9 }} axisLine={{ stroke: "#1a2a44" }} tickLine={false} interval={3} />
                <YAxis tick={{ fill: "#4a6a8a", fontSize: 10 }} axisLine={{ stroke: "#1a2a44" }} tickLine={false} unit=" m" domain={[-130, 10]} />
                <Tooltip
                  contentStyle={{ background: "#0d1b30", border: "1px solid #1a2a44", borderRadius: 3, fontFamily: S.body, fontSize: 12 }}
                  labelStyle={{ color: "#6b8ab5" }}
                  itemStyle={{ color: "#c4993a" }}
                  formatter={(value: number) => [`${value} m`, "Nivel"]}
                />
                <Area type="monotone" dataKey="level" stroke="#c4993a" strokeWidth={2} fill="url(#seaFill)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fact cards */}
        <div className="malta-facts-grid" style={{ ...CONTAINER, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 32 }}>
          {[
            { stat: "−120 m", desc: "Nivel en el último máximo glacial (20.000 a.C.)", icon: "▼" },
            { stat: "Malta–Sicilia", desc: "Estaban unidas por tierra firme", icon: "◆" },
            { stat: "+20 cm", desc: "Subida del nivel del mar desde 1900", icon: "▲" },
          ].map((c, i) => (
            <div key={i} style={{
              background: "#0d1b30", border: "1px solid #1a2a44", borderRadius: 3,
              padding: "24px 20px", textAlign: "center",
            }}>
              <div style={{ fontSize: 20, color: "#c4993a", marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontFamily: S.heading, fontSize: "1.3rem", color: "#fff", fontWeight: 300, marginBottom: 8 }}>{c.stat}</div>
              <div style={{ fontFamily: S.body, fontSize: 11, color: "#6b8ab5", lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>


      <SectionTitle>El elefante enano de Malta</SectionTitle>
      <section style={{ ...CONTAINER, paddingBottom: 8 }}>
        <ElephantSlider />
      </section>

      <section style={{ ...CONTAINER, padding: "32px 24px 40px" }}>
        <InfoCard title="Un paisaje muy diferente">
          <p style={{ margin: 0 }}>Si en Malta habitaron estas especies, las condiciones de vida serían mucho mejores: vegetación, animales y agua en abundancia. Hoy encontramos lechos con sedimentos y cantos rodados que confirman la antigua presencia de ríos.</p>
        </InfoCard>

        <InfoCard title="Los primeros pobladores">
          <p style={{ margin: 0 }}>Aquella población, que habitó en cuevas y grutas, comenzó a erigir inmensos templos megalíticos un milenio y medio después. El período constructor duró hasta aproximadamente 2500 a.C., momento en que desaparece todo vestigio humano hasta la llegada de nuevos pobladores en la Edad del Bronce.</p>
        </InfoCard>
      </section>

      {/* ═══ MEGALITHIC CULTURE ═══ */}
      <SectionTitle>La cultura megalítica de Malta</SectionTitle>
      <section style={{ ...CONTAINER, padding: "12px 24px 20px" }}>
        <InfoCard title="Ta' Ħaġrat: el templo más antiguo de Europa" accent>
          <p style={{ margin: 0 }}>Datado en torno a 4500 a.C., es muy anterior a Stonehenge (2500 a.C.). Los megalitos aún en pie más antiguos de Occidente están en Gozo: los de Ġgantija (3600 a.C.), con la característica planta trilobulada y puerta adintelada de los recintos malteses.</p>
        </InfoCard>

        <InfoCard title="Una cultura única">
          <p style={{ margin: 0 }}>Esa estructura tan característica es propia de este archipiélago y no la encontramos en ningún otro vestigio prehistórico. Las piedras — moles de hasta veinte toneladas — fueron transportadas desde la cantera hasta su emplazamiento último por medios aún desconocidos.</p>
        </InfoCard>

        <Pullquote>
          «Estamos ante una cultura lítica única, sin ninguna relación con las hasta ahora conocidas»
        </Pullquote>
      </section>

      {/* ═══ INTERACTIVE MAP ═══ */}
      <SectionTitle>Los templos del archipiélago</SectionTitle>
      <section style={{ ...CONTAINER, paddingBottom: 8 }}>
        <MaltaMap />
        <div style={{ marginTop: 24 }}>
          <TempleCards />
        </div>
      </section>


      <SectionTitle>Los templos de Ħagar Qim y Mnajdra</SectionTitle>
      <section style={{ ...CONTAINER, padding: "12px 24px 20px" }}>
        <InfoCard title="Alineación solar en Mnajdra" accent>
          <p style={{ margin: 0 }}>En el templo sur de Mnajdra, durante los solsticios y equinoccios, existe una sorprendente alineación del corredor de entrada con la incidencia de los rayos del sol al amanecer.</p>
        </InfoCard>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <InfoCard title="Equinoccios">
            <p style={{ margin: 0 }}>En primavera y otoño, el sol al alba se alinea totalmente con el centro del pasillo de entrada al templo.</p>
          </InfoCard>
          <InfoCard title="Solsticios">
            <p style={{ margin: 0 }}>En invierno, los rayos inciden en un panel decorado a la derecha del corredor. En verano, en otro panel a la izquierda.</p>
          </InfoCard>
        </div>

        <InfoCard title="El fenómeno de Ħagar Qim">
          <p style={{ margin: 0 }}>Durante el solsticio de verano, un rayo de luz penetra por un agujero elíptico en la pared de uno de los ábsides. La luz se proyecta como una luna creciente sobre la piedra y, según avanza el día, va bajando y creciendo hasta alcanzar la forma de un disco completo al llegar al suelo.</p>
        </InfoCard>
      </section>

      {/* ═══ SOLAR DIAGRAM ═══ */}
      <SectionTitle>Arqueoastronomía</SectionTitle>
      <section style={{ ...CONTAINER }}>
        <div style={{ background: "#fff", padding: 32, borderRadius: 4 }}>
          <img src={diagrama} alt="Planta del complejo de Mnajdra" style={{ width: "100%", display: "block" }} loading="lazy" />
        </div>
        <p style={{
          fontFamily: S.body, fontSize: 11, color: "#666", textAlign: "center",
          fontStyle: "italic", padding: "16px 0 8px", maxWidth: 700, margin: "0 auto", lineHeight: 1.6,
        }}>
          Planta del complejo de Mnajdra con acimutes de incidencia solar — solsticio de invierno (SR WinSol), equinoccios (SR EQ) y solsticio de verano (SR SumSol)
        </p>
      </section>

      <section style={{ ...CONTAINER, padding: "24px 24px 20px" }}>
        <InfoCard title="Los primeros arquitectos">
          <p style={{ margin: 0 }}>En el Museo Arqueológico Nacional se exhiben pequeñas tallas de edificios hechos a escala. En algunos monumentos se observan dibujos de templos grabados en la roca. Estamos ante una cultura que planificaba sus construcciones.</p>
        </InfoCard>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <InfoCard title="La piedra de Tal-Qadi" accent>
            <p style={{ margin: 0 }}>Una piedra tallada con una luna en cuarto creciente y ocho estrellas, con líneas que las dividen en sectores. Posible carta celeste.</p>
          </InfoCard>
          <InfoCard title="Rueda solar de Ħagar Qim" accent>
            <p style={{ margin: 0 }}>Se ha encontrado lo que parece ser una rueda solar, prueba adicional de sus conocimientos astronómicos.</p>
          </InfoCard>
        </div>

        <Pullquote>
          «No cabe ninguna duda de que este pueblo de constructores observaba y medía el movimiento de los astros»
        </Pullquote>
      </section>

      {/* ═══ MORE ENIGMAS ═══ */}
      <SectionTitle>Más enigmas por resolver</SectionTitle>
      <section style={{ ...CONTAINER, padding: "12px 24px 20px" }}>
        <InfoCard title="Los cart ruts" accent>
          <p style={{ margin: 0 }}>Líneas excavadas en el suelo que recorren toda la isla, distribuidas de dos en dos. Algunas se cruzan entre sí y, a veces, acaban al borde de acantilados o sumergiéndose en el mar. Su origen y propósito siguen siendo un misterio.</p>
        </InfoCard>

        <InfoCard title="El hipogeo de Hal Saflieni" accent>
          <p style={{ margin: 0 }}>El único templo prehistórico subterráneo conocido. Restos de cerámica fechados en 4000 a.C. Se calcula que tardaron mil quinientos años en vaciar la roca. Tiene tres niveles de profundidad, con salas como la del Oráculo y la <em style={{ color: "#aaa" }}>Sancta Sanctorum</em>.</p>
        </InfoCard>
      </section>

      {/* ═══ CONCLUSION ═══ */}
      <SectionTitle>Conclusión</SectionTitle>
      <section style={{ ...CONTAINER, padding: "12px 24px 48px" }}>
        <InfoCard>
          <p style={{ margin: 0 }}>El archipiélago maltés acogió una cultura sin parangón en Occidente durante todo el período prehistórico. Las evidencias arqueológicas muestran su capacidad constructiva, sus conocimientos astronómicos y su manejo de tecnologías que escapan a nuestro entendimiento. Malta es un centro arqueológico de primer orden y, a buen seguro, las futuras investigaciones arrojarán nueva luz sobre esta civilización que desapareció sin dejar rastro hace unos cuatro mil quinientos años.</p>
        </InfoCard>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: "0.5px solid #1a1a1a", textAlign: "center", padding: 24 }}>
        <p style={{ fontSize: 10, color: "#444", margin: 0, fontFamily: S.body }}>
          © Pedro Ortega · Heresy & Beauty
        </p>
      </footer>
    </div>
  );
}
