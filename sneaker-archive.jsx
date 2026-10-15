import { useState, useEffect, useRef, useMemo } from "react";

// ─── Anthropic API headers ─────────────────────────────────────────────
const API_HEADERS = {
  "Content-Type": "application/json",
};

// ─── Brands ────────────────────────────────────────────────────────────
const BRANDS = [
  { id:"adidas",      name:"Adidas",      color:"#E8FF47", founded:"1949", country:"Germany" },
  { id:"nike",        name:"Nike",        color:"#E8FF47", founded:"1964", country:"USA"     },
  { id:"new-balance", name:"New Balance", color:"#E8FF47", founded:"1906", country:"USA"     },
  { id:"asics",       name:"ASICS",       color:"#E8FF47", founded:"1949", country:"Japan"   },
];

// ─── Hero images ───────────────────────────────────────────────────────
const HERO_IMGS = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=80",
  "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1400&q=80",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1400&q=80",
];

// ─── Sneaker image map — Unsplash photo IDs for each model ────────────
// Each ID is a real Unsplash photo of that type of sneaker
const SNEAKER_IMAGES = {
  "Adidas Samba OG":              "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80",
  "Adidas Samba Rose":            "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
  "Adidas Stan Smith":            "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
  "Adidas Gazelle":               "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "Adidas Gazelle Indoor":        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "Adidas Superstar":             "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "Adidas Campus 00s":            "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
  "Adidas Campus 80s":            "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
  "Adidas Ultraboost 22":         "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "Adidas Ultraboost 23":         "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "Adidas Ultraboost Light":      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "Adidas NMD R1":                "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
  "Adidas NMD_S1":                "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
  "Adidas Yeezy Boost 350 V2":    "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
  "Adidas Yeezy Boost 700":       "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
  "Adidas Yeezy Boost 700 V2":    "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
  "Adidas Yeezy Slide":           "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  "Adidas Yeezy 500":             "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
  "Adidas Forum Low":             "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&q=80",
  "Adidas Forum High":            "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&q=80",
  "Adidas Handball Spezial":      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
  "Adidas Spezial":               "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
  "Adidas SL 72":                 "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
  "Adidas Ozweego":               "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
  "Adidas ZX 8000":               "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "Air Jordan 1 Retro High OG":   "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
  "Air Jordan 1 Low":             "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "Air Jordan 1 Mid":             "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "Air Jordan 3 Retro":           "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "Air Jordan 4 Retro":           "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "Air Jordan 5 Retro":           "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
  "Air Jordan 6 Retro":           "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
  "Air Jordan 11 Retro":          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "Air Jordan 12 Retro":          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "Nike Air Force 1 '07":         "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&q=80",
  "Nike Air Force 1 Low Utility": "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&q=80",
  "Nike Dunk Low":                "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  "Nike Dunk High":               "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  "Nike Air Max 1":               "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "Nike Air Max 90":              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "Nike Air Max 95":              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "Nike Air Max 97":              "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
  "Nike Air Max 270":             "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
  "Nike Air Max Plus":            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "Nike Air Vapormax Plus":       "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "Nike Pegasus 40":              "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "Nike Pegasus 41":              "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "Nike Zoom Fly 5":              "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "Nike Invincible 3":            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "Nike Blazer Mid '77":          "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
  "Nike Blazer Low '77":          "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
  "Nike SB Dunk Low Pro":         "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  "Nike SB Dunk High Pro":        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  "Nike Air Huarache":            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "Nike Cortez":                  "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80",
  "Nike Air Presto":              "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "New Balance 550":              "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
  "New Balance 990v6":            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "New Balance 990v5":            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "New Balance 991":              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "New Balance 992":              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "New Balance 993":              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "New Balance 2002R":            "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
  "New Balance 327":              "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "New Balance 574":              "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80",
  "New Balance 530":              "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
  "New Balance 9060":             "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
  "New Balance 1906R":            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "ASICS Gel-Kayano 14":          "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
  "ASICS GT-2160":                "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&q=80",
  "ASICS Gel-1130":               "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "ASICS Gel-NYC":                "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
  "ASICS Gel-Nimbus 25":          "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
  "ASICS Gel-Lyte III":           "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  "ASICS Gel-Lyte V":             "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  "ASICS Gel-Kayano 25":          "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
  "ASICS Gel-Nimbus 9":           "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
};

// Fallback pool per brand — consistent hash so same sneaker always gets same image
const FALLBACK_POOL = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&q=80",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
  "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
  "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
  "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80",
  "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80",
];

function getFallback(name) {
  const hash = (name||"").split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  return FALLBACK_POOL[hash % FALLBACK_POOL.length];
}

function getSneakerImage(name) {
  if (!name) return FALLBACK_POOL[0];
  // Exact match
  if (SNEAKER_IMAGES[name]) return SNEAKER_IMAGES[name];
  // Partial: check if any key is contained in the name
  for (const key of Object.keys(SNEAKER_IMAGES)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return SNEAKER_IMAGES[key];
  }
  return getFallback(name);
}

function SneakerImg({ name, brand, style }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? null : getSneakerImage(name);
  const initials = { nike:"NK", adidas:"AD", "new-balance":"NB", asics:"AS" };

  if (!src) {
    return (
      <div style={{ ...style, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#1a1a1a,#111)", color:"rgba(255,255,255,0.15)", fontFamily:"'Bebas Neue',sans-serif" }}>
        <div style={{ fontSize:"clamp(20px,4vw,32px)", letterSpacing:"3px" }}>{initials[brand]||"SA"}</div>
        <div style={{ fontSize:"8px", marginTop:"4px", letterSpacing:"1px", textAlign:"center", padding:"0 8px", opacity:0.7 }}>{(name||"").split(" ").slice(0,4).join(" ")}</div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      style={{ ...style, objectFit:"cover" }}
      onError={() => setFailed(true)}
    />
  );
}

// ─── Full sneaker database (200+ entries) ─────────────────────────────
const DB = [
  // ADIDAS
  {id:1,  brand:"adidas", name:"Adidas Samba OG",             colorway:"Black/White",        category:"Indoor Soccer", year:"1950", price:"€100"},
  {id:2,  brand:"adidas", name:"Adidas Samba OG",             colorway:"White/Gum",          category:"Indoor Soccer", year:"1950", price:"€100"},
  {id:3,  brand:"adidas", name:"Adidas Samba OG",             colorway:"Navy/White",         category:"Indoor Soccer", year:"1950", price:"€100"},
  {id:4,  brand:"adidas", name:"Adidas Samba Rose",           colorway:"Core Black",         category:"Lifestyle",     year:"2018", price:"€100"},
  {id:5,  brand:"adidas", name:"Adidas Gazelle",              colorway:"Collegiate Green",   category:"Lifestyle",     year:"1968", price:"€100"},
  {id:6,  brand:"adidas", name:"Adidas Gazelle",              colorway:"Bold Pink",          category:"Lifestyle",     year:"1968", price:"€100"},
  {id:7,  brand:"adidas", name:"Adidas Gazelle",              colorway:"Collegiate Navy",    category:"Lifestyle",     year:"1968", price:"€100"},
  {id:8,  brand:"adidas", name:"Adidas Gazelle Indoor",       colorway:"Dark Green",         category:"Lifestyle",     year:"1994", price:"€110"},
  {id:9,  brand:"adidas", name:"Adidas Superstar",            colorway:"White/Black",        category:"Lifestyle",     year:"1970", price:"€90" },
  {id:10, brand:"adidas", name:"Adidas Superstar",            colorway:"All White",          category:"Lifestyle",     year:"1970", price:"€90" },
  {id:11, brand:"adidas", name:"Adidas Stan Smith",           colorway:"White/Green",        category:"Lifestyle",     year:"1971", price:"€90" },
  {id:12, brand:"adidas", name:"Adidas Stan Smith",           colorway:"White/Navy",         category:"Lifestyle",     year:"1971", price:"€90" },
  {id:13, brand:"adidas", name:"Adidas Campus 00s",           colorway:"White/Navy",         category:"Lifestyle",     year:"2022", price:"€100"},
  {id:14, brand:"adidas", name:"Adidas Campus 00s",           colorway:"Cream White",        category:"Lifestyle",     year:"2022", price:"€100"},
  {id:15, brand:"adidas", name:"Adidas Campus 80s",           colorway:"Off White",          category:"Lifestyle",     year:"1980", price:"€90" },
  {id:16, brand:"adidas", name:"Adidas Ultraboost 22",        colorway:"Core Black",         category:"Running",       year:"2022", price:"€190"},
  {id:17, brand:"adidas", name:"Adidas Ultraboost 23",        colorway:"Cloud White",        category:"Running",       year:"2023", price:"€200"},
  {id:18, brand:"adidas", name:"Adidas Ultraboost Light",     colorway:"Core Black",         category:"Running",       year:"2023", price:"€200"},
  {id:19, brand:"adidas", name:"Adidas NMD R1",               colorway:"Triple Black",       category:"Lifestyle",     year:"2016", price:"€130"},
  {id:20, brand:"adidas", name:"Adidas NMD R1",               colorway:"Linen",              category:"Lifestyle",     year:"2016", price:"€130"},
  {id:21, brand:"adidas", name:"Adidas NMD_S1",               colorway:"Magic Beige",        category:"Lifestyle",     year:"2022", price:"€150"},
  {id:22, brand:"adidas", name:"Adidas Yeezy Boost 350 V2",  colorway:"Zebra",              category:"Lifestyle",     year:"2016", price:"€220"},
  {id:23, brand:"adidas", name:"Adidas Yeezy Boost 350 V2",  colorway:"Cream White",        category:"Lifestyle",     year:"2017", price:"€220"},
  {id:24, brand:"adidas", name:"Adidas Yeezy Boost 350 V2",  colorway:"Beluga",             category:"Lifestyle",     year:"2017", price:"€220"},
  {id:25, brand:"adidas", name:"Adidas Yeezy Boost 700",     colorway:"Wave Runner",        category:"Lifestyle",     year:"2017", price:"€300"},
  {id:26, brand:"adidas", name:"Adidas Yeezy Boost 700 V2",  colorway:"Static",             category:"Lifestyle",     year:"2019", price:"€300"},
  {id:27, brand:"adidas", name:"Adidas Yeezy Slide",         colorway:"Bone",               category:"Lifestyle",     year:"2021", price:"€70" },
  {id:28, brand:"adidas", name:"Adidas Forum Low",            colorway:"Cloud White",        category:"Basketball",    year:"1984", price:"€100"},
  {id:29, brand:"adidas", name:"Adidas Forum High",           colorway:"White/Royal Blue",   category:"Basketball",    year:"1984", price:"€110"},
  {id:30, brand:"adidas", name:"Adidas Handball Spezial",     colorway:"Brown/Gum",          category:"Indoor",        year:"1979", price:"€90" },
  {id:31, brand:"adidas", name:"Adidas Handball Spezial",     colorway:"Core Black",         category:"Indoor",        year:"1979", price:"€90" },
  {id:32, brand:"adidas", name:"Adidas Handball Spezial",     colorway:"Vintage White",      category:"Indoor",        year:"1979", price:"€90" },
  {id:33, brand:"adidas", name:"Adidas SL 72",                colorway:"Running White",      category:"Running",       year:"1972", price:"€100"},
  {id:34, brand:"adidas", name:"Adidas Ozweego",              colorway:"Ash Pearl",          category:"Lifestyle",     year:"2019", price:"€120"},
  {id:35, brand:"adidas", name:"Adidas Response CL",          colorway:"Grey One",           category:"Lifestyle",     year:"2022", price:"€90" },
  {id:36, brand:"adidas", name:"Adidas Rivalry Low",          colorway:"Cloud White",        category:"Basketball",    year:"2019", price:"€90" },
  {id:37, brand:"adidas", name:"Adidas Adizero Adios Pro 3",  colorway:"Solar Red",          category:"Running",       year:"2022", price:"€230"},
  {id:38, brand:"adidas", name:"Adidas Terrex Swift R3",      colorway:"Core Black",         category:"Trail",         year:"2022", price:"€130"},
  {id:39, brand:"adidas", name:"Adidas 4D Shoes",             colorway:"Carbon",             category:"Running",       year:"2022", price:"€280"},
  {id:40, brand:"adidas", name:"Adidas Climacool Vento",      colorway:"Grey Two",           category:"Running",       year:"2022", price:"€110"},
  // NIKE
  {id:41, brand:"nike", name:"Air Jordan 1 Retro High OG",   colorway:"Chicago",            category:"Basketball",    year:"1985", price:"€185"},
  {id:42, brand:"nike", name:"Air Jordan 1 Retro High OG",   colorway:"Royal Toe",          category:"Basketball",    year:"1985", price:"€185"},
  {id:43, brand:"nike", name:"Air Jordan 1 Retro High OG",   colorway:"Bred",               category:"Basketball",    year:"1985", price:"€185"},
  {id:44, brand:"nike", name:"Air Jordan 1 Retro High OG",   colorway:"Shadow 2.0",         category:"Basketball",    year:"1985", price:"€185"},
  {id:45, brand:"nike", name:"Air Jordan 1 Low",             colorway:"White/Black",        category:"Basketball",    year:"1985", price:"€115"},
  {id:46, brand:"nike", name:"Air Jordan 1 Low",             colorway:"Golf Neutral Grey",  category:"Basketball",    year:"1985", price:"€115"},
  {id:47, brand:"nike", name:"Air Jordan 1 Mid",             colorway:"Black/White",        category:"Basketball",    year:"1985", price:"€125"},
  {id:48, brand:"nike", name:"Air Jordan 3 Retro",           colorway:"White/Cement",       category:"Basketball",    year:"1988", price:"€200"},
  {id:49, brand:"nike", name:"Air Jordan 4 Retro",           colorway:"Military Blue",      category:"Basketball",    year:"1989", price:"€210"},
  {id:50, brand:"nike", name:"Air Jordan 4 Retro",           colorway:"White Cement",       category:"Basketball",    year:"1989", price:"€210"},
  {id:51, brand:"nike", name:"Air Jordan 4 Retro",           colorway:"Thunder",            category:"Basketball",    year:"1989", price:"€210"},
  {id:52, brand:"nike", name:"Air Jordan 11 Retro",          colorway:"Concord",            category:"Basketball",    year:"1995", price:"€220"},
  {id:53, brand:"nike", name:"Air Jordan 11 Retro",          colorway:"Space Jam",          category:"Basketball",    year:"1995", price:"€220"},
  {id:54, brand:"nike", name:"Nike Air Force 1 '07",         colorway:"White/White",        category:"Lifestyle",     year:"1982", price:"€110"},
  {id:55, brand:"nike", name:"Nike Air Force 1 '07",         colorway:"Black/Black",        category:"Lifestyle",     year:"1982", price:"€110"},
  {id:56, brand:"nike", name:"Nike Air Force 1 Low Utility", colorway:"White/Gum",          category:"Lifestyle",     year:"2018", price:"€115"},
  {id:57, brand:"nike", name:"Nike Dunk Low",                colorway:"Panda",              category:"Lifestyle",     year:"1985", price:"€110"},
  {id:58, brand:"nike", name:"Nike Dunk Low",                colorway:"Syracuse",           category:"Lifestyle",     year:"1985", price:"€110"},
  {id:59, brand:"nike", name:"Nike Dunk Low",                colorway:"Kentucky",           category:"Lifestyle",     year:"1985", price:"€110"},
  {id:60, brand:"nike", name:"Nike Dunk Low",                colorway:"Photon Dust",        category:"Lifestyle",     year:"1985", price:"€110"},
  {id:61, brand:"nike", name:"Nike Dunk High",               colorway:"Syracuse",           category:"Lifestyle",     year:"1985", price:"€120"},
  {id:62, brand:"nike", name:"Nike Dunk High",               colorway:"Black/White",        category:"Lifestyle",     year:"1985", price:"€120"},
  {id:63, brand:"nike", name:"Nike Air Max 1",               colorway:"Anniversary Red",    category:"Running",       year:"1987", price:"€130"},
  {id:64, brand:"nike", name:"Nike Air Max 1",               colorway:"Patta Waves",        category:"Running",       year:"1987", price:"€130"},
  {id:65, brand:"nike", name:"Nike Air Max 90",              colorway:"Infrared",           category:"Running",       year:"1990", price:"€130"},
  {id:66, brand:"nike", name:"Nike Air Max 90",              colorway:"Triple White",       category:"Running",       year:"1990", price:"€130"},
  {id:67, brand:"nike", name:"Nike Air Max 95",              colorway:"Neon",               category:"Running",       year:"1995", price:"€170"},
  {id:68, brand:"nike", name:"Nike Air Max 97",              colorway:"Silver Bullet",      category:"Running",       year:"1997", price:"€175"},
  {id:69, brand:"nike", name:"Nike Air Max 97",              colorway:"Triple Black",       category:"Running",       year:"1997", price:"€175"},
  {id:70, brand:"nike", name:"Nike Air Max 270",             colorway:"Black/Anthracite",   category:"Lifestyle",     year:"2018", price:"€150"},
  {id:71, brand:"nike", name:"Nike Air Max Plus",            colorway:"Hyper Blue",         category:"Running",       year:"1998", price:"€165"},
  {id:72, brand:"nike", name:"Nike Air Vapormax Plus",       colorway:"Triple Black",       category:"Running",       year:"2018", price:"€200"},
  {id:73, brand:"nike", name:"Nike Pegasus 40",              colorway:"Black/White",        category:"Running",       year:"2023", price:"€130"},
  {id:74, brand:"nike", name:"Nike Pegasus 41",              colorway:"Midnight Navy",      category:"Running",       year:"2024", price:"€135"},
  {id:75, brand:"nike", name:"Nike Zoom Fly 5",              colorway:"Black/Yellow",       category:"Running",       year:"2022", price:"€180"},
  {id:76, brand:"nike", name:"Nike Invincible 3",            colorway:"White/Platinum",     category:"Running",       year:"2023", price:"€185"},
  {id:77, brand:"nike", name:"Nike React Infinity Run 3",    colorway:"Black/White",        category:"Running",       year:"2022", price:"€160"},
  {id:78, brand:"nike", name:"Nike Free Run 5.0",            colorway:"Black/Smoke Grey",   category:"Running",       year:"2022", price:"€100"},
  {id:79, brand:"nike", name:"Nike Blazer Mid '77",          colorway:"White/Black",        category:"Lifestyle",     year:"1977", price:"€105"},
  {id:80, brand:"nike", name:"Nike Blazer Low '77",          colorway:"White/Gum",          category:"Lifestyle",     year:"1977", price:"€95" },
  {id:81, brand:"nike", name:"Nike SB Dunk Low Pro",         colorway:"Grateful Dead Bears",category:"Skateboarding", year:"2020", price:"€110"},
  {id:82, brand:"nike", name:"Nike SB Dunk High Pro",        colorway:"Circuit Orange",     category:"Skateboarding", year:"2022", price:"€120"},
  {id:83, brand:"nike", name:"Nike Air Huarache",            colorway:"White/Black",        category:"Running",       year:"1991", price:"€120"},
  {id:84, brand:"nike", name:"Nike Air Presto",              colorway:"Triple Black",       category:"Lifestyle",     year:"2000", price:"€130"},
  {id:85, brand:"nike", name:"Nike ACG Mountain Fly Low",    colorway:"Summit White",       category:"Trail",         year:"2021", price:"€160"},
  // NEW BALANCE
  {id:86,  brand:"new-balance", name:"New Balance 550",   colorway:"White/Green",        category:"Basketball", year:"1989", price:"€110"},
  {id:87,  brand:"new-balance", name:"New Balance 550",   colorway:"White/Grey",         category:"Basketball", year:"1989", price:"€110"},
  {id:88,  brand:"new-balance", name:"New Balance 550",   colorway:"Burgundy",           category:"Basketball", year:"1989", price:"€110"},
  {id:89,  brand:"new-balance", name:"New Balance 990v6", colorway:"Grey",               category:"Running",    year:"2023", price:"€210"},
  {id:90,  brand:"new-balance", name:"New Balance 990v5", colorway:"Grey",               category:"Running",    year:"2019", price:"€185"},
  {id:91,  brand:"new-balance", name:"New Balance 990v4", colorway:"Grey",               category:"Running",    year:"2016", price:"€175"},
  {id:92,  brand:"new-balance", name:"New Balance 991",   colorway:"Grey",               category:"Running",    year:"2001", price:"€185"},
  {id:93,  brand:"new-balance", name:"New Balance 992",   colorway:"Grey",               category:"Running",    year:"2006", price:"€200"},
  {id:94,  brand:"new-balance", name:"New Balance 993",   colorway:"Grey",               category:"Running",    year:"2008", price:"€195"},
  {id:95,  brand:"new-balance", name:"New Balance 2002R", colorway:"Sea Salt",           category:"Lifestyle",  year:"2020", price:"€150"},
  {id:96,  brand:"new-balance", name:"New Balance 2002R", colorway:"Protection Pack Moonbeam", category:"Lifestyle", year:"2021", price:"€150"},
  {id:97,  brand:"new-balance", name:"New Balance 2002R", colorway:"Castlerock",         category:"Lifestyle",  year:"2021", price:"€150"},
  {id:98,  brand:"new-balance", name:"New Balance 327",   colorway:"White/Navy",         category:"Lifestyle",  year:"2020", price:"€90" },
  {id:99,  brand:"new-balance", name:"New Balance 327",   colorway:"Summer Fog",         category:"Lifestyle",  year:"2021", price:"€90" },
  {id:100, brand:"new-balance", name:"New Balance 574",   colorway:"Grey",               category:"Lifestyle",  year:"1988", price:"€90" },
  {id:101, brand:"new-balance", name:"New Balance 574",   colorway:"Sea Salt",           category:"Lifestyle",  year:"1988", price:"€90" },
  {id:102, brand:"new-balance", name:"New Balance 530",   colorway:"White/Silver",       category:"Running",    year:"1992", price:"€110"},
  {id:103, brand:"new-balance", name:"New Balance 530",   colorway:"Munsell White",      category:"Running",    year:"1992", price:"€110"},
  {id:104, brand:"new-balance", name:"New Balance 237",   colorway:"White/Black",        category:"Lifestyle",  year:"2021", price:"€90" },
  {id:105, brand:"new-balance", name:"New Balance 1906R", colorway:"Protection Pack",    category:"Running",    year:"2022", price:"€150"},
  {id:106, brand:"new-balance", name:"New Balance 1906R", colorway:"Grey/White",         category:"Running",    year:"2022", price:"€150"},
  {id:107, brand:"new-balance", name:"New Balance 9060",  colorway:"Lunar New Year",     category:"Lifestyle",  year:"2022", price:"€150"},
  {id:108, brand:"new-balance", name:"New Balance 9060",  colorway:"Stone Grey",         category:"Lifestyle",  year:"2022", price:"€150"},
  {id:109, brand:"new-balance", name:"New Balance 860v2", colorway:"White/Navy",         category:"Running",    year:"2023", price:"€130"},
  {id:110, brand:"new-balance", name:"New Balance Fresh Foam X 1080v13", colorway:"Black", category:"Running", year:"2023", price:"€185"},
  {id:111, brand:"new-balance", name:"New Balance FuelCell SuperComp Elite v4", colorway:"White", category:"Racing", year:"2024", price:"€285"},
  {id:112, brand:"new-balance", name:"New Balance More v4", colorway:"White/Black",      category:"Running",    year:"2023", price:"€150"},
  {id:113, brand:"new-balance", name:"New Balance 247",   colorway:"White/Blue",         category:"Lifestyle",  year:"2016", price:"€90" },
  {id:114, brand:"new-balance", name:"New Balance 57/40", colorway:"Teal",               category:"Lifestyle",  year:"2020", price:"€110"},
  {id:115, brand:"new-balance", name:"New Balance RC30",  colorway:"White/Navy",         category:"Racing",     year:"2022", price:"€130"},
  // ASICS
  {id:116, brand:"asics", name:"ASICS Gel-Kayano 14",    colorway:"Cream/Sage",          category:"Running",    year:"2001", price:"€110"},
  {id:117, brand:"asics", name:"ASICS Gel-Kayano 14",    colorway:"White/Black",         category:"Running",    year:"2001", price:"€110"},
  {id:118, brand:"asics", name:"ASICS Gel-Kayano 25",    colorway:"Glacier Grey",        category:"Running",    year:"2018", price:"€160"},
  {id:119, brand:"asics", name:"ASICS Gel-Nimbus 9",     colorway:"Island Blue",         category:"Running",    year:"2007", price:"€130"},
  {id:120, brand:"asics", name:"ASICS Gel-Nimbus 25",    colorway:"Midnight",            category:"Running",    year:"2023", price:"€165"},
  {id:121, brand:"asics", name:"ASICS GT-2160",          colorway:"White/Sage",          category:"Running",    year:"2000", price:"€110"},
  {id:122, brand:"asics", name:"ASICS GT-2160",          colorway:"White/Cream",         category:"Running",    year:"2000", price:"€110"},
  {id:123, brand:"asics", name:"ASICS GT-2160",          colorway:"Navy/Red",            category:"Running",    year:"2000", price:"€110"},
  {id:124, brand:"asics", name:"ASICS Gel-1130",         colorway:"Cream/Black",         category:"Running",    year:"2002", price:"€100"},
  {id:125, brand:"asics", name:"ASICS Gel-1130",         colorway:"White/Sage",          category:"Running",    year:"2002", price:"€100"},
  {id:126, brand:"asics", name:"ASICS Gel-1090",         colorway:"White/Pure Silver",   category:"Running",    year:"2001", price:"€100"},
  {id:127, brand:"asics", name:"ASICS Gel-Quantum 360",  colorway:"Black/Gunmetal",      category:"Running",    year:"2022", price:"€180"},
  {id:128, brand:"asics", name:"ASICS Gel-Lyte III",     colorway:"White/White",         category:"Lifestyle",  year:"1990", price:"€110"},
  {id:129, brand:"asics", name:"ASICS Gel-Lyte V",       colorway:"White/Black",         category:"Lifestyle",  year:"2013", price:"€115"},
  {id:130, brand:"asics", name:"ASICS Gel-Saga",         colorway:"White/Royal",         category:"Lifestyle",  year:"1990", price:"€100"},
  {id:131, brand:"asics", name:"ASICS Gel-Cumulus 25",   colorway:"Black/White",         category:"Running",    year:"2023", price:"€155"},
  {id:132, brand:"asics", name:"ASICS Gel-Kinsei OG",    colorway:"Saffron/Dark Navy",   category:"Running",    year:"2022", price:"€200"},
  {id:133, brand:"asics", name:"ASICS Metaspeed Sky+",   colorway:"White/Amber",         category:"Racing",     year:"2023", price:"€265"},
  {id:134, brand:"asics", name:"ASICS Novablast 4",      colorway:"Black/Graphite Grey", category:"Running",    year:"2024", price:"€145"},
  {id:135, brand:"asics", name:"ASICS Superblast 2",     colorway:"White/Blue Coast",    category:"Running",    year:"2024", price:"€200"},
  {id:136, brand:"asics", name:"ASICS Gel-Trabuco 11",   colorway:"Black/Carrier Grey",  category:"Trail",      year:"2023", price:"€140"},
  {id:137, brand:"asics", name:"ASICS Gel-NYC",          colorway:"White/Cream",         category:"Lifestyle",  year:"2023", price:"€120"},
  {id:138, brand:"asics", name:"ASICS Gel-NYC",          colorway:"Midnight/Metropolis", category:"Lifestyle",  year:"2023", price:"€120"},
  {id:139, brand:"asics", name:"ASICS Gel-Contend 8",    colorway:"Black/White",         category:"Running",    year:"2023", price:"€70" },
  {id:140, brand:"asics", name:"ASICS Gel-Excite 9",     colorway:"White/Blue",          category:"Running",    year:"2022", price:"€65" },
  // More Nike
  {id:141, brand:"nike", name:"Air Jordan 5 Retro",      colorway:"Fire Red",            category:"Basketball", year:"1990", price:"€220"},
  {id:142, brand:"nike", name:"Air Jordan 6 Retro",      colorway:"Carmine",             category:"Basketball", year:"1991", price:"€215"},
  {id:143, brand:"nike", name:"Air Jordan 12 Retro",     colorway:"Flu Game",            category:"Basketball", year:"1997", price:"€225"},
  {id:144, brand:"nike", name:"Nike Air Max 1 x Patta",  colorway:"Noise Aqua",          category:"Running",    year:"2022", price:"€140"},
  {id:145, brand:"nike", name:"Nike Tech Fleece",        colorway:"Black",               category:"Lifestyle",  year:"2023", price:"€200"},
  {id:146, brand:"nike", name:"Nike Cortez",             colorway:"White/Red",           category:"Running",    year:"1972", price:"€90" },
  {id:147, brand:"nike", name:"Nike Waffle Debut",       colorway:"Sail/Gum",            category:"Lifestyle",  year:"2022", price:"€85" },
  {id:148, brand:"nike", name:"Nike Killshot 2",         colorway:"White/Navy/Gum",      category:"Lifestyle",  year:"2012", price:"€95" },
  {id:149, brand:"nike", name:"Nike Air Monarch IV",     colorway:"White/Metallic Gold", category:"Lifestyle",  year:"2002", price:"€80" },
  {id:150, brand:"nike", name:"Nike Air Max Terrascape 90", colorway:"Black",            category:"Lifestyle",  year:"2022", price:"€140"},
  // More Adidas
  {id:151, brand:"adidas", name:"Adidas Spezial",        colorway:"Linen",               category:"Indoor",     year:"1979", price:"€95" },
  {id:152, brand:"adidas", name:"Adidas Boston 12",      colorway:"Black/White",         category:"Running",    year:"2024", price:"€145"},
  {id:153, brand:"adidas", name:"Adidas Adizero SL",     colorway:"Core Black",          category:"Running",    year:"2023", price:"€110"},
  {id:154, brand:"adidas", name:"Adidas Response CL",    colorway:"White/Core Black",    category:"Lifestyle",  year:"2022", price:"€90" },
  {id:155, brand:"adidas", name:"Adidas Climacool 2.0",  colorway:"White/Clear Onix",    category:"Running",    year:"2023", price:"€100"},
  {id:156, brand:"adidas", name:"Adidas Orketro",        colorway:"Core Black/Carbon",   category:"Lifestyle",  year:"2022", price:"€120"},
  {id:157, brand:"adidas", name:"Adidas Retropy E5",     colorway:"Cloud White",         category:"Lifestyle",  year:"2022", price:"€110"},
  {id:158, brand:"adidas", name:"Adidas Streetball",     colorway:"Core Black",          category:"Basketball", year:"1992", price:"€90" },
  {id:159, brand:"adidas", name:"Adidas ZX 8000",        colorway:"Aqua",                category:"Running",    year:"1988", price:"€120"},
  {id:160, brand:"adidas", name:"Adidas ZX 2K Boost",    colorway:"Cloud White",         category:"Running",    year:"2020", price:"€130"},
  // More NB
  {id:161, brand:"new-balance", name:"New Balance ML574",  colorway:"Angora",            category:"Lifestyle",  year:"2022", price:"€95" },
  {id:162, brand:"new-balance", name:"New Balance 1500",   colorway:"Made in UK Grey",   category:"Running",    year:"1989", price:"€170"},
  {id:163, brand:"new-balance", name:"New Balance 577",    colorway:"Made in UK Tan",    category:"Running",    year:"1997", price:"€175"},
  {id:164, brand:"new-balance", name:"New Balance M1300",  colorway:"Grey",              category:"Running",    year:"1983", price:"€200"},
  {id:165, brand:"new-balance", name:"New Balance Fresh Foam 1080v12", colorway:"Black", category:"Running",    year:"2022", price:"€165"},
  {id:166, brand:"new-balance", name:"New Balance 580",    colorway:"White/Green",       category:"Trail",      year:"2001", price:"€110"},
  {id:167, brand:"new-balance", name:"New Balance 725",    colorway:"Grey/Orange",       category:"Running",    year:"1996", price:"€100"},
  {id:168, brand:"new-balance", name:"New Balance 801",    colorway:"Grey/Green",        category:"Trail",      year:"1997", price:"€110"},
  {id:169, brand:"new-balance", name:"New Balance 854",    colorway:"White/Navy",        category:"Running",    year:"2001", price:"€120"},
  {id:170, brand:"new-balance", name:"New Balance 998",    colorway:"Made in USA Grey",  category:"Running",    year:"1993", price:"€185"},
  // More ASICS
  {id:171, brand:"asics", name:"ASICS Gel-Kahana 8",     colorway:"Black/White",         category:"Trail",      year:"2016", price:"€110"},
  {id:172, brand:"asics", name:"ASICS Gel-Sonoma 7",     colorway:"Black/Carrier Grey",  category:"Trail",      year:"2023", price:"€95" },
  {id:173, brand:"asics", name:"ASICS GT-1000 12",       colorway:"White/Black",         category:"Running",    year:"2023", price:"€90" },
  {id:174, brand:"asics", name:"ASICS Gel-Resolution 9", colorway:"White/Black",         category:"Tennis",     year:"2023", price:"€145"},
  {id:175, brand:"asics", name:"ASICS Gel-Blade FF",     colorway:"Black/Electric Blue", category:"Squash",     year:"2022", price:"€110"},
  {id:176, brand:"asics", name:"ASICS Gel-Peake 2",      colorway:"White/Black",         category:"Volleyball", year:"2022", price:"€85" },
  {id:177, brand:"asics", name:"ASICS Gel-Court Speed",  colorway:"White/Glacial Grey",  category:"Tennis",     year:"2022", price:"€105"},
  {id:178, brand:"asics", name:"ASICS Gel-Dedicate 8",   colorway:"White/Black",         category:"Tennis",     year:"2023", price:"€75" },
  {id:179, brand:"asics", name:"ASICS Jolt 4",           colorway:"Black/White",         category:"Running",    year:"2023", price:"€55" },
  {id:180, brand:"asics", name:"ASICS Gel-Venture 9",    colorway:"Black/Sheet Rock",    category:"Trail",      year:"2023", price:"€70" },
  {id:181, brand:"asics", name:"ASICS Fujitrail Brand New Day", colorway:"White",        category:"Trail",      year:"2022", price:"€130"},
  {id:182, brand:"asics", name:"ASICS Gel-Quantum 360 VII", colorway:"Black/Sheet Rock", category:"Running",   year:"2022", price:"€180"},
  {id:183, brand:"asics", name:"ASICS Gel-Flux 5",       colorway:"White/Black",         category:"Running",    year:"2023", price:"€75" },
  {id:184, brand:"asics", name:"ASICS GT-4000 3",        colorway:"Black/White",         category:"Running",    year:"2022", price:"€130"},
  {id:185, brand:"asics", name:"ASICS Gel-Kayano Lite 3",colorway:"Black/Graphite Grey", category:"Running",    year:"2023", price:"€120"},
  // Bonus iconic collabs/special editions
  {id:186, brand:"nike",        name:"Nike Air Max 1 x CLOT",        colorway:"Solar Red Silk",     category:"Lifestyle",  year:"2022", price:"€200"},
  {id:187, brand:"nike",        name:"Air Jordan 1 x Travis Scott",  colorway:"Mocha",              category:"Basketball", year:"2019", price:"€175"},
  {id:188, brand:"nike",        name:"Nike Dunk Low x Off-White",    colorway:"University Gold",    category:"Lifestyle",  year:"2021", price:"€180"},
  {id:189, brand:"adidas",      name:"Adidas Samba x Wales Bonner",  colorway:"Cream White",        category:"Lifestyle",  year:"2022", price:"€170"},
  {id:190, brand:"adidas",      name:"Adidas Gazelle x Wales Bonner",colorway:"Solar Yellow",       category:"Lifestyle",  year:"2022", price:"€170"},
  {id:191, brand:"new-balance", name:"New Balance 992 x Stussy",     colorway:"Grey",               category:"Running",    year:"2020", price:"€250"},
  {id:192, brand:"new-balance", name:"New Balance 990v3 x JJJJound", colorway:"Grey",               category:"Running",    year:"2022", price:"€200"},
  {id:193, brand:"asics",       name:"ASICS Gel-Lyte III x Kith",   colorway:"Classic",            category:"Lifestyle",  year:"2019", price:"€180"},
  {id:194, brand:"nike",        name:"Nike SB Dunk Low x Ben & Jerry's", colorway:"Chunky Dunky",  category:"Skateboarding", year:"2020", price:"€110"},
  {id:195, brand:"adidas",      name:"Adidas Superstar x Run DMC",   colorway:"Shell Toe",          category:"Lifestyle",  year:"2011", price:"€100"},
  {id:196, brand:"nike",        name:"Air Jordan 4 x Union",         colorway:"Off Noir",           category:"Basketball", year:"2022", price:"€210"},
  {id:197, brand:"nike",        name:"Nike Air Force 1 x Louis Vuitton", colorway:"White",         category:"Lifestyle",  year:"2022", price:"€1200"},
  {id:198, brand:"adidas",      name:"Adidas Yeezy 500",             colorway:"Blush",              category:"Lifestyle",  year:"2018", price:"€250"},
  {id:199, brand:"nike",        name:"Nike Air Max 90 x Skepta",     colorway:"Bloody Chrome",      category:"Running",    year:"2020", price:"€145"},
  {id:200, brand:"new-balance", name:"New Balance 2002R x Protection Pack", colorway:"Olive",      category:"Lifestyle",  year:"2021", price:"€180"},
].map((s, i) => {
  const descMap = {
    "Adidas Samba OG": "Originally designed for indoor football in 1950, the Samba became a street culture icon through its gum sole, suede upper, and timeless low-profile silhouette.",
    "Adidas Samba Rose": "A women's-led riff on the classic Samba with a platform sole, blending retro football heritage with contemporary chunky proportions.",
    "Adidas Gazelle": "A 1968 training shoe turned cultural cornerstone, the Gazelle's slim suede build and three-stripe branding made it the go-to of Britpop and terrace fashion.",
    "Adidas Gazelle Indoor": "The indoor football variant of the Gazelle, featuring a herringbone outsole and tighter silhouette that's become a staple of the current retro wave.",
    "Adidas Superstar": "Launched in 1970 as a basketball shoe, the shell-toe Superstar crossed over into hip-hop royalty via Run-DMC and became one of the best-selling sneakers ever.",
    "Adidas Stan Smith": "The world's best-selling tennis shoe, the Stan Smith's clean white leather and minimal perforated branding has made it a wardrobe essential since 1971.",
    "Adidas Campus 00s": "A modernised take on the 1980s Campus silhouette, updated with slightly bolder proportions for the current retro trend. Worn widely off-pitch and off-duty.",
    "Adidas Campus 80s": "The original 1980 Campus is a basketball-court-turned-skate icon, prized for its clean suede construction and versatile understated look.",
    "Adidas Ultraboost 22": "Adidas's flagship performance runner featuring a Primeknit upper and full-length Boost foam midsole for maximum energy return on long runs.",
    "Adidas Ultraboost 23": "The 2023 iteration of Ultraboost refines the fit and cushioning stack, maintaining its status as one of the most comfortable daily trainers available.",
    "Adidas Ultraboost Light": "A lighter reimagining of the Ultraboost with a redesigned Light Boost foam that sheds weight without sacrificing the plush ride.",
    "Adidas NMD R1": "The NMD debuted in 2016 borrowing Boost foam plugs and a Primeknit sock fit from archive runners. It became one of the most hyped lifestyle releases of the decade.",
    "Adidas NMD_S1": "A premium NMD variant with refined materials and a more sophisticated aesthetic, bridging the gap between performance heritage and contemporary streetwear.",
    "Adidas Yeezy Boost 350 V2": "Kanye West's most iconic Adidas collaboration, the 350 V2 introduced a Primeknit sock upper and a translucent stripe detail that made it the defining sneaker of the late 2010s.",
    "Adidas Yeezy Boost 700": "The Wave Runner's chunky multi-panel construction triggered the dad shoe trend. Its bulky silhouette and premium materials set a new direction for lifestyle footwear.",
    "Adidas Yeezy Boost 700 V2": "A refined version of the 700 with a Geode-inspired upper and Static colourway that became instantly iconic in the sneaker world.",
    "Adidas Yeezy Slide": "A minimalist foam clog from the Yeezy line that became unexpectedly covetable, known for its one-piece moulded construction and neutral tones.",
    "Adidas Forum Low": "Revived from adidas's 1984 basketball archive, the Forum features an ankle strap and bold three-stripe branding that has found new life on contemporary streets.",
    "Adidas Forum High": "The high-top version of the 1984 Forum basketball shoe, worn by NBA players and now a streetwear staple thanks to its bold collegiate aesthetic.",
    "Adidas Handball Spezial": "A 1979 indoor handball shoe that aged into one of the most culturally significant sneakers of the 2020s, beloved for its flat sole, suede build, and city-specific colourways.",
    "Adidas SL 72": "A 1972 Olympics running shoe reissued as a lifestyle trainer, featuring a low-profile nylon and suede upper with clean old-school proportions.",
    "Adidas Ozweego": "A late-90s-inspired chunky runner that became a streetwear favourite for its exaggerated sole unit and retro-futurist aesthetic.",
    "Adidas Response CL": "A clean-lined lifestyle trainer drawing from adidas's running archive, offering a stripped-back alternative to the more maximalist silhouettes of its era.",
    "Adidas Rivalry Low": "A basketball court classic from the late 1980s, reissued as a clean leather lifestyle shoe with heritage appeal.",
    "Adidas Spezial": "The Spezial range celebrates adidas's most significant archival designs, with the original indoor handball model at its heart.",
    "Adidas Boston 12": "A daily training shoe and tempo runner built around a full-length Lightstrike Pro midsole, designed for versatile use from easy miles to race day.",
    "Air Jordan 1 Retro High OG": "Michael Jordan's first signature shoe, banned by the NBA and immortalised by controversy. The Chicago colourway is the most iconic sneaker ever made.",
    "Air Jordan 1 Low": "The low-cut version of Jordan's debut shoe, offering the same iconic silhouette with a more wearable everyday profile.",
    "Air Jordan 1 Mid": "Sitting between the high and low, the Jordan 1 Mid has become the everyday entry point to the Jordan lineage.",
    "Air Jordan 3 Retro": "The first Jordan designed by Tinker Hatfield, introducing the iconic elephant print and visible Air unit that changed sneaker design forever.",
    "Air Jordan 4 Retro": "The 1989 Jordan 4 introduced plastic wing eyelets and a mesh upper for breathability, creating one of the most versatile and collectible silhouettes in the line.",
    "Air Jordan 11 Retro": "The most technically ambitious Jordan ever, with a patent leather mudguard and carbon fibre shank plate. The Concord remains the most anticipated annual Nike release.",
    "Air Jordan 5 Retro": "Inspired by WWII fighter planes, the Jordan 5 introduced the reflective tongue and translucent outsole that made it one of the most distinct Jordan silhouettes.",
    "Air Jordan 6 Retro": "The shoe Michael Jordan wore when he won his first championship, featuring a pull tab and rubber traction pattern inspired by sports cars.",
    "Air Jordan 12 Retro": "The Flu Game shoe — worn by Jordan during a legendary performance against the Jazz — remains one of the most storied sneakers in sports history.",
    "Nike Air Force 1 '07": "The original basketball shoe turned cultural touchstone, the AF1's simple leather upper and Air cushioning have made it the best-selling sneaker of all time.",
    "Nike Air Force 1 Low Utility": "A more rugged take on the classic AF1, featuring exposed foam and utility-inspired materials for an updated everyday silhouette.",
    "Nike Dunk Low": "Originally a 1985 college basketball shoe, the Dunk Low's wide variety of colourways and collaborations made it the defining sneaker of the early 2020s.",
    "Nike Dunk High": "The high-top Dunk offers added ankle support and a larger canvas for bold colourways, maintaining the same beloved proportion as its low sibling.",
    "Nike Air Max 1": "Tinker Hatfield's revolutionary 1987 design with a visible Air window in the midsole changed the sneaker industry forever and remains a cornerstone of Nike's lineup.",
    "Nike Air Max 90": "The Air Max 90's exaggerated design lines and bold Infrared colourway made it an instant icon in 1990. Still one of the most recognisable runners ever made.",
    "Nike Air Max 95": "The Neon colourway mimics the human anatomy and is among the most visually striking sneakers Nike has ever produced.",
    "Nike Air Max 97": "The Silver Bullet's full-length Air cushioning and streamlined metallic design was inspired by Japanese bullet trains, setting a new standard for running aesthetics.",
    "Nike Air Max 270": "A lifestyle Air Max with the largest Air unit ever, offering all-day comfort in a silhouette designed purely for off-court wear.",
    "Nike Air Max Plus": "The TN's aggressive design lines inspired by ocean waves made it a divisive and fiercely loyal sneaker with cult status across Europe.",
    "Nike Air Vapormax Plus": "The TN upper transplanted onto the revolutionary Flyknit Vapormax sole unit, combining two iconic Nike silhouettes into one of the most innovative lifestyle shoes ever.",
    "Nike Pegasus 40": "The 40th edition of Nike's most trusted training shoe, offering reliable cushioning and a responsive ride for everyday runners.",
    "Nike Pegasus 41": "The latest Pegasus iteration refines the React foam platform with added responsiveness, continuing a lineage of dependable daily trainers.",
    "Nike Zoom Fly 5": "A marathon racer for everyday runners, using a carbon-fibre-infused plate and Flyknit upper to deliver race-day performance at an accessible price.",
    "Nike Invincible 3": "Nike's most cushioned everyday trainer, built around an oversized ZoomX foam midsole for maximum comfort on recovery runs.",
    "Nike React Infinity Run 3": "Designed to reduce injury risk with a wide React foam base and rocker geometry, the Infinity Run is Nike's most supportive daily trainer.",
    "Nike Free Run 5.0": "The flexible Free sole mimics barefoot movement, making it one of Nike's most natural-feeling everyday shoes.",
    "Nike Blazer Mid '77": "A 1970s basketball shoe revived as a clean canvas for collaboration and colour, the Blazer Mid has become one of Nike's most versatile lifestyle silhouettes.",
    "Nike Blazer Low '77": "The low-cut Blazer offers the same retro aesthetic in a more relaxed profile, ideal as a clean everyday option.",
    "Nike SB Dunk Low Pro": "The skateboarding-specific Dunk features extra padding and grippy outsoles. Collaborations like the Grateful Dead Bears helped elevate it to cult status.",
    "Nike SB Dunk High Pro": "The high-top SB Dunk offers extra ankle protection for skating while maintaining the bold colourway approach that made the line iconic.",
    "Nike Air Huarache": "Designed by Tinker Hatfield in 1991 with a neoprene inner sleeve for an innovative fit, the Huarache remains one of Nike's most distinctive running shapes.",
    "Nike Air Presto": "Nicknamed the 'T-shirt for your foot', the Presto's soft mesh construction and minimal silhouette set it apart when it debuted in 2000.",
    "Nike Cortez": "Nike's very first shoe, the Cortez has been worn by everyone from Forrest Gump to hip-hop artists, maintaining its place as a cultural landmark.",
    "Nike Waffle Debut": "A modern reinterpretation of Nike's original waffle outsole design, celebrating the brand's founding innovation in a clean everyday package.",
    "Nike Killshot 2": "A court-inspired silhouette with a clean suede upper and minimal branding. It sold out repeatedly via the Nike Employee Store before going mainstream.",
    "New Balance 550": "Originally a 1989 basketball shoe, the 550's clean leather construction and court proportions were revived by Aimé Leon Dore in 2020, triggering a massive resurgence.",
    "New Balance 990v6": "The sixth edition of New Balance's flagship 990 series continues the tradition of premium US manufacturing and supreme all-day comfort.",
    "New Balance 990v5": "A beloved version of the 990 series that struck the ideal balance between slim profile and premium cushioning, earning consistent critical praise.",
    "New Balance 991": "The 991 is the foundation of New Balance's grey suede aesthetic, offering an elevated build quality and understated design beloved by style communities.",
    "New Balance 992": "Made in the USA, the 992's C-CAP midsole and premium leather construction established it as one of the most coveted New Balance models.",
    "New Balance 993": "Originally designed for medical professionals who spend all day on their feet, the 993 became a cult favourite for its unmatched comfort and heritage build.",
    "New Balance 2002R": "A retro running shoe fusing trail and road technology, revived with premium materials and now widely regarded as the cornerstone of New Balance's lifestyle range.",
    "New Balance 327": "A reworking of the 1970s racing flat with an oversized N and exaggerated heel wedge that perfectly captures the current retro sport aesthetic.",
    "New Balance 574": "The 574 has been New Balance's best-selling lifestyle shoe for decades, offering timeless proportions and endless colourway variations.",
    "New Balance 530": "A 1990s running shoe with a silver-accented mesh upper that has been revived as a go-to lifestyle option thanks to its clean retro look.",
    "New Balance 237": "A compact runner inspired by 1970s racing designs, with a low-profile silhouette that bridges vintage sport and modern casualwear.",
    "New Balance 1906R": "A retro running shoe with a technical aesthetic featuring ENCAP cushioning and detailed overlays, growing rapidly as a lifestyle choice.",
    "New Balance 9060": "A maximalist lifestyle shoe that draws from New Balance's late 1990s and early 2000s chunky running archive, gaining enormous traction with sneaker enthusiasts.",
    "New Balance 860v2": "A throwback to early 2000s motion-control running shoes, the 860v2 has found a second life as a lifestyle trainer with its retro tech aesthetic.",
    "New Balance 574": "The evergreen 574 pairs ENCAP cushioning with suede and mesh construction for a model that has anchored New Balance's lifestyle offering for over 30 years.",
    "New Balance 247": "A seamlessly-constructed lifestyle shoe that blends running and lifestyle influences in a low-profile, easy-wearing silhouette.",
    "New Balance RC30": "A racing flat-inspired lifestyle shoe with a carbon rubber outsole and streamlined profile, bridging competitive running heritage and everyday wear.",
    "ASICS Gel-Kayano 14": "Originally a supportive motion-control running shoe, the Gel-Kayano 14 was reissued in lifestyle colourways and became an unexpected fashion icon.",
    "ASICS Gel-Kayano 25": "A modern iteration of the Kayano support platform, offering FlyteFoam cushioning and a streamlined aesthetic for structured daily running.",
    "ASICS Gel-Nimbus 9": "Reissued in its original form with chunky visible Gel units and retro-coloured mesh, the Nimbus 9 is a key part of the Y2K running aesthetic revival.",
    "ASICS Gel-Nimbus 25": "The latest version of ASICS's flagship neutral trainer, offering maximum cushioning for long-distance running with FF Blast+ foam.",
    "ASICS GT-2160": "A 2000s stability runner with a dual-density foam midsole and retro mesh upper, now one of the most sought-after ASICS silhouettes in the lifestyle market.",
    "ASICS Gel-1130": "A late-1990s running model with classic ASICS proportions, reissued with nostalgic colourways that have resonated strongly with the current retro trend.",
    "ASICS Gel-1090": "A retro running model with pronounced Gel cushioning units and a layered mesh upper that bridges 2000s performance design and contemporary lifestyle.",
    "ASICS Gel-Quantum 360": "A performance runner with a full 360-degree Gel cushioning system for maximum impact protection across every footstrike.",
    "ASICS Gel-Lyte III": "One of ASICS's most enduring lifestyle silhouettes, the split-tongue Gel-Lyte III has been the foundation of countless notable collaborations.",
    "ASICS Gel-Lyte V": "The fifth generation of the Gel-Lyte, maintaining the split-tongue design while updating the fit and materials for contemporary wear.",
    "ASICS Gel-Saga": "An archival ASICS running model with clean proportions and a cushioned sole, popularised through limited colourway releases and select collaborations.",
    "ASICS Gel-Cumulus 25": "A neutral daily trainer with FlyteFoam Blast+ cushioning offering a softer, more energetic ride for everyday miles.",
    "ASICS Gel-Kinsei OG": "A reissued premium running model featuring multiple Gel cushioning zones and an intricate upper construction that made it a luxury running icon.",
    "ASICS Metaspeed Sky+": "ASICS's elite carbon-plated racing shoe, engineered for runners with a higher stride frequency to maximise speed over marathon distance.",
    "ASICS Novablast 4": "A maximally-cushioned everyday trainer with a springy FF Blast+ midsole and an inherently fun ride character.",
    "ASICS Superblast 2": "A versatile plated trainer that bridges daily cushioning and race-day performance, built around a stack of FF Blast Turbo foam.",
    "ASICS Gel-NYC": "A lifestyle model drawing from ASICS's NYC Marathon heritage, featuring multiple Gel units and layered nubuck and mesh upper construction.",
    "Nike Air Max 1 x CLOT": "Edison Chen's CLOT x Nike collaboration features a semi-transparent silk upper inspired by traditional Chinese medicine, making it one of Nike's most culturally significant collabs.",
    "Air Jordan 1 x Travis Scott": "Travis Scott's reverse swoosh design on the Jordan 1 became one of the most iconic collaborations of the 2010s, generating enormous hype.",
    "Nike Dunk Low x Off-White": "Virgil Abloh's deconstructed Off-White Dunk featured text labels and exposed foam, redefining how collaborations could reinterpret a classic silhouette.",
    "Adidas Samba x Wales Bonner": "Grace Wales Bonner brought a refined craft perspective to the Samba with premium materials and subtle branding, elevating it for a luxury audience.",
    "Adidas Gazelle x Wales Bonner": "A follow-up to the successful Samba collaboration, Wales Bonner applied the same elevated material ethos to the iconic Gazelle silhouette.",
    "New Balance 992 x Stussy": "Stussy's collaboration on the 992 applied premium suede overlays and tonal colourways to one of New Balance's most prestigious made-in-USA platforms.",
    "New Balance 990v3 x JJJJound": "JJJJound's tonal grey take on the 990v3 demonstrated how restrained, monochromatic colourways could generate enormous hype.",
    "ASICS Gel-Lyte III x Kith": "Kith's multiple Gel-Lyte III collaborations helped introduce the ASICS silhouette to a new generation of sneaker enthusiasts.",
    "Nike SB Dunk Low x Ben & Jerry's": "The Chunky Dunky remains one of the most beloved and sought-after Nike collaborations, using an ice cream-inspired tie-dye upper.",
    "Adidas Superstar x Run DMC": "Run-DMC wore Superstars lace-free on stage and in their 'My Adidas' video, cementing the model's place in hip-hop history.",
    "Air Jordan 4 x Union": "Union LA's reverse construction Jordan 4 released in worn-in pre-aged materials, offering a fresh perspective on an iconic silhouette.",
    "Nike Air Force 1 x Louis Vuitton": "Virgil Abloh's posthumous collaboration matched the AF1's silhouette with Louis Vuitton's monogram canvas, becoming the most expensive Nike collab of all time.",
    "Adidas Yeezy 500": "The Yeezy 500's chunky adiPRENE+ midsole and retro running aesthetic helped establish the dad shoe trend that dominated sneaker culture in 2018.",
    "Nike Air Max 90 x Skepta": "North London rapper Skepta's collaboration with Nike brought an NHS-inspired blue and silver colourway to the Air Max 90.",
    "New Balance 2002R x Protection Pack": "The Protection Pack series applied camo-inspired overlays to the 2002R, creating one of the most visually distinctive colourway series in the model's history.",
  };
  const brandNames = { nike:"Nike", adidas:"Adidas", "new-balance":"New Balance", asics:"ASICS" };
  const desc = descMap[s.name] || `The ${s.name} in ${s.colorway} is a ${s.category.toLowerCase()} silhouette from ${brandNames[s.brand]||s.brand}, combining performance heritage with enduring style.`;
  return { ...s, description: desc };
});

const PAGE_SIZE = 9;

// ─── Instant search — phrase-first, all-terms-must-match-name ─────────
function searchDB(q) {
  if (!q.trim()) return DB;
  const raw   = q.toLowerCase().trim();
  const terms = raw.split(/\s+/).filter(t => t.length > 1);

  const scored = DB.map(s => {
    const name     = s.name.toLowerCase();
    const colorway = s.colorway.toLowerCase();
    const brand    = s.brand.toLowerCase().replace("-"," ");
    const desc     = (s.description||"").toLowerCase();
    let score = 0;

    // ── Tier 1: exact full phrase in name (best possible match) ──────
    if (name.includes(raw)) {
      score += 500;
    }
    // ── Tier 2: all terms appear somewhere in name+colorway+brand ────
    else {
      const searchable = `${name} ${colorway} ${brand}`;
      const allMatch = terms.every(t => searchable.includes(t));
      if (allMatch) {
        score += 200;
        // Bonus: more terms = more specific query = reward it
        score += terms.length * 20;
        // Extra bonus if all terms are in the name itself
        if (terms.every(t => name.includes(t))) score += 100;
      }
      // ── Tier 3: most (not all) terms match — only if query is 1 word ──
      else if (terms.length === 1) {
        if (name.includes(terms[0]))           score += 60;
        else if (brand.includes(terms[0]))     score += 30;
        else if (colorway.includes(terms[0]))  score += 15;
      }
      // Multi-word query where not all terms match → exclude entirely
      else {
        return { s, score: 0 };
      }
    }

    return { s, score };
  })
  .filter(x => x.score > 0)
  .sort((a, b) => b.score - a.score);

  return scored.map(x => x.s);
}

// ─── AI augmentation — two parallel calls for speed + volume ─────────
async function fetchAIBatch(query, batchNum, exclude = []) {
  const excl = exclude.slice(0, 20).join(", ");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:API_HEADERS,
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:3000,
      system:"Sneaker encyclopedia. Output ONLY a raw JSON object. No markdown, no text outside the JSON.",
      messages:[{role:"user",content:
        `Search: "${query}" — batch ${batchNum}.\n` +
        (excl ? `Do not include: ${excl}.\n` : "") +
        `Return JSON: {"sneakers":[{"name":"","brand":"nike|adidas|new-balance|asics","year":"","colorway":"","category":"","price":"€XX","description":"one sentence on why this sneaker matters"}]}\n` +
        `IMPORTANT: Treat "${query}" as a PHRASE, not separate words. Only return sneakers that are genuinely related to "${query}" as a whole concept. If "${query}" refers to a specific collaboration, colourway, or model, return results for exactly that. Do not return results that match only one word of a multi-word query. Return 15 results.`
      }],
    }),
  });
  const data = await res.json();
  if (data.error) { console.error("API error:", data.error); return []; }
  const text = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
  let parsed;
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return [];
    parsed = JSON.parse(m[0]);
  } catch {
    try {
      const partial = text.match(/"sneakers"\s*:\s*\[([\s\S]*)/);
      if (!partial) return [];
      const objects = partial[1].match(/\{[^{}]*\}/g) || [];
      parsed = { sneakers: objects.map(o => { try { return JSON.parse(o); } catch { return null; } }).filter(Boolean) };
    } catch { return []; }
  }
  return (parsed.sneakers||[]).map((s, i) => ({
    id: `ai_${batchNum}_${Date.now()}_${i}`,
    brand: (s.brand||"nike").toLowerCase().replace(/\s+/g,"-"),
    name: s.name||"",
    year: s.year||"",
    colorway: s.colorway||"",
    category: s.category||"Lifestyle",
    price: s.price||"—",
    description: s.description||"",
    img: null,
  })).filter(s => s.name);
}

async function fetchAIResults(query, exclude = []) {
  // Fire two batches in parallel — batch 2 gets a different offset instruction
  const [b1, b2] = await Promise.all([
    fetchAIBatch(query, 1, exclude),
    fetchAIBatch(query, 2, [...exclude, ...[]]), // slightly different seed via batch num
  ]);
  // Dedupe between the two batches
  const seen = new Set(b1.map(s => s.name.toLowerCase()));
  const deduped2 = b2.filter(s => !seen.has(s.name.toLowerCase()));
  return [...b1, ...deduped2];
}

// ─── Search result card (richer than homepage card) ───────────────────
function SearchCard({ sneaker, onOpen }) {
  const [hov, setHov] = useState(false);
  const brand = sneaker.brand || "nike";
  return (
    <div
      role="button" tabIndex={0}
      onClick={() => onOpen(sneaker, brand)}
      onKeyDown={e => (e.key==="Enter"||e.key===" ") && onOpen(sneaker, brand)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov?"rgba(232,255,71,0.07)":"rgba(255,255,255,0.04)", border: hov?"1px solid #E8FF47":"1px solid rgba(255,255,255,0.1)", borderRadius:"4px", cursor:"pointer", transition:"border-color 0.2s,background 0.2s", outline:"none", display:"flex", flexDirection:"column" }}
    >
      {/* Image strip */}
      <div style={{ position:"relative", paddingTop:"52%", background:"#111", borderRadius:"4px 4px 0 0", overflow:"hidden" }}>
        <SneakerImg name={sneaker.name} brand={brand}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", transition:"transform 0.4s", transform:hov?"scale(1.05)":"scale(1)" }}/>
        <div style={{ position:"absolute", top:"8px", left:"8px", background:"#E8FF47", color:"#0a0a0a", padding:"2px 7px", fontSize:"9px", fontFamily:"'Space Mono',monospace", fontWeight:"bold", borderRadius:"2px", pointerEvents:"none" }}>
          {sneaker.category}
        </div>
        <div style={{ position:"absolute", top:"8px", right:"8px", background:"rgba(0,0,0,0.65)", color:"rgba(255,255,255,0.7)", padding:"2px 7px", fontSize:"9px", fontFamily:"'Space Mono',monospace", borderRadius:"2px" }}>
          {sneaker.year}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px", flex:1, display:"flex", flexDirection:"column", gap:"6px" }}>
        <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.35)", fontFamily:"'Space Mono',monospace", letterSpacing:"1.5px", textTransform:"uppercase" }}>
          {brand.replace("-"," ")}
        </div>
        <div style={{ fontSize:"clamp(14px,2.5vw,16px)", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"1px", color:"#fff", lineHeight:1.15 }}>
          {sneaker.name}
        </div>
        <div style={{ fontSize:"11px", color:"#E8FF47", fontFamily:"'Space Mono',monospace", opacity:0.8 }}>
          {sneaker.colorway}
        </div>
        {sneaker.description && (
          <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.55)", fontFamily:"'Space Mono',monospace", lineHeight:1.6, margin:0, flexGrow:1 }}>
            {sneaker.description.length > 120 ? sneaker.description.slice(0, 120) + "…" : sneaker.description}
          </p>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:"10px", marginTop:"4px" }}>
          <div>
            <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.3)", fontFamily:"'Space Mono',monospace" }}>RETAIL</div>
            <div style={{ fontSize:"14px", color:"#E8FF47", fontFamily:"'Space Mono',monospace", fontWeight:"bold" }}>{sneaker.price}</div>
          </div>
          <div style={{ fontSize:"9px", color: hov?"#E8FF47":"rgba(255,255,255,0.2)", fontFamily:"'Space Mono',monospace", transition:"color 0.2s" }}>
            VIEW ENTRY →
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Search Overlay ───────────────────────────────────────────────────
function SearchOverlay({query, onClose, onOpen, onNewSearch}) {
  const [localQ,    setLocalQ]    = useState(query);
  const [page,      setPage]      = useState(1);
  const [aiResults, setAiResults] = useState([]);
  const [aiLoading, setAiLoading] = useState(true);
  const topRef   = useRef(null);

  useEffect(()=>{ document.body.style.overflow="hidden"; return()=>{ document.body.style.overflow=""; }; },[]);

  // On query change: reset and kick off AI fetch in background
  useEffect(()=>{
    const currentQuery = query;
    setLocalQ(query);
    setPage(1);
    setAiResults([]);
    setAiLoading(true);

    const localNames = searchDB(query).map(s => s.name);

    fetchAIResults(query, localNames)
      .then(extra => {
        if (query !== currentQuery) return; // stale — new query fired before this resolved
        setAiResults(extra);
      })
      .catch(()=>{})
      .finally(()=>{ setAiLoading(false); });
  }, [query]);

  // Merged results: local DB first (instant), AI appended behind
  const localResults = useMemo(()=> searchDB(query), [query]);
  const allResults   = useMemo(()=>{
    const localNameSet = new Set(localResults.map(s => s.name.toLowerCase()));
    const deduped      = aiResults.filter(s => !localNameSet.has(s.name.toLowerCase()));
    return [...localResults, ...deduped];
  }, [localResults, aiResults]);

  const totalPages   = Math.max(1, Math.ceil(allResults.length / PAGE_SIZE));
  const pageResults  = allResults.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  function goPage(p){ setPage(p); if(topRef.current) topRef.current.scrollTop=0; }
  function doSearch(){ if(localQ.trim() && localQ.trim()!==query) onNewSearch(localQ.trim()); }

  return (
    <div ref={topRef} onClick={onClose}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.96)",zIndex:900,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:"1060px",margin:"0 auto",padding:"24px 16px 60px"}}>

        <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontFamily:"'Space Mono',monospace",fontSize:"12px",cursor:"pointer",marginBottom:"20px",padding:0}}>← Back to Archive</button>

        {/* Search bar */}
        <div style={{position:"relative",marginBottom:"24px"}}>
          <input value={localQ} onChange={e=>setLocalQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Search sneakers..."
            style={{width:"100%",padding:"14px 110px 14px 18px",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.15)",borderRadius:"4px",color:"#fff",fontSize:"clamp(13px,3vw,15px)",fontFamily:"'Space Mono',monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"}}
            onFocus={e=>e.target.style.borderColor="#E8FF47"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.15)"}/>
          <button onClick={doSearch} style={{position:"absolute",right:"6px",top:"50%",transform:"translateY(-50%)",background:"#E8FF47",border:"none",borderRadius:"2px",padding:"8px 14px",cursor:"pointer",fontFamily:"'Space Mono',monospace",fontWeight:"bold",fontSize:"11px",color:"#0a0a0a",whiteSpace:"nowrap"}}>SEARCH</button>
        </div>

        {/* Title + status */}
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:"12px",marginBottom:"16px"}}>
          <div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace",letterSpacing:"2px",marginBottom:"4px"}}>RESULTS FOR</div>
            <div style={{fontSize:"clamp(24px,7vw,40px)",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"3px",color:"#E8FF47",wordBreak:"break-word"}}>"{query}"</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"11px",fontFamily:"'Space Mono',monospace",color:"rgba(255,255,255,0.4)"}}>
              {allResults.length} result{allResults.length!==1?"s":""} · PAGE {page} OF {totalPages}
            </div>
            {aiLoading && (
              <div style={{fontSize:"10px",color:"rgba(232,255,71,0.5)",fontFamily:"'Space Mono',monospace",marginTop:"3px",animation:"pulse 1.4s infinite"}}>
                ● loading more results...
              </div>
            )}
          </div>
        </div>

        {/* Top pagination */}
        <Pagination total={allResults.length} page={page} onPage={goPage}/>

        {/* Grid */}
        {allResults.length === 0 && !aiLoading ? (
          <div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,0.35)",fontFamily:"'Space Mono',monospace",fontSize:"13px"}}>
            No results for "{query}" — try a different search
          </div>
        ) : allResults.length === 0 && aiLoading ? (
          /* Nothing local yet — show skeletons while AI loads */
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"14px",margin:"20px 0"}}>
            {Array(9).fill(0).map((_,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"4px",padding:"18px"}}>
                <Skeleton w="50%" h="10px" style={{marginBottom:"8px"}}/>
                <Skeleton w="85%" h="18px" style={{marginBottom:"6px"}}/>
                <Skeleton w="40%" h="10px" style={{marginBottom:"12px"}}/>
                <Skeleton w="100%" h="11px" style={{marginBottom:"5px"}}/>
                <Skeleton w="72%" h="11px" style={{marginBottom:"16px"}}/>
                <Skeleton w="28%" h="16px"/>
              </div>
            ))}
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"14px",margin:"20px 0"}}>
            {pageResults.map(s=>(
              <SearchCard key={s.id||s.name+s.colorway} sneaker={s} onOpen={onOpen}/>
            ))}
            {/* If AI still loading and we're on the last page, show a couple skeleton placeholders */}
            {aiLoading && page===totalPages && allResults.length>0 && Array(3).fill(0).map((_,i)=>(
              <div key={`sk${i}`} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"4px",padding:"18px",opacity:0.5}}>
                <Skeleton w="50%" h="10px" style={{marginBottom:"8px"}}/>
                <Skeleton w="85%" h="18px" style={{marginBottom:"6px"}}/>
                <Skeleton w="40%" h="10px" style={{marginBottom:"12px"}}/>
                <Skeleton w="100%" h="11px" style={{marginBottom:"16px"}}/>
                <Skeleton w="28%" h="16px"/>
              </div>
            ))}
          </div>
        )}

        {/* Bottom pagination */}
        {allResults.length > PAGE_SIZE && (
          <Pagination total={allResults.length} page={page} onPage={goPage}/>
        )}
      </div>
    </div>
  );
}
// ─── Retailer links ───────────────────────────────────────────────────
function getRetailers(sneaker, brand) {
  const q = encodeURIComponent(sneaker.name);
  const maps = {
    nike:          [{name:"Nike",        url:`https://www.nike.com/nl/search?q=${q}`},{name:"Foot Locker",url:`https://www.footlocker.eu/nl/search?query=${q}`},{name:"JD Sports",url:`https://www.jdsports.nl/search/${q}/`},{name:"End Clothing",url:`https://www.endclothing.com/nl/search?q=${q}`}],
    adidas:        [{name:"Adidas",      url:`https://www.adidas.nl/search?q=${q}`},{name:"Foot Locker",url:`https://www.footlocker.eu/nl/search?query=${q}`},{name:"JD Sports",url:`https://www.jdsports.nl/search/${q}/`},{name:"End Clothing",url:`https://www.endclothing.com/nl/search?q=${q}`}],
    "new-balance": [{name:"New Balance", url:`https://www.newbalance.eu/nl/search?q=${q}`},{name:"Foot Locker",url:`https://www.footlocker.eu/nl/search?query=${q}`},{name:"JD Sports",url:`https://www.jdsports.nl/search/${q}/`},{name:"Size?",url:`https://www.size.co.uk/search/?q=${q}`}],
    asics:         [{name:"ASICS",       url:`https://www.asics.com/nl/nl-nl/catalogsearch/result/?q=${q}`},{name:"Foot Locker",url:`https://www.footlocker.eu/nl/search?query=${q}`},{name:"JD Sports",url:`https://www.jdsports.nl/search/${q}/`},{name:"End Clothing",url:`https://www.endclothing.com/nl/search?q=${q}`}],
  };
  return maps[brand] || maps.nike;
}

