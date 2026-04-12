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

const MARKERS = [
  { name: "Ta' Ħaġrat", lat: 35.9103, lng: 14.3697, img: taHagratImg, date: "4500 AC", desc: "El templo más antiguo de Europa" },
  { name: "Tal-Qadi", lat: 35.9347, lng: 14.3906, img: talQadiImg, date: "~3000 AC", desc: "Piedra lunar con ocho estrellas" },
  { name: "Ġgantija", lat: 36.0478, lng: 14.2689, img: ggantija, date: "3600 AC — Gozo", desc: "Los megalitos erguidos más altos" },
  { name: "Ħagar Qim", lat: 35.8275, lng: 14.4420, img: hagarQim, date: "~3000 AC", desc: "Alineación solar en solsticio de verano" },
  { name: "Hal Saflieni", lat: 35.8736, lng: 14.5022, img: halSaflieni, date: "4000 AC", desc: "Único hipogeo prehistórico conocido" },
  { name: "Mnajdra", lat: 35.8267, lng: 14.4358, img: mnajdra, date: "~3000 AC", desc: "Arqueoastronomía: solsticios y equinoccios" },
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
      borderLeft: accent ? "3px solid #cc2222" : "1px solid #1a1a1a",
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

/* ── Fact Box ── */
function FactBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 2,
      padding: "16px 20px", textAlign: "center", flex: 1, minWidth: 160,
    }}>
      <div style={{ fontFamily: S.heading, fontSize: "1.3rem", color: "#cc2222", fontWeight: 300 }}>{value}</div>
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
      html: '<div style="width:12px;height:12px;border-radius:50%;background:#cc2222;border:1px solid #ff4444;"></div>',
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
      <header style={{ textAlign: "center", padding: "80px 24px 48px", borderBottom: "0.5px solid #1a1a1a" }}>
        <h1 style={{ fontFamily: S.title, fontSize: "3.2rem", letterSpacing: "0.04em", margin: 0, fontWeight: 300, color: "#fff" }}>
          Malta megalítica
        </h1>
        <p style={{ fontFamily: S.italic, fontStyle: "italic", fontSize: "0.85rem", color: "#444", margin: "12px 0 16px", fontWeight: 300 }}>
          La cultura más antigua de Europa
        </p>
        <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "#666", margin: 0 }}>
          Heresy & Beauty · Visual essay
        </p>
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

      {/* ═══ ELEPHANT SLIDER ═══ */}
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
      </section>

      {/* ═══ HAGAR QIM & MNAJDRA ═══ */}
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
