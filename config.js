/* Radar · Observación — configuración del envío a SharePoint.
   Los cinco datos están puestos (21/11/2026). Ninguno es secreto: identifican la app, no dan acceso.
   Si se vacía clientId, la app sigue funcionando: se observa sin cuenta y se entrega el archivo. */
window.RADAR_CONFIG = {
  clientId: "ea9ca7be-b424-41b7-9753-a2ba7bd6cf1b", // registro «Radar · Observación» en Entra
  tenantId: "39888d6f-ff6f-45f6-8c86-25f964518d79", // Id de directorio (inquilino) de la RFEH
  siteHost: "365rfeh.sharepoint.com", // sitio HOCKEY ESPAÑA AR · DATOS Y SEGUIMIENTO
  sitePath: "/sites/HockeyEspanaAR-Datos",
  listName: "RadarObservacion",       // nombre interno de la lista «Radar · Observación»
  scopes: ["Sites.ReadWrite.All"],    // permiso delegado: cada uno escribe lo que SharePoint le permita
  enviarNombres: true                 // false = solo ID de deportista en la lista
};
