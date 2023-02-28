import { useMediaQuery, usePrefersReducedMotion } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { loadFull } from "tsparticles";
import type { Engine, ISourceOptions } from "tsparticles-engine";

const DynamicParticles = dynamic(() => import("react-tsparticles"));

export default function AnimatedBg() {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isLargerThan500] = useMediaQuery("(min-width: 500px)", {
        ssr: true,
        fallback: false
    });

    const particlesInit = useCallback((engine: Engine) => loadFull(engine), []);

    return prefersReducedMotion || !isLargerThan500 ? null : (
        <DynamicParticles init={particlesInit} options={config} />
    );
}

const config: ISourceOptions = {
    background: {
        color: {
            value: "transparent"
        }
    },
    fpsLimit: 90,
    interactivity: {
        detectsOn: "canvas",
        events: {
            onClick: {
                enable: true,
                mode: ["push", "repulse"]
            },
            onHover: {
                enable: true,
                mode: "grab"
            },
            resize: true
        },
        modes: {
            push: {
                quantity: 4
            },
            repulse: {
                distance: 200,
                duration: 1,
                speed: 2
            },
            grab: {
                distance: 100
            }
        }
    },
    particles: {
        color: {
            value: [
                "#000d21",
                "#002551",
                "#003d82",
                "#0056b4",
                "#006fe6",
                "#1a88ff",
                "#4aa3ff",
                "#7dbdff",
                "#aed7ff",
                "#dcf3ff"
            ]
        },
        links: {
            color: "#1a88ff",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1
        },
        collisions: {
            enable: true
        },
        move: {
            direction: "top",
            enable: true,
            outMode: "out",
            random: true,
            speed: 0.8,
            straight: false
        },
        number: {
            density: {
                enable: true,
                area: 1200
            },
            value: 100
        },
        opacity: {
            value: 0.15
        },
        shape: {
            type: "circle",
            polygon: {
                nb_sides: 5
            }
        },
        size: {
            value: { min: 1, max: 1.5 }
        }
    },
    detectRetina: true
};
