"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CursorFollower() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [click, setClick] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over clickable element
            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === "pointer" ||
                target.tagName === "BUTTON" ||
                target.tagName === "A"
            );
        };
        const mouseDown = () => setClick(true);
        const mouseUp = () => setClick(false);

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mousedown", mouseDown);
        window.addEventListener("mouseup", mouseUp);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mouseup", mouseUp);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-amber-400 pointer-events-none z-[9999] hidden md:block"
            animate={{
                x: mousePosition.x - 16,
                y: mousePosition.y - 16,
                scale: click ? 0.8 : (isPointer ? 1.5 : 1),
                opacity: 0.6,
                backgroundColor: click ? "rgba(251, 191, 36, 1)" : (isPointer ? "rgba(251, 191, 36, 0.2)" : "transparent")
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.5
            }}
        />
    );
}
