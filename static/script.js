/* Hero animation: three cloud hubs (AWS, Azure, Google Cloud) orbiting an AI core.
   Small nodes drift around each hub and lean away from the cursor. */
(() => {
  const canvas = document.getElementById("field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const HUBS = [
    { label: "AWS", color: "#3b82f6", phase: 0 },
    { label: "Azure", color: "#6366f1", phase: (Math.PI * 2) / 3 },
    { label: "Google Cloud", color: "#a855f7", phase: (Math.PI * 4) / 3 },
  ];

  let w = 0, h = 0, cx = 0, cy = 0, orbit = 0, t = 0;
  const mouse = { x: -9999, y: -9999 };
  let nodes = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const wide = w > 860;
    cx = wide ? w * 0.68 : w * 0.5;
    cy = wide ? h * 0.5 : h * 0.32;
    orbit = Math.min(w, h) * (wide ? 0.27 : 0.2);

    const count = w < 600 ? 45 : 90;
    nodes = Array.from({ length: count }, (_, i) => ({
      hub: i % HUBS.length,
      angle: Math.random() * Math.PI * 2,
      radius: 26 + Math.random() * (orbit * 0.42),
      speed: (0.15 + Math.random() * 0.35) * (Math.random() < 0.5 ? -1 : 1),
      size: 1 + Math.random() * 1.8,
      ox: 0, oy: 0, x: 0, y: 0,
    }));
    if (reduceMotion) draw();
  }

  function hubPos(i) {
    const a = HUBS[i].phase + t * 0.00018;
    return { x: cx + Math.cos(a) * orbit, y: cy + Math.sin(a) * orbit * 0.78 };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const pos = HUBS.map((_, i) => hubPos(i));

    // Links from each hub to the AI core.
    pos.forEach((p, i) => {
      const g = ctx.createLinearGradient(cx, cy, p.x, p.y);
      g.addColorStop(0, "rgba(255,255,255,0.35)");
      g.addColorStop(1, HUBS[i].color + "88");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke();
    });

    // Update and draw small nodes.
    for (const n of nodes) {
      n.angle += n.speed * 0.004;
      const hp = pos[n.hub];
      let x = hp.x + Math.cos(n.angle) * n.radius;
      let y = hp.y + Math.sin(n.angle) * n.radius * 0.8;

      const dx = x - mouse.x, dy = y - mouse.y;
      const d = Math.hypot(dx, dy);
      const push = d < 120 ? (1 - d / 120) * 26 : 0;
      const tx = d ? (dx / d) * push : 0;
      const ty = d ? (dy / d) * push : 0;
      n.ox += (tx - n.ox) * 0.08;
      n.oy += (ty - n.oy) * 0.08;
      n.x = x + n.ox;
      n.y = y + n.oy;
    }

    // Faint web between nearby nodes.
    ctx.lineWidth = 0.6;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 55) {
          ctx.strokeStyle = `rgba(140,150,255,${(1 - d / 55) * 0.35})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = HUBS[n.hub].color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Hubs.
    pos.forEach((p, i) => {
      const c = HUBS[i].color;
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 46);
      glow.addColorStop(0, c + "aa");
      glow.addColorStop(1, c + "00");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.x, p.y, 46, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#c9cce6";
      ctx.font = '500 13px "Instrument Sans", system-ui, sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(HUBS[i].label, p.x, p.y + 28);
    });

    // AI core.
    const pulse = reduceMotion ? 0 : Math.sin(t * 0.002) * 6;
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70 + pulse);
    core.addColorStop(0, "rgba(255,255,255,0.9)");
    core.addColorStop(0.25, "rgba(168,85,247,0.55)");
    core.addColorStop(1, "rgba(59,130,246,0)");
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(cx, cy, 70 + pulse, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#05050f";
    ctx.font = '800 15px "Bricolage Grotesque", system-ui, sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("AI", cx, cy + 5);
  }

  function loop(ts) {
    t = ts;
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  canvas.parentElement.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });

  resize();
  if (!reduceMotion) requestAnimationFrame(loop);
})();

/* Contact form */
(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const button = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "";
    status.textContent = "";
    button.disabled = true;

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (data.ok) {
        status.className = "ok";
        status.textContent = "Message sent. Thanks for reaching out.";
        form.reset();
      } else {
        status.className = "err";
        status.textContent = data.error || "Could not send the message. Try again.";
      }
    } catch (err) {
      status.className = "err";
      status.textContent = "No connection to the server. Check it is running and try again.";
    } finally {
      button.disabled = false;
    }
  });
})();
