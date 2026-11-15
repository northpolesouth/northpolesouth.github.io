// Gentle snowfall. Off for visitors who prefer reduced motion.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.id = "nps-snow";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var flakes = [];
  var w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeFlake(startAtTop) {
    return {
      x: Math.random() * w,
      y: startAtTop ? -10 : Math.random() * h,
      r: 1 + Math.random() * 2.5,
      speed: 0.3 + Math.random() * 0.8,
      drift: Math.random() * Math.PI * 2
    };
  }

  resize();
  window.addEventListener("resize", resize);
  var count = Math.min(60, Math.round(w / 20));
  for (var i = 0; i < count; i++) flakes.push(makeFlake(false));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(170, 190, 215, 0.75)";
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.speed;
      f.drift += 0.01;
      f.x += Math.sin(f.drift) * 0.4;
      if (f.y > h + 10) flakes[i] = makeFlake(true);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!document.hidden) requestAnimationFrame(draw);
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) requestAnimationFrame(draw);
  });
  requestAnimationFrame(draw);
})();
