import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const CLIENT_ID = "1b382818813e459facd9758f6efbe0d3";
const CLIENT_SECRET = "f57ae1758b3b49e19be3f87d9ed5820a";

async function getToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
    },
    body: "grant_type=client_credentials"
  });

  const data = await res.json();
  return data.access_token;
}

app.get("/", (req, res) => {
  res.send("Spotify proxy is running");
});

app.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ error: "missing q" });

    const token = await getToken();

    const sp = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await sp.json();
    res.json(data);

  } catch (err) {
    res.json({ error: err.toString() });
  }
});

// 🔥 OBLIGATOIRE POUR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Spotify proxy running on port " + PORT));
