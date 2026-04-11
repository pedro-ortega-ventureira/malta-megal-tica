import { useEffect, useRef, useState } from "react";
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

const fontAlmendra = "'Almendra Display', serif";
const fontAlmendraItalic = "'Almendra', serif";
const fontHelvetica = "'Helvetica Neue', Helvetica, Arial, sans-serif";

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
      html: `<div style="width:12px;height:12px;border-radius:50%;background:#cc2222;border:1px solid #ff4444;"></div>`,
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
          <div style="font-family:${fontAlmendra};font-size:13px;color:#fff;margin-bottom:2px;">${m.name}</div>
          <div style="font-family:${fontHelvetica};font-size:11px;color:#888;margin-bottom:2px;">${m.date}</div>
          <div style="font-family:${fontHelvetica};font-size:11px;color:#ccc;">${m.desc}</div>
        </div>
      `);
      L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(popup);
    });

    return () => { map.remove(); };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: 480 }} />;
}

function ElephantSlider() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePos(clientX);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: 500, overflow: "hidden", cursor: "ew-resize", userSelect: "none" }}
      onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; updatePos(e.touches[0].clientX); }}
    >
      <img src={elephantRight} alt="Reconstrucción" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, width: `${pos}%`, overflow: "hidden" }}>
        <img src={elephantLeft} alt="Esqueleto fósil" style={{ position: "absolute", inset: 0, width: `${100 / (pos / 100)}%`, height: "100%", objectFit: "cover" }} />
      </div>
      {/* Handle */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: 2, background: "#fff", zIndex: 10 }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 32, height: 32, borderRadius: "50%", border: "2px solid #fff", background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "#fff", fontSize: 14, fontFamily: fontHelvetica }}>⇔</span>
        </div>
      </div>
      {/* Labels */}
      <div style={{
        position: "absolute", bottom: 16, left: 16, fontFamily: fontHelvetica,
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#fff",
        textShadow: "0 1px 4px rgba(0,0,0,0.8)", zIndex: 10,
      }}>
        Paleoxodon falconeri — esqueleto fósil
      </div>
      <div style={{
        position: "absolute", bottom: 16, right: 16, fontFamily: fontHelvetica,
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#fff",
        textShadow: "0 1px 4px rgba(0,0,0,0.8)", zIndex: 10,
      }}>
        Reconstrucción
      </div>
    </div>
  );
}

export default function MaltaEssay() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh", fontFamily: fontHelvetica, color: "#fff" }}>
      {/* HEADER */}
      <header style={{ textAlign: "center", padding: "80px 24px 48px", borderBottom: "0.5px solid #1a1a1a" }}>
        <h1 style={{ fontFamily: fontAlmendra, fontSize: "3.2rem", letterSpacing: "0.04em", margin: 0, fontWeight: 400 }}>
          Malta megalítica
        </h1>
        <p style={{ fontFamily: fontAlmendraItalic, fontStyle: "italic", fontSize: "0.85rem", color: "#444", margin: "12px 0 16px" }}>
          La cultura más antigua de Europa
        </p>
        <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "#666", margin: 0 }}>
          Heresy & Beauty · Visual essay
        </p>
      </header>

      {/* MAP */}
      <section>
        <MaltaMap />
      </section>

      {/* ELEPHANT SLIDER */}
      <section>
        <h2 style={{ fontFamily: fontAlmendra, fontSize: "1.6rem", textAlign: "center", padding: "32px 0 20px", fontWeight: 400, margin: 0 }}>
          El elefante enano de Malta
        </h2>
        <ElephantSlider />
      </section>

      {/* SOLAR DIAGRAM */}
      <section>
        <h2 style={{ fontFamily: fontAlmendra, fontSize: "1.6rem", textAlign: "center", padding: "40px 0 20px", fontWeight: 400, margin: 0 }}>
          Arqueoastronomía
        </h2>
        <div style={{ background: "#fff", padding: 32, maxWidth: 900, margin: "0 auto" }}>
          <img src={diagrama} alt="Planta del complejo de Mnajdra" style={{ width: "100%", display: "block" }} loading="lazy" />
        </div>
        <p style={{
          fontFamily: fontHelvetica, fontSize: 11, color: "#666", textAlign: "center",
          fontStyle: "italic", padding: "16px 24px 40px", maxWidth: 700, margin: "0 auto", lineHeight: 1.6,
        }}>
          Planta del complejo de Mnajdra con acimutes de incidencia solar — solsticio de invierno (SR WinSol), equinoccios (SR EQ) y solsticio de verano (SR SumSol)
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "0.5px solid #1a1a1a", textAlign: "center", padding: 24 }}>
        <p style={{ fontSize: 10, color: "#444", margin: 0, fontFamily: fontHelvetica }}>
          © Pedro Ortega · Heresy & Beauty
        </p>
      </footer>
    </div>
  );
}
