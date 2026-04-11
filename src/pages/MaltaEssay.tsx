import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

/* ── Narrative text component ── */
function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      maxWidth: 680, margin: "0 auto", padding: "0 24px",
      fontFamily: S.body, fontSize: 14, lineHeight: 1.85, color: "#aaa",
      letterSpacing: "0.01em",
    }}>
      {children}
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
      maxWidth: 560, margin: "40px auto", padding: "0 32px",
      borderLeft: "2px solid #333", fontFamily: S.italic, fontStyle: "italic",
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

  return <div ref={mapRef} style={{ width: "100%", height: 480 }} />;
}

/* ── Elephant comparison slider (fixed) ── */
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
        position: "relative", width: "100%", height: 500,
        overflow: "hidden", cursor: "ew-resize", userSelect: "none",
      }}
      onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; updatePos(e.touches[0].clientX); }}
    >
      {/* Right image (full background) */}
      <img
        src={elephantRight}
        alt="Reconstrucción"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        draggable={false}
      />
      {/* Left image (clipped) */}
      <div style={{
        position: "absolute", inset: 0,
        clipPath: `inset(0 ${100 - pos}% 0 0)`,
      }}>
        <img
          src={elephantLeft}
          alt="Esqueleto fósil"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          draggable={false}
        />
      </div>
      {/* Handle line */}
      <div style={{
        position: "absolute", top: 0, bottom: 0,
        left: `${pos}%`, transform: "translateX(-50%)",
        width: 2, background: "rgba(255,255,255,0.8)", zIndex: 10,
        pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 32, height: 32, borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.9)",
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}>
          <span style={{ color: "#fff", fontSize: 12, fontFamily: S.body, letterSpacing: 2 }}>◂▸</span>
        </div>
      </div>
      {/* Labels */}
      <div style={{
        position: "absolute", bottom: 16, left: 16, fontFamily: S.body,
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#fff",
        textShadow: "0 1px 6px rgba(0,0,0,0.9)", zIndex: 10,
      }}>
        Paleoxodon falconeri — esqueleto fósil
      </div>
      <div style={{
        position: "absolute", bottom: 16, right: 16, fontFamily: S.body,
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#fff",
        textShadow: "0 1px 6px rgba(0,0,0,0.9)", zIndex: 10,
      }}>
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
        <h1 style={{
          fontFamily: S.title, fontSize: "3.2rem", letterSpacing: "0.04em",
          margin: 0, fontWeight: 300, color: "#fff",
        }}>
          Malta megalítica
        </h1>
        <p style={{
          fontFamily: S.italic, fontStyle: "italic", fontSize: "0.85rem",
          color: "#444", margin: "12px 0 16px", fontWeight: 300,
        }}>
          La cultura más antigua de Europa
        </p>
        <p style={{
          fontSize: "0.6rem", textTransform: "uppercase",
          letterSpacing: "0.3em", color: "#666", margin: 0,
        }}>
          Heresy & Beauty · Visual essay
        </p>
      </header>

      {/* ═══ INTRO NARRATIVE ═══ */}
      <section style={{ padding: "48px 0 40px" }}>
        <Prose>
          <p>
            Mucho antes de que los fenicios llegaran a la isla de Malta, la isla ya había sido cuna de otras civilizaciones. Contamos con numerosos vestigios de una cultura megalítica todavía muy desconocida, que habitó las islas del archipiélago maltés y construyó templos pétreos sin parangón, los más antiguos de toda la Europa prehistórica.
          </p>
          <p style={{ marginTop: 20 }}>
            Si visitamos Malta recién entrado el otoño, nos encontraremos con un paisaje árido, repleto de colores ocres, tanto por su tierra como por sus construcciones de piedra caliza. A la vista de este escenario, hay que preguntarse por qué hallamos allí, a lo largo y ancho del archipiélago, tal cantidad de monumentos megalíticos y vestigios arqueológicos tan singulares.
          </p>
        </Prose>
      </section>

      {/* ═══ GEOLOGICAL CONTEXT ═══ */}
      <SectionTitle>Cambios geológicos en el Mediterráneo</SectionTitle>
      <section style={{ padding: "12px 0 40px" }}>
        <Prose>
          <p>
            Para empezar a establecer hipótesis, hay que volver la mirada muy atrás en el tiempo y retroceder seis millones de años. En esa época, el Mediterráneo quedó aislado del océano Atlántico y el nivel del agua descendió más de mil metros por debajo del actual. Este mar se convirtió en un gran desierto con lagos salinos en su interior. Un evento geológico posterior abrió un gran hueco en el estrecho de Gibraltar y provocó que el Mediterráneo se llenara de nuevo en menos de dos años, a un ritmo de diez metros al día.
          </p>
        </Prose>
        <Pullquote>
          «En esa época, el Mediterráneo quedó aislado del océano Atlántico y el nivel del agua descendió más de mil metros por debajo del actual»
        </Pullquote>
        <Prose>
          <p>
            Cabe suponer que, durante el descenso de las aguas, Malta, Sicilia y la península itálica estaban conectadas entre sí, lo cual permitía la llegada de especies provenientes del continente al archipiélago maltés. Tras la repentina inundación de la cuenca mediterránea, estas quedarían atrapadas allí. Así parecen demostrarlo restos paleontológicos, como los de elefantes e hipopótamos enanos — <em>Paleoxodon mnaidriensis</em> y <em>Paleoxodon falconeri</em> — unas especies procedentes de Asia que, al quedar atrapadas en un espacio reducido y carecer de depredadores, habrían reducido su tamaño considerablemente, llegando a alcanzar tan solo noventa centímetros de alto.
          </p>
        </Prose>
      </section>

      {/* ═══ ELEPHANT SLIDER ═══ */}
      <SectionTitle>El elefante enano de Malta</SectionTitle>
      <div style={{ paddingBottom: 8 }} />
      <ElephantSlider />

      <section style={{ padding: "40px 0" }}>
        <Prose>
          <p>
            Si en la isla de Malta habitaron este tipo de especies, es porque las condiciones de vida serían mucho mejores que las actuales: habría vegetación, animales y, lo que es más importante, agua en abundancia. En el territorio actual encontramos lechos con sedimentos y cantos rodados, que nos confirman la anterior presencia de ríos. Un panorama muy diferente al de hoy en día.
          </p>
          <p style={{ marginTop: 20 }}>
            Si esa situación se mantuvo en el tiempo, haría lógica la hipótesis de que el archipiélago maltés resultase atractivo para la vida humana. Aquella población, de la que se sabe que habitó en cuevas y grutas, comenzaría a erigir inmensos templos megalíticos un milenio y medio después, durante un período que duraría aproximadamente hasta 2500 a.C. En ese momento, desaparece todo vestigio humano hasta la llegada de nuevos pobladores en la Edad del Bronce.
          </p>
        </Prose>
      </section>

      {/* ═══ MEGALITHIC CULTURE ═══ */}
      <SectionTitle>La cultura megalítica de Malta</SectionTitle>
      <section style={{ padding: "12px 0 20px" }}>
        <Prose>
          <p>
            El primer templo megalítico conocido en Malta es Ta' Ħaġrat, que se ha datado en torno a 4500 a.C., lo cual lo convierte en el más antiguo de Europa, muy anterior a Stonehenge (2500 a.C.). Los megalitos aún en pie más antiguos de Occidente se hallan en la segunda isla del archipiélago, Gozo, y son los de Ġgantija, en la localidad de Xaghra. Datan de 3600 a.C. y presentan ya la forma característica de los recintos malteses: se disponen en planta trilobulada, con una puerta adintelada que da acceso al conjunto.
          </p>
        </Prose>
        <Pullquote>
          «Estamos hablando, por tanto, de una cultura lítica única, sin ninguna relación con las hasta ahora conocidas»
        </Pullquote>
        <Prose>
          <p>
            Esa estructura tan característica es propia de este archipiélago y no la encontramos en ningún otro vestigio prehistórico. Al igual que en otros monumentos de este tipo, nos encontramos con la pregunta de cómo transportaron aquellos hombres las piedras — moles que llegan hasta las veinte toneladas de peso — desde la cantera hasta su emplazamiento último.
          </p>
        </Prose>
      </section>

      {/* ═══ INTERACTIVE MAP ═══ */}
      <SectionTitle>Los templos del archipiélago</SectionTitle>
      <div style={{ paddingBottom: 8 }} />
      <MaltaMap />

      {/* ═══ HAGAR QIM & MNAJDRA ═══ */}
      <SectionTitle>Los templos de Ħagar Qim y Mnajdra</SectionTitle>
      <section style={{ padding: "12px 0 20px" }}>
        <Prose>
          <p>
            Quizá los templos más enigmáticos de Malta sean los de Ħagar Qim y Mnajdra. Allí encontramos el enigma de su posible orientación en función del sol, de acuerdo con solsticios y equinoccios. La primera evidencia del conocimiento astronómico la tenemos en el templo sur de Mnajdra, donde, en los solsticios y equinoccios, hallamos una sorprendente alineación del corredor de entrada con la incidencia de los rayos del sol al amanecer.
          </p>
          <p style={{ marginTop: 20 }}>
            En los equinoccios de primavera y otoño, el sol se ve al alba totalmente alineado con el centro del pasillo de entrada al templo. En el solsticio de invierno, los rayos de sol inciden justamente en un panel decorado a la derecha del corredor de entrada, mientras que en el solsticio de verano inciden en otro panel similar colocado a la izquierda.
          </p>
          <p style={{ marginTop: 20 }}>
            En el templo de Ħagar Qim, durante el solsticio de verano, un rayo de luz penetra por un agujero elíptico en la pared de uno de los ábsides. La luz se proyecta como una luna creciente sobre la piedra y, según avanza el día, la figura va bajando por la pared y su tamaño va creciendo hasta alcanzar la forma de un disco completo al llegar al suelo.
          </p>
        </Prose>
      </section>

      {/* ═══ SOLAR DIAGRAM ═══ */}
      <SectionTitle>Arqueoastronomía</SectionTitle>
      <div style={{ background: "#fff", padding: 32, maxWidth: 900, margin: "0 auto" }}>
        <img src={diagrama} alt="Planta del complejo de Mnajdra" style={{ width: "100%", display: "block" }} loading="lazy" />
      </div>
      <p style={{
        fontFamily: S.body, fontSize: 11, color: "#666", textAlign: "center",
        fontStyle: "italic", padding: "16px 24px 8px", maxWidth: 700, margin: "0 auto", lineHeight: 1.6,
      }}>
        Planta del complejo de Mnajdra con acimutes de incidencia solar — solsticio de invierno (SR WinSol), equinoccios (SR EQ) y solsticio de verano (SR SumSol)
      </p>

      <section style={{ padding: "32px 0 20px" }}>
        <Prose>
          <p>
            ¿Cómo lograron esa precisión en sus edificaciones? En el Museo Arqueológico Nacional encontramos pequeñas tallas de edificios hechos a escala; también se pueden observar en algunos monumentos dibujos de templos grabados en la roca. Estamos, pues, ante una cultura que planificaba sus construcciones. ¿Podría tratarse de los primeros arquitectos de la historia?
          </p>
          <p style={{ marginTop: 20 }}>
            Uno de los restos hallados en el templo de Tal-Qadi es una piedra tallada con una luna en cuarto creciente y ocho estrellas, entre las cuales se trazan diversas líneas que las dividen en sectores. Además, en Ħagar Qim se ha encontrado lo que parece ser una rueda solar.
          </p>
        </Prose>
        <Pullquote>
          «No cabe, pues, ninguna duda de que este pueblo de constructores observaba y medía el movimiento de los astros»
        </Pullquote>
      </section>

      {/* ═══ MORE ENIGMAS ═══ */}
      <SectionTitle>Más enigmas por resolver</SectionTitle>
      <section style={{ padding: "12px 0 20px" }}>
        <Prose>
          <p>
            Las incógnitas en torno a esta cultura que habitó Malta entre 6000 y 2500 a.C. no acaban aquí. Uno de los vestigios arqueológicos más intrigantes del planeta son los <em>cart ruts</em>: una serie de líneas excavadas en el suelo que recorren toda la isla como hileras distribuidas de dos en dos. Algunas de ellas se cruzan entre sí y, a veces, acaban al borde de acantilados o sumergiéndose en el mar.
          </p>
          <p style={{ marginTop: 20 }}>
            Otro de los hitos arqueológicos de la isla es el hipogeo de Hal Saflieni: el único templo prehistórico subterráneo conocido. Se han encontrado restos de cerámica fechados en 4000 a.C. Se calcula que se debió tardar en vaciar la roca unos mil quinientos años. Tiene tres niveles de profundidad. En el segundo encontramos diversas salas como la llamada del Oráculo y la <em>Sancta Sanctorum</em>.
          </p>
        </Prose>
      </section>

      {/* ═══ CONCLUSION ═══ */}
      <SectionTitle>Conclusión</SectionTitle>
      <section style={{ padding: "12px 0 48px" }}>
        <Prose>
          <p>
            El archipiélago maltés acogió una cultura sin parangón en Occidente en todo el período prehistórico. Las evidencias arqueológicas nos muestran su capacidad constructiva, sus conocimientos astronómicos y su manejo de tecnologías que escapan a nuestro entendimiento. Malta es, sin lugar a dudas, un centro arqueológico de primer orden y, a buen seguro, las futuras investigaciones arrojarán nueva luz sobre esta civilización megalítica tan avanzada. De momento, quedan numerosas incógnitas por resolver, tanto por su capacidad tecnológica como por su desaparición, sin dejar rastro, hace unos cuatro mil quinientos años.
          </p>
        </Prose>
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