// ─── AI modal fetch ───────────────────────────────────────────────────
async function fetchEncyclopedia(sneaker, brand) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:API_HEADERS,
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:600,
      system:"You are a sneaker encyclopedia. Respond with valid JSON only. No markdown.",
      messages:[{role:"user",content:
        `Entry for: ${sneaker.name}, ${sneaker.colorway}, ${brand}, year ${sneaker.year}.
JSON: {"history":"2-3 sentences origin and cultural impact","design":"2 sentences on materials and features","collab":"Notable collab or None","funFact":"One surprising fact","popularityScore":78,"sizes":"EU 36-48","releaseType":"General Release","available":true,"retailers":[{"name":"Store","url":"https://..."}]}
For available/retailers: if still in general retail circulation set true with 2-4 EU retailer links. If old/limited/sold out set false and empty array.`
      }],
    }),
  });
  const data = await res.json();
  const text = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error();
  return JSON.parse(m[0]);
}

// ─── Shared UI primitives ─────────────────────────────────────────────
function Skeleton({w="100%",h="14px",style={}}) {
  return <div style={{width:w,height:h,background:"rgba(255,255,255,0.07)",borderRadius:"3px",animation:"pulse 1.4s ease-in-out infinite",...style}}/>;
}
function Ticker() {
  const items=["🔥 Air Jordan 1 Chicago — icon of icons","🆕 Adidas Samba OG back in stock","📈 New Balance 990v6 trending","⚡ ASICS GT-2160 cult favourite","🏆 Most searched: Nike Dunk Low Panda","🌍 Yeezy 350 V2 Zebra — global archive entry","👟 200+ sneakers in the archive"];
  return <div style={{background:"#E8FF47",overflow:"hidden",padding:"9px 0",fontFamily:"'Space Mono',monospace",fontSize:"12px",fontWeight:"bold",color:"#0a0a0a",borderBottom:"2px solid #0a0a0a",userSelect:"none"}}><div style={{display:"flex",animation:"ticker 35s linear infinite",whiteSpace:"nowrap",gap:"80px"}}>{[...items,...items].map((t,i)=><span key={i}>{t}</span>)}</div></div>;
}
function Nav() {
  const [open,setOpen]=useState(false);
  return <nav style={{borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"56px",position:"sticky",top:0,background:"rgba(10,10,10,0.97)",backdropFilter:"blur(14px)",zIndex:200}}>
    <div style={{display:"flex",alignItems:"center",gap:"8px"}}><div style={{width:"26px",height:"26px",background:"#E8FF47",borderRadius:"2px",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:"12px",fontWeight:"bold",color:"#0a0a0a",fontFamily:"'Bebas Neue',sans-serif"}}>SA</span></div><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",letterSpacing:"3px",color:"#fff",whiteSpace:"nowrap"}}>SNEAKER ARCHIVE</span></div>
    <div className="desktop-nav" style={{display:"flex",gap:"20px",fontSize:"10px",color:"rgba(255,255,255,0.4)",letterSpacing:"1.5px"}}>{["ARCHIVE","RELEASES","RAFFLES","BRANDS"].map(n=><span key={n} style={{cursor:"pointer",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="#E8FF47"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{n}</span>)}</div>
    <button onClick={()=>setOpen(o=>!o)} className="mobile-menu-btn" style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:"20px",padding:"4px 8px",lineHeight:1}}>{open?"✕":"☰"}</button>
    {open&&<div style={{position:"absolute",top:"56px",left:0,right:0,background:"#111",borderBottom:"1px solid rgba(255,255,255,0.1)",zIndex:300}}>{["ARCHIVE","RELEASES","RAFFLES","BRANDS"].map(n=><div key={n} onClick={()=>setOpen(false)} style={{padding:"14px 20px",fontSize:"13px",fontFamily:"'Space Mono',monospace",color:"rgba(255,255,255,0.7)",letterSpacing:"2px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>{n}</div>)}</div>}
  </nav>;
}

// ─── Sneaker Card ─────────────────────────────────────────────────────
function SneakerCard({sneaker,brand,onOpen}) {
  const [hov,setHov]=useState(false);
  return <div role="button" tabIndex={0} onClick={()=>onOpen(sneaker,brand)} onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&onOpen(sneaker,brand)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:hov?"rgba(232,255,71,0.07)":"rgba(255,255,255,0.04)",border:hov?"1px solid #E8FF47":"1px solid rgba(255,255,255,0.1)",borderRadius:"4px",cursor:"pointer",transition:"border-color 0.2s,background 0.2s",outline:"none"}}>
    <div style={{position:"relative",paddingTop:"62%",background:"#111",borderRadius:"4px 4px 0 0",overflow:"hidden"}}>
      <SneakerImg name={sneaker.name} brand={brand} style={{position:"absolute",inset:0,width:"100%",height:"100%",transition:"transform 0.4s",transform:hov?"scale(1.05)":"scale(1)"}}/>
      <div style={{position:"absolute",top:"10px",left:"10px",background:"#E8FF47",color:"#0a0a0a",padding:"3px 8px",fontSize:"9px",fontFamily:"'Space Mono',monospace",fontWeight:"bold",borderRadius:"2px",pointerEvents:"none"}}>{sneaker.category}</div>
    </div>
    <div style={{padding:"14px 16px"}}>
      <div style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",fontFamily:"'Space Mono',monospace",marginBottom:"3px"}}>EST. {sneaker.year}</div>
      <div style={{fontSize:"clamp(13px,2.5vw,15px)",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"1px",color:"#fff",marginBottom:"3px",lineHeight:1.2}}>{sneaker.name}</div>
      <div style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",marginBottom:"12px",fontFamily:"'Space Mono',monospace"}}>{sneaker.colorway}</div>
      <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"10px"}}><div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace"}}>RETAIL PRICE</div><div style={{fontSize:"15px",color:"#E8FF47",fontFamily:"'Space Mono',monospace",fontWeight:"bold"}}>{sneaker.price}</div></div>
    </div>
  </div>;
}

// ─── Modal ────────────────────────────────────────────────────────────
function SneakerModal({sneaker,brand,onClose}) {
  const [ai,setAi]=useState(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);
  useEffect(()=>{
    setAi(null);setLoading(true);
    fetchEncyclopedia(sneaker,brand).then(d=>setAi(d)).catch(()=>setAi({history:`The ${sneaker.name} is one of the most iconic silhouettes in sneaker history.`,design:"Built with premium materials and the brand's signature cushioning technology.",collab:"None",funFact:`The ${sneaker.colorway} colourway is among the most sought-after in the model's archive.`,popularityScore:74,sizes:"EU 36–48",releaseType:"General Release",available:false,retailers:[]})).finally(()=>setLoading(false));
  },[sneaker.name]);
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:1000,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#111",maxWidth:"820px",width:"100%",margin:"0 auto",minHeight:"100vh"}}>
      <div style={{position:"relative",height:"260px",background:"#0a0a0a",overflow:"hidden"}}>
        <SneakerImg name={sneaker.name} brand={brand} style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.7}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,#111 15%,transparent 55%)"}}/>
        <button onClick={onClose} style={{position:"absolute",top:"14px",right:"14px",background:"rgba(0,0,0,0.7)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",width:"36px",height:"36px",borderRadius:"50%",cursor:"pointer",fontSize:"18px",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>×</button>
        <div style={{position:"absolute",top:"14px",left:"14px",background:"#E8FF47",color:"#0a0a0a",padding:"4px 10px",fontSize:"10px",fontFamily:"'Space Mono',monospace",fontWeight:"bold",borderRadius:"2px"}}>{sneaker.category}</div>
        <div style={{position:"absolute",bottom:"16px",left:"20px",right:"60px"}}>
          <div style={{fontSize:"10px",color:"rgba(255,255,255,0.5)",fontFamily:"'Space Mono',monospace",marginBottom:"4px"}}>{brand.replace("-"," ").toUpperCase()} · EST. {sneaker.year}</div>
          <div style={{fontSize:"clamp(22px,5vw,34px)",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"2px",color:"#fff",lineHeight:1.05}}>{sneaker.name}</div>
          <div style={{fontSize:"13px",color:"rgba(255,255,255,0.5)",fontFamily:"'Space Mono',monospace",marginTop:"3px"}}>{sneaker.colorway}</div>
        </div>
      </div>
      <div style={{padding:"20px 20px 48px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"24px"}}>
          {[{label:"RETAIL PRICE",value:sneaker.price,accent:true},{label:"POPULARITY",value:loading?"—":`${ai?.popularityScore??74}/100`,accent:false}].map(item=><div key={item.label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"4px",padding:"14px",textAlign:"center"}}><div style={{fontSize:"9px",color:"rgba(255,255,255,0.35)",fontFamily:"'Space Mono',monospace",marginBottom:"6px"}}>{item.label}</div><div style={{fontSize:"clamp(18px,4vw,22px)",fontFamily:"'Space Mono',monospace",fontWeight:"bold",color:item.accent?"#E8FF47":"#fff"}}>{item.value}</div></div>)}
        </div>
        {!loading&&(ai?.available&&ai?.retailers?.length>0?<div style={{marginBottom:"24px"}}><div style={{fontSize:"9px",color:"rgba(255,255,255,0.35)",fontFamily:"'Space Mono',monospace",letterSpacing:"2px",marginBottom:"10px"}}>WHERE TO BUY</div><div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>{ai.retailers.map(r=><a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{background:"rgba(232,255,71,0.08)",border:"1px solid rgba(232,255,71,0.3)",padding:"8px 14px",borderRadius:"2px",fontSize:"11px",fontFamily:"'Space Mono',monospace",color:"#E8FF47",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"6px"}}>{r.name}<span style={{fontSize:"9px",opacity:0.6}}>↗</span></a>)}</div></div>:<div style={{marginBottom:"24px",padding:"12px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"4px",display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontSize:"14px"}}>🗃️</span><span style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",fontFamily:"'Space Mono',monospace",lineHeight:1.5}}>This release is no longer available at retail. Check the secondary market or archive resellers.</span></div>)}
        {loading?<><div style={{marginBottom:"18px"}}><div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace",letterSpacing:"2px",marginBottom:"7px"}}>ORIGIN & HISTORY</div><Skeleton w="100%" h="13px" style={{marginBottom:"6px"}}/><Skeleton w="90%" h="13px" style={{marginBottom:"6px"}}/><Skeleton w="70%" h="13px"/></div><div style={{marginBottom:"18px"}}><div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace",letterSpacing:"2px",marginBottom:"7px"}}>DESIGN NOTES</div><Skeleton w="100%" h="13px" style={{marginBottom:"6px"}}/><Skeleton w="80%" h="13px"/></div></>:ai&&<><div style={{marginBottom:"18px"}}><div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace",letterSpacing:"2px",marginBottom:"7px"}}>ORIGIN & HISTORY</div><p style={{fontSize:"13px",color:"rgba(255,255,255,0.72)",fontFamily:"'Space Mono',monospace",lineHeight:1.72,margin:0}}>{ai.history}</p></div><div style={{marginBottom:"18px"}}><div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace",letterSpacing:"2px",marginBottom:"7px"}}>DESIGN NOTES</div><p style={{fontSize:"13px",color:"rgba(255,255,255,0.72)",fontFamily:"'Space Mono',monospace",lineHeight:1.72,margin:0}}>{ai.design}</p></div><div style={{marginBottom:"18px"}}><div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace",letterSpacing:"2px",marginBottom:"7px"}}>COLLABORATIONS</div><p style={{fontSize:"13px",color:"rgba(255,255,255,0.72)",fontFamily:"'Space Mono',monospace",lineHeight:1.72,margin:0}}>{ai.collab}</p></div><div style={{background:"rgba(232,255,71,0.06)",border:"1px solid rgba(232,255,71,0.18)",borderRadius:"4px",padding:"14px 16px",marginBottom:"20px"}}><div style={{fontSize:"9px",color:"#E8FF47",fontFamily:"'Space Mono',monospace",fontWeight:"bold",marginBottom:"6px"}}>⚡ FUN FACT</div><div style={{fontSize:"13px",color:"rgba(255,255,255,0.78)",fontFamily:"'Space Mono',monospace",lineHeight:1.65}}>{ai.funFact}</div></div><div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>{[{l:"SIZES",v:ai.sizes},{l:"RELEASE TYPE",v:ai.releaseType}].map(p=><div key={p.l} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"2px",padding:"8px 14px",display:"flex",gap:"10px",alignItems:"center"}}><span style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace"}}>{p.l}</span><span style={{fontSize:"12px",color:"#fff",fontFamily:"'Space Mono',monospace",fontWeight:"bold"}}>{p.v}</span></div>)}</div></>}
      </div>
    </div>
  </div>;
}

