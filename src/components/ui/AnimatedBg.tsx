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
    infection: {
        cure: false,
        delay: 0,
        enable: false,
        infections: 0,
        stages: []
    },
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
                mode: "repulse"
            },
            onHover: {
                enable: true,
                mode: "grab"
            },
            resize: true
        },
        modes: {
            attract: {
                distance: 200,
                duration: 0.4,
                speed: 1
            },
            bounce: {
                distance: 200
            },
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40
            },
            connect: {
                distance: 80,
                links: {
                    opacity: 0.5
                },
                radius: 60
            },
            grab: {
                distance: 100,
                links: {
                    blink: false,
                    consent: false,
                    opacity: 1
                }
            },
            light: {
                area: {
                    gradient: {
                        start: {
                            value: "#ffffff"
                        },
                        stop: {
                            value: "#000000"
                        }
                    },
                    radius: 1000
                },
                shadow: {
                    color: {
                        value: "#000000"
                    },
                    length: 2000
                }
            },
            push: {
                quantity: 4
            },
            remove: {
                quantity: 2
            },
            repulse: {
                distance: 200,
                duration: 0.4,
                speed: 1
            },
            slow: {
                factor: 3,
                radius: 200
            },
            trail: {
                delay: 1,
                quantity: 1
            }
        }
    },
    particles: {
        // color: {
        //     value: [
        //         "#000d21",
        //         "#002551",
        //         "#003d82",
        //         "#0056b4",
        //         "#006fe6",
        //         "#1a88ff",
        //         "#4aa3ff",
        //         "#7dbdff",
        //         "#aed7ff",
        //         "#dcf3ff"
        //     ]
        // },
        // links: {
        //     color: "#1a88ff",
        //     distance: 150,
        //     enable: true,
        //     opacity: 0.2,
        //     width: 1
        // },
        bounce: {
            horizontal: {
                random: {
                    enable: false,
                    minimumValue: 0.1
                },
                value: 1
            },
            vertical: {
                random: {
                    enable: false,
                    minimumValue: 0.1
                },
                value: 1
            }
        },
        collisions: {
            bounce: {
                horizontal: {
                    random: {
                        enable: false,
                        minimumValue: 0.1
                    },
                    value: 1
                },
                vertical: {
                    random: {
                        enable: false,
                        minimumValue: 0.1
                    },
                    value: 1
                }
            },
            enable: true,
            mode: "bounce"
        },
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
            ],
            animation: {
                enable: false,
                speed: 1,
                sync: true
            }
        },
        life: {
            count: 0,
            delay: {
                random: {
                    enable: false,
                    minimumValue: 0
                },
                value: 0,
                sync: false
            },
            duration: {
                random: {
                    enable: false,
                    minimumValue: 0.0001
                },
                value: 0,
                sync: false
            }
        },
        links: {
            blink: false,
            color: {
                value: "#1a88ff"
            },
            consent: false,
            distance: 150,
            enable: true,
            frequency: 1,
            opacity: 0.2,
            shadow: {
                blur: 5,
                color: {
                    value: "#00ff00"
                },
                enable: false
            },
            triangles: {
                enable: false,
                frequency: 1
            },
            width: 1,
            warp: false
        },
        move: {
            attract: {
                enable: false,
                rotate: {
                    x: 3000,
                    y: 3000
                }
            },
            direction: "top",
            distance: 0,
            enable: true,
            gravity: {
                acceleration: 9.81,
                enable: false,
                maxSpeed: 20
            },
            noise: {
                delay: {
                    random: {
                        enable: false,
                        minimumValue: 0
                    },
                    value: 0
                },
                enable: false
            },
            outMode: "out",
            random: false,
            size: false,
            speed: 0.5,
            straight: false,
            trail: {
                enable: false,
                length: 10,
                fillColor: {
                    value: "#000000"
                }
            },
            vibrate: false,
            warp: false
        },
        number: {
            density: {
                enable: true,
                area: 800,
                factor: 1000
            },
            limit: 0,
            value: 80
        },
        opacity: {
            random: {
                enable: false,
                minimumValue: 0.1
            },
            value: 0.2,
            animation: {
                enable: false,
                minimumValue: 0,
                speed: 2,
                sync: false
            }
        },
        reduceDuplicates: false,
        rotate: {
            random: {
                enable: false,
                minimumValue: 0
            },
            value: 0,
            animation: {
                enable: false,
                speed: 0,
                sync: false
            },
            direction: "clockwise",
            path: false
        },
        shadow: {
            blur: 0,
            color: {
                value: "#000000"
            },
            enable: false,
            offset: {
                x: 0,
                y: 0
            }
        },
        shape: {
            options: {},
            type: "circle"
        },
        size: {
            random: {
                enable: true,
                minimumValue: 1
            },
            value: 1.5,
            animation: {
                destroy: "none",
                enable: false,
                minimumValue: 0,
                speed: 5,
                startValue: "max",
                sync: false
            }
        },
        stroke: {
            width: 0
        },
        twinkle: {
            lines: {
                enable: false,
                frequency: 0.05,
                opacity: 1
            },
            particles: {
                enable: false,
                frequency: 0.05,
                opacity: 1
            }
        }
    },
    motion: {
        disable: false,
        reduce: {
            factor: 4,
            value: false
        }
    },
    detectRetina: true
};
