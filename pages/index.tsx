import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { InfoModal } from "../components/info";

const client = generateClient<Schema>();


const APPLIANCES: Record<string, string> = {
  Wasmachine: "Je hebt de wasmachine aangezet of gaat dit nu doen",
  Vaatwasser: "Je hebt de vaatwasser aangezet of gaat dit nu doen",
  Droger: "Je hebt de droger aangezet of gaat dit nu doen",
  Oven: "Je hebt de oven aangezet of gaat dit nu doen",
  Kookplaat: "Je kookt elektrisch en bent nu aan het koken",
  Airco: "Je hebt de airco aangezet of gaat dit nu doen",
  Warmtepomp: "Je hebt een warmtepomp en draait de CV minstens 1 graad op",
  Hybride: "Je hebt een hybride warmtepomp en draait de CV minstens 1 graad op",
  "CV ketel": "Je stookt op gas en draait de CV minstens 1 graad op",
  Stofzuiger: "Je start nu met stofzuigen",
  "Auto laden": "Je bent je elektrische auto aan het laden",
  "Fiets laden": "Je bent je elektrische fiets aan het laden",
};

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
    <main className="app-container">
      <div className="header">
        <h1>HAT | HuishoudApparatuur Tracker</h1>
        <div className="header-actions">
          <button
            onClick={() => setIsInfoOpen(true)}
            aria-label="Informatie"
            title="Informatie"
            className="btn btn-primary btn-icon"
          >
            i
          </button>
          <button
            onClick={signOut}
            className="btn btn-primary"
            style={{ padding: "0.5rem 1rem", whiteSpace: "nowrap" }}
          >
            Uitloggen
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 className="section-title">Selecteer apparaat dat nu gebruikt wordt:</h2>

        <div className="appliances">
          {Object.keys(APPLIANCES).map((appliance) => {
            const active = selectedAppliance === appliance;
            return (
              <button
                key={appliance}
                onClick={() => setSelectedAppliance(appliance)}
                className={`appliance-btn ${active ? "active" : "inactive"}`}
              >
                {appliance}
              </button>
            );
          })}
        </div>

        {selectedAppliance && (
          <div className="confirm">
            {/* <p>
            Selectie: <strong>{selectedAppliance}</strong>
          </p> */}
            <div className="confirm-info" aria-live="polite">
              {APPLIANCES[selectedAppliance] ?? "Geen extra informatie beschikbaar."}
            </div>
            <button onClick={handleSubmit} className="btn-confirm">
              Bevestig
            </button>
          </div>
        )}
      </div>

      <div className="recent-actions">
        <h2 className="section-title">Recente acties:</h2>
        <ul>
          {usageLogs
            .slice(-10)
            .reverse()
            .map((log) => (
              <li
                key={log.id}
                onClick={() => confirmAndDelete(log.id)}
                title="Klik om te verwijderen"
              >
                {log.appliance} - {new Date(log.createdAt).toLocaleString()}
              </li>
            ))}
        </ul>
      </div>

      <InfoModal open={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </main>
  );
}