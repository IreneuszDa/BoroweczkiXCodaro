require("dotenv").config({path: ".env.local"});
const { ConvexHttpClient } = require("convex/browser");
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
async function seedMissingData() {
  const units = await client.query("rescueUnits:list");
  const now = Date.now();
  if (units.length >= 2) {
      await client.mutation("communications:add", {
          unitId: units[0]._id,
          unitName: "Sokół-1",
          message: "Mamy kontakt wzrokowy z lawiniskiem. Rozpoczynamy desant ratowników i psa. Paliwo 45%.",
          channel: "CH_1_EMERGENCY",
          timestamp: now - 2 * 60000,
      });
      await client.mutation("communications:add", {
          unitId: units[1]._id,
          unitName: "Patrol Pieszo-Pies",
          message: "Widoczność bliska zero, opóźnienie w marszu. Sprzęt trauma zabezpieczony.",
          channel: "CH_1_EMERGENCY",
          timestamp: now - 12 * 60000,
      });
  }
  await client.mutation("communications:add", {
      unitName: "Centrala (TOPR)",
      message: "Uwaga wszystkie jednostki, prognozowany gwałtowny wzrost siły wiatru w ciągu godziny. Oszczędzać sprzęt tlenowy.",
      channel: "CH_2_LOGISTICS",
      timestamp: now - 25 * 60000,
  });
  console.log("Seeded comms log via Node hack!");
}
seedMissingData().catch(console.error);