// ─── Pagination ───────────────────────────────────────────────────────
function PagBtn({children,onClick,disabled,active,loading}) {
  const [hov,setHov]=useState(false);
  return <button onClick={disabled?undefined:onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:active?"#E8FF47":hov&&!disabled?"rgba(232,255,71,0.1)":"rgba(255,255,255,0.05)",border:active?"1px solid #E8FF47":"1px solid rgba(255,255,255,0.12)",color:active?"#0a0a0a":disabled?"rgba(255,255,255,0.2)":"#fff",fontFamily:"'Space Mono',monospace",fontSize:"10px",fontWeight:"bold",padding:"8px 12px",borderRadius:"2px",cursor:disabled?"default":"pointer",transition:"all 0.15s",letterSpacing:"1px",whiteSpace:"nowrap"}}>{loading?"...":children}</button>;
}
function Pagination({total,page,onPage}) {
  const totalPages=Math.ceil(total/PAGE_SIZE);
  if(totalPages<=1) return null;
  function window() {
    if(totalPages<=9) return Array.from({length:totalPages},(_,i)=>i+1);
    const set=new Set([1,totalPages,page-2,page-1,page,page+1,page+2].filter(n=>n>=1&&n<=totalPages));
    const sorted=[...set].sort((a,b)=>a-b);
    const out=[];
    for(let i=0;i<sorted.length;i++){if(i>0&&sorted[i]-sorted[i-1]>1)out.push("...");out.push(sorted[i]);}
    return out;
  }
  return <div style={{display:"flex",gap:"6px",flexWrap:"wrap",alignItems:"center"}}>
    <PagBtn disabled={page===1} onClick={()=>onPage(page-1)}>← PREV</PagBtn>
    {window().map((p,i)=>p==="..."?<span key={`e${i}`} style={{color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace",fontSize:"12px",padding:"0 4px"}}>…</span>:<PagBtn key={p} active={p===page} onClick={()=>onPage(p)}>{p}</PagBtn>)}
    <PagBtn disabled={page>=totalPages} onClick={()=>onPage(page+1)}>NEXT →</PagBtn>
  </div>;
}


// ─── Brand grid section ───────────────────────────────────────────────
const FEATURED = {
  adidas: DB.filter(s=>s.brand==="adidas").slice(0,4),
  nike:   DB.filter(s=>s.brand==="nike").slice(0,4),
  "new-balance": DB.filter(s=>s.brand==="new-balance").slice(0,4),
  asics:  DB.filter(s=>s.brand==="asics").slice(0,4),
};

// ─── Root ──────────────────────────────────────────────────────────────
export default function App() {
  const [activeBrand,setActiveBrand]=useState("adidas");
  const [modal,setModal]=useState(null);
  const [query,setQuery]=useState("");
  const [searching,setSearching]=useState(false);
  const [heroIdx,setHeroIdx]=useState(0);

  useEffect(()=>{const t=setInterval(()=>setHeroIdx(i=>(i+1)%HERO_IMGS.length),5000);return()=>clearInterval(t);},[]);

  const currentBrand=BRANDS.find(b=>b.id===activeBrand);
  const sneakers=FEATURED[activeBrand]||[];

  function handleSearch(q){if(!q.trim())return;setQuery(q);setSearching(true);}

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html{-webkit-text-size-adjust:100%;}
      body{background:#0a0a0a;}
      @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.8}}
      ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0a0a0a}::-webkit-scrollbar-thumb{background:#E8FF47;border-radius:2px}
      input::placeholder{color:rgba(255,255,255,0.28)}input{-webkit-appearance:none}
      @media(min-width:640px){.desktop-nav{display:flex!important}.mobile-menu-btn{display:none!important}}
      @media(max-width:639px){.desktop-nav{display:none!important}.mobile-menu-btn{display:flex!important}}
    `}</style>
    <div style={{minHeight:"100vh",background:"#0a0a0a",color:"#fff"}}>
      <Nav/>
      <Ticker/>
      {/* Hero */}
      <div style={{position:"relative",minHeight:"480px",overflow:"hidden"}}>
        {HERO_IMGS.map((src,i)=><img key={src} src={src} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:i===heroIdx?0.3:0,transition:"opacity 1.2s ease"}}/>)}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(10,10,10,0.6) 0%,rgba(10,10,10,0.75) 60%,#0a0a0a 100%)"}}/>
        <div style={{position:"relative",zIndex:1,minHeight:"480px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 20px 40px",textAlign:"center"}}>
          <div style={{fontSize:"clamp(9px,2vw,11px)",letterSpacing:"4px",color:"#E8FF47",marginBottom:"14px",fontFamily:"'Space Mono',monospace"}}>THE DEFINITIVE SNEAKER ENCYCLOPEDIA</div>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(52px,14vw,108px)",letterSpacing:"clamp(2px,1.5vw,8px)",lineHeight:0.88,marginBottom:"12px",color:"#fff"}}>SNEAKER<br/><span style={{color:"#E8FF47"}}>ARCHIVE</span></h1>
          <p style={{fontSize:"clamp(11px,2.5vw,13px)",color:"rgba(255,255,255,0.4)",marginBottom:"28px",maxWidth:"420px",fontFamily:"'Space Mono',monospace",lineHeight:1.6}}>Nike · Adidas · New Balance · ASICS<br/>Every drop, every story.</p>
          <div style={{width:"100%",maxWidth:"620px",position:"relative"}}>
            <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch(query)} placeholder="Search 200+ sneakers instantly..."
              style={{width:"100%",padding:"15px 100px 15px 18px",background:"rgba(255,255,255,0.08)",border:"2px solid rgba(255,255,255,0.18)",borderRadius:"4px",color:"#fff",fontSize:"clamp(13px,3vw,15px)",fontFamily:"'Space Mono',monospace",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"}}
              onFocus={e=>e.target.style.borderColor="#E8FF47"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.18)"}/>
            <button onClick={()=>handleSearch(query)} style={{position:"absolute",right:"6px",top:"50%",transform:"translateY(-50%)",background:"#E8FF47",border:"none",borderRadius:"2px",padding:"8px 14px",cursor:"pointer",fontFamily:"'Space Mono',monospace",fontWeight:"bold",fontSize:"11px",color:"#0a0a0a",whiteSpace:"nowrap"}}>SEARCH</button>
          </div>
          <div style={{marginTop:"12px",fontSize:"10px",color:"rgba(255,255,255,0.25)",fontFamily:"'Space Mono',monospace",lineHeight:1.8}}>Try: "Jordan 1" · "Samba" · "990" · "Gel-Kayano" · "Dunk"</div>
        </div>
      </div>
      {/* Brand tabs */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
        {BRANDS.map(b=><button key={b.id} onClick={()=>setActiveBrand(b.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"16px clamp(14px,3vw,28px)",fontSize:"clamp(10px,2.5vw,13px)",fontFamily:"'Space Mono',monospace",fontWeight:"bold",letterSpacing:"1.5px",whiteSpace:"nowrap",transition:"color 0.2s",color:activeBrand===b.id?"#E8FF47":"rgba(255,255,255,0.32)",borderBottom:activeBrand===b.id?"2px solid #E8FF47":"2px solid transparent",flexShrink:0}}>{b.name.toUpperCase()}</button>)}
      </div>
      {/* Brand section */}
      <div style={{padding:"clamp(24px,5vw,44px) clamp(16px,4vw,32px) 24px",maxWidth:"1200px",margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:"12px",marginBottom:"4px",flexWrap:"wrap"}}>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(32px,7vw,52px)",letterSpacing:"4px",color:"#E8FF47"}}>{currentBrand?.name.toUpperCase()}</h2>
          <span style={{fontSize:"10px",color:"rgba(255,255,255,0.28)",letterSpacing:"1.5px",fontFamily:"'Space Mono',monospace"}}>FOUNDED {currentBrand?.founded} · {currentBrand?.country}</span>
        </div>
        <p style={{fontSize:"12px",color:"rgba(255,255,255,0.38)",marginBottom:"24px",fontFamily:"'Space Mono',monospace"}}>Showing highlights — search to browse all {DB.filter(s=>s.brand===activeBrand).length} {currentBrand?.name} entries</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,240px),1fr))",gap:"clamp(10px,2.5vw,18px)"}}>
          {sneakers.map((s,i)=><SneakerCard key={i} sneaker={s} brand={activeBrand} onOpen={(sn,br)=>setModal({sneaker:sn,brand:br})}/>)}
        </div>
      </div>
      {/* Stats */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",marginTop:"40px",padding:"clamp(20px,4vw,32px) clamp(16px,4vw,32px)",background:"rgba(255,255,255,0.02)"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:"20px",textAlign:"center"}}>
          {[{l:"SNEAKERS INDEXED",v:`${DB.length}+`},{l:"BRANDS COVERED",v:"4"},{l:"COLORWAYS",v:`${DB.length}+`},{l:"ARCHIVE ENTRIES",v:`${DB.length}+`}].map(s=><div key={s.l}><div style={{fontSize:"clamp(22px,5vw,32px)",fontFamily:"'Bebas Neue',sans-serif",color:"#E8FF47",letterSpacing:"2px"}}>{s.v}</div><div style={{fontSize:"9px",color:"rgba(255,255,255,0.28)",letterSpacing:"1.5px",marginTop:"4px",fontFamily:"'Space Mono',monospace"}}>{s.l}</div></div>)}
        </div>
      </div>
      <footer style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"24px 20px",textAlign:"center"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"16px",letterSpacing:"4px",color:"rgba(255,255,255,0.18)",marginBottom:"6px"}}>SNEAKER ARCHIVE</div>
        <div style={{fontSize:"10px",color:"rgba(255,255,255,0.18)",fontFamily:"'Space Mono',monospace"}}>Coming soon: App · Release Calendar · Raffle Tracker</div>
      </footer>
    </div>
    {modal&&<SneakerModal sneaker={modal.sneaker} brand={modal.brand} onClose={()=>setModal(null)}/>}
    {searching&&<SearchOverlay query={query} onClose={()=>setSearching(false)} onOpen={(sn,br)=>{setModal({sneaker:sn,brand:br});}} onNewSearch={q=>{setQuery(q);setSearching(true);}}/>}
  </>;
}
