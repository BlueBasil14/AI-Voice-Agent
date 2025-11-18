import confetti from 'canvas-confetti';

export function celebrateBooking() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Green and orange confetti (brand colors)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#4ADE80', '#FB923C', '#60A5FA', '#A78BFA'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#4ADE80', '#FB923C', '#60A5FA', '#A78BFA'],
    });
  }, 250);
}

export function celebrateCallSuccess() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4ADE80', '#60A5FA'],
    zIndex: 10000,
  });
}

export function fireEmoji() {
  const scalar = 2;
  const emoji = confetti.shapeFromText({ text: '🎉', scalar });

  confetti({
    shapes: [emoji],
    particleCount: 30,
    spread: 100,
    origin: { y: 0.6 },
    scalar,
    zIndex: 10000,
  });
}
