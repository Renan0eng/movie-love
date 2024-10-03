"use client";

import { useEffect } from "react";

export default function Services() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .then(async (registration: ServiceWorkerRegistration) => {

          if (!registration.active) return;

          if (window.Notification.permission === "denied" || window.Notification.permission === "default") {
            const permission = await window.Notification.requestPermission();
            if (permission !== "granted") {
              return;
            }
          }

          registration.active.postMessage("activate");
        })
        .catch((error) => {
          console.error("Erro ao registrar o Service Worker:", error);
        });
    }
  }, []);

  return <></>;
}
