import React, { useEffect, useRef } from "react";
import { getMoodClass } from "../utils/moodUtils";

const WEATHER_CONFIG = {
  "mood-happy": {
    // Happy (vui vẻ)
    type: "sunny",
    particleCount: 150,
    colors: [
      "#FFD700", // Gold
      "#FFA500", // Orange
      "#FFFF00", // Yellow
      "#FFE4B5", // Moccasin
    ],
    backgroundColor: "rgba(255, 248, 220, 0.15)",
  },
  "mood-sad": {
    // Sad (buồn bã)
    type: "rain",
    particleCount: 200,
    colors: [
      "#4682B4", // Steel Blue
      "#87CEEB", // Sky Blue
      "#B0C4DE", // Light Steel Blue
    ],
    backgroundColor: "rgba(169, 169, 169, 0.25)",
  },
  "mood-angry": {
    // Disappointed (thất vọng)
    type: "storm",
    particleCount: 120,
    colors: [
      "#4169E1", // Royal Blue
      "#191970", // Midnight Blue
      "#483D8B", // Dark Slate Blue
    ],
    backgroundColor: "rgba(47, 79, 79, 0.35)",
    lightningFrequency: 3000,
  },
  "mood-peaceful": {
    // Calm (bình yên)
    type: "clouds",
    particleCount: 12,
    colors: [
      "#FFFFFF", // White
      "#F0F8FF", // Alice Blue
      "#F5F5F5", // White Smoke
    ],
    backgroundColor: "rgba(135, 206, 235, 0.15)",
  },
  "mood-anxious": {
    type: "storm",
    particleCount: 150,
    colors: [
      "#708090", // Slate Gray
      "#2F4F4F", // Dark Slate Gray
      "#778899", // Light Slate Gray
    ],
    backgroundColor: "rgba(47, 79, 79, 0.2)",
    lightningFrequency: 1500, // More frequent lightning for anxiety
  },
  "😌": {
    // Calm (bình yên)
    type: "clouds",
    particleCount: 8,
    colors: ["#FFFFFF", "#F0F8FF"], // White, Light blue
    backgroundColor: "rgba(135, 206, 235, 0.2)", // Soft blue background
  },
  "🤩": {
    // Excited (hào hứng)
    type: "fireworks",
    particleCount: 150,
    colors: ["#FF0000", "#FFD700", "#4169E1", "#FF1493"], // Multiple vibrant colors
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Dark transparent background
  },
};

class Particle {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.color =
      config.colors[Math.floor(Math.random() * config.colors.length)];
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.opacity = Math.random();
    this.life = 1;
    this.color =
      this.config.colors[Math.floor(Math.random() * this.config.colors.length)];

    let angle, distance;

    switch (this.config.type) {
      case "rain":
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.speedX = Math.random() * 2 - 1; // More natural rain movement
        this.speedY = Math.random() * 9 + 7; // Faster rain
        this.size = Math.random() * 1.5 + 0.5; // Thinner raindrops
        break;
      case "storm":
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.speedX = Math.random() * 5 - 2.5; // More dramatic wind effect
        this.speedY = Math.random() * 15 + 12; // Faster storm
        this.size = Math.random() * 2 + 0.5;
        break;
      case "sunny":
        angle = Math.random() * Math.PI * 2;
        distance = Math.random() * 150 + 50; // Larger sun radius
        this.x = this.canvas.width / 2 + Math.cos(angle) * distance;
        this.y = this.canvas.height / 2 + Math.sin(angle) * distance;
        this.size = Math.random() * 4 + 2; // Larger particles
        break;
      case "fireworks":
        if (!this.explosion) {
          this.x = Math.random() * this.canvas.width;
          this.y = this.canvas.height;
          this.speedX = Math.random() * 6 - 3;
          this.speedY = -Math.random() * 15 - 10;
          this.size = 2;
        }
        break;
      case "clouds":
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * (this.canvas.height / 3); // Clouds only in top third
        this.size = Math.random() * 80 + 40; // Larger clouds
        this.speedX = Math.random() * 0.3 + 0.1; // Slower cloud movement
        break;
    }
  }

  update() {
    let angle;

    switch (this.config.type) {
      case "rain":
      case "storm":
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > this.canvas.height) {
          this.reset();
        }
        break;
      case "sunny":
        angle = Math.atan2(
          this.y - this.canvas.height / 2,
          this.x - this.canvas.width / 2
        );
        this.x += Math.cos(angle) * 0.5;
        this.y += Math.sin(angle) * 0.5;
        this.opacity = Math.sin(Date.now() / 1000 + this.x) * 0.5 + 0.5;
        break;
      case "fireworks":
        if (!this.explosion) {
          this.speedY += 0.2; // Gravity
          if (this.speedY >= 0) {
            this.explosion = true;
            this.createExplosion();
          }
        } else {
          this.life -= 0.02;
          this.opacity = this.life;
          if (this.life <= 0) {
            this.reset();
            this.explosion = false;
          }
        }
        this.x += this.speedX;
        this.y += this.speedY;
        break;
      case "clouds":
        this.x += this.speedX;
        if (this.x > this.canvas.width + this.size) {
          this.x = -this.size;
        }
        break;
    }
  }

  createExplosion() {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: this.x,
        y: this.y,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        color: this.color,
        size: Math.random() * 2 + 1,
        life: 1,
      });
    }
    return particles;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    let gradient;
    let length;

    switch (this.config.type) {
      case "rain":
      case "storm":
        length = this.config.type === "storm" ? 20 : 15;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x + this.speedX * (length / this.speedY),
          this.y + length
        );
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.stroke();
        break;
      case "sunny":
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
        break;
      case "fireworks":
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        break;
      case "clouds":
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(
          this.x + this.size * 0.35,
          this.y - this.size * 0.2,
          this.size * 0.3,
          Math.PI * 1,
          Math.PI * 2
        );
        ctx.arc(
          this.x + this.size * 0.7,
          this.y,
          this.size * 0.4,
          Math.PI * 1.5,
          Math.PI * 0.5
        );
        ctx.closePath();
        gradient = ctx.createLinearGradient(
          this.x,
          this.y - this.size,
          this.x,
          this.y + this.size
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.6)");
        ctx.fillStyle = gradient;
        ctx.fill();
        break;
    }

    ctx.restore();
  }
}

const WeatherEffect = ({ mood }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();
  const lightningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const moodClass = getMoodClass(mood);
    const config = WEATHER_CONFIG[moodClass] || WEATHER_CONFIG["mood-peaceful"];

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Initialize particles
    particlesRef.current = Array(config.particleCount)
      .fill(null)
      .map(() => new Particle(canvas, config));

    // Lightning effect for storm
    let lastLightning = Date.now();
    const createLightning = () => {
      if (
        config.type === "storm" &&
        Date.now() - lastLightning > config.lightningFrequency
      ) {
        lightningRef.current = true;
        lastLightning = Date.now();
        setTimeout(() => {
          lightningRef.current = false;
        }, 100);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw lightning effect
      if (lightningRef.current) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      createLightning();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mood]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

export default WeatherEffect;
