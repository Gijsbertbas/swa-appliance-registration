import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { InfoModal } from "./_info";

const client = generateClient<Schema>();

const APPLIANCES = [
  "Wasmachine",
  "Afwasmachine",
  "Droger",
  "Oven",
  "Kookplaat",
  "Airco",
  "Verwarming",
  "Stofzuiger",
  "Auto laden",
];

export default function App() {

  const { signOut } = useAuthenticator();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [usageLogs, setUsageLogs] = useState<Array<Schema["ApplianceUsage"]["type"]>>([]);
  const [selectedAppliance, setSelectedAppliance] = useState<string | null>(null);

  function listUsageLogs() {
    client.models.ApplianceUsage.observeQuery().subscribe({
      next: (data) => setUsageLogs([...data.items]),
    });
  }

  function confirmAndDelete(id: string) {
    const ok = window.confirm("Weet je zeker dat je deze regel wilt verwijderen?");
    if (!ok) return;
    client.models.ApplianceUsage.delete({ id })
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Verwijderen is mislukt.");
      });
  }

  function deleteRecord(id: string) {
    client.models.ApplianceUsage.delete({ id })
  }

  useEffect(() => {
    listUsageLogs();
  }, []);

  function handleSubmit() {
    if (selectedAppliance) {
      client.models.ApplianceUsage.create({
        appliance: selectedAppliance,
      });
      setSelectedAppliance(null); // Reset for next entry
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          gap: "1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>HAT | HuishoudApparatuur Tracker</h1>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            onClick={() => setIsInfoOpen(true)}
            aria-label="Informatie"
            title="Informatie"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "#78C896",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#5082A0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#78C896")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            i
          </button>    <button
            onClick={signOut}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#78C896",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#5082A0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#78C896")}
          >
            Uitloggen
          </button>
        </div>
      </div>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Selecteer apparaat dat nu gebruikt wordt:</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
          {APPLIANCES.map((appliance) => (
            <button
              key={appliance}
              onClick={() => setSelectedAppliance(appliance)}
              style={{
                padding: "1rem",
                backgroundColor: selectedAppliance === appliance ? "#0070f3" : "#f0f0f0",
                color: selectedAppliance === appliance ? "white" : "black",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: selectedAppliance === appliance ? "bold" : "normal"
              }}
            >
              {appliance}
            </button>
          ))}
        </div>

        {selectedAppliance && (
          <div style={{ marginTop: "1rem" }}>
            <p>Selectie: <strong>{selectedAppliance}</strong></p>
            <button
              onClick={handleSubmit}
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold"
              }}
            >
              Bevestig
            </button>
          </div>
        )}
      </div>

      <div>
        <h2>Recente acties:</h2>
        <ul>
          {usageLogs.slice(-10).reverse().map((log) => (
            <li key={log.id} onClick={() => confirmAndDelete(log.id)} style={{ cursor: "pointer" }} title="Klik om te verwijderen">
              {log.appliance} - {new Date(log.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
      <InfoModal open={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </main>
  );
}