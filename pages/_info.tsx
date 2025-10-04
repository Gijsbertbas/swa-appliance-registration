import React from "react";

type InfoModalProps = {
  open: boolean;
  onClose: () => void;
};

export function InfoModal({ open, onClose }: InfoModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 12,
          padding: "1.25rem 1.25rem 1rem",
          width: "min(640px, 92vw)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h3 id="info-title" style={{ margin: 0 }}>Over deze app</h3>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.25rem",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ color: "#333", lineHeight: 1.5 }}>
          <p>
            De HAT (HuishoudApparatuur Tracker) van <strong>SlimWonen App</strong> helpt je bijhouden welk apparaat je op dit moment gebruikt.
            Met één klik registreer je het gebruik, zodat je eenvoudig inzicht krijgt in recente activiteiten. De lijst met 
            recente acties toont de laatste registraties en laat je items verwijderen als je een foutje hebt gemaakt.
          </p>
          <p>
            Door je acties te loggen, kunnen wij deze straks koppelen aan je energieverbruik om zo <strong>betere modellen</strong> te ontwikkelen.
            Dit is gunstig voor jou en voor alle gebruikers van de app: als we het verbruik beter kunnen interpreteren kunnen
             we ook betere adviezen geven.
          </p>
          <p style={{ marginBottom: 0 }}>
            Voor ons is het belangrijk om te weten wanneer er apparaten worden gebruikt. We registeren het tijdstip waarop je klikt: 
            het liefst is dit zo dicht mogelijk <strong>bij de start of tijdens het gebruik</strong>. Als je vergeet te klikken, is dat geen probleem; op dit
            moment is het nog niet mogelijk om achteraf gebruik toe te voegen.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#78C896",
              cursor: "pointer",
            }}
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}