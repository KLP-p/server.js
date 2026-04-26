import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const CLIENT_ID = "65f2d3d0b4be4ae0aa622e65c09f1d6b";
const CLIENT_SECRET = "8a32374844494397b255d5448b4dd1a3";

async function getToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

app.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ error: "missing q" });

    const token = await getToken();

    const sp = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await sp.json();
    res.json(data);
  } catch (err) {
    res.json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log("Spotify proxy running"));
