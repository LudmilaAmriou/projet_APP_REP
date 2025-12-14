import React, { useEffect, useState } from "react";
import { API_ENDPOINTS, fetchData } from "../api/endpoints";

export default function ServiceMetricPanel({ service }) {
  const metrics = Object.keys(API_ENDPOINTS[service] || {});
  const [results, setResults] = useState({});

  useEffect(() => {
    async function loadAll() {
      const serviceEndpoints = API_ENDPOINTS[service];
      let dataObj = {};

      for (const metric of Object.keys(serviceEndpoints)) {
        const countries = Object.keys(serviceEndpoints[metric]);
        dataObj[metric] = {};

        for (const country of countries) {
          const data = await fetchData(service, metric, country);
          dataObj[metric][country] = data;
        }
      }
      setResults(dataObj);
    }

    loadAll();
  }, [service]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>{service}</h2>

      {metrics.map((metric) => (
        <div key={metric} style={styles.metricBox}>
          <h3>Metric {metric}</h3>

          {Object.keys(API_ENDPOINTS[service][metric]).map((country) => {
            const metricData = results[metric]?.[country];
            return (
              <div key={country} style={styles.countryCard}>
                <strong>{country.toUpperCase()} :</strong>

                {metricData ? (
                  <pre style={styles.resultBox}>
                    {JSON.stringify(metricData, null, 2)}
                  </pre>
                ) : (
                  <span style={styles.notAvailable}>
                    ⛔ Données non disponibles
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const styles = {
  metricBox: {
    border: "1px solid #ddd",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "14px",
    background: "#fafafa"
  },
  countryCard: {
    marginTop: "8px",
    padding: "10px",
    background: "#fff",
    borderLeft: "4px solid #6c63ff",
    borderRadius: "6px",
  },
  notAvailable: { color: "red", fontWeight: "bold" },
  resultBox: {
    marginTop: "6px",
    padding: "8px",
    background: "#efefef",
    borderRadius: "6px",
    overflowX: "scroll",
  }
};
