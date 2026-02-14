"use client";

import { useEffect, useRef } from "react";

export default function LiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles: Particle[] = [];

        // Configuration
        const particleCount = 60;
        const connectionDistance = 150;
        const mouseDistance = 200;

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update(mouse: { x: number; y: number }) {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    const directionX = forceDirectionX * force * 0.05;
                    const directionY = forceDirectionY * force * 0.05;
                    this.vx += directionX;
                    this.vy += directionY;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let mouse = { x: -1000, y: -1000 };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach(p => {
                p.update(mouse);
                p.draw();
            });

            // Draw connections
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            ctx.lineWidth = 1;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    );
}
