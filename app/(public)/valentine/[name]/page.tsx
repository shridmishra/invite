"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Pencil, Save, X, ArrowLeft } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getInvite, createInvite, updateInvite } from "@/app/actions";
import { useSession } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ValentinePage({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const [name, setName] = useState<string>("");
    const [yesClicked, setYesClicked] = useState(false);
    const [whyClicked, setWhyClicked] = useState(false);
    const [familyClicked, setFamilyClicked] = useState(false);
    const [isEscaping, setIsEscaping] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const noButtonRef = useRef<HTMLButtonElement>(null);
    const { data: session } = useSession();
    const router = useRouter();
    const [inviteData, setInviteData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [originalName, setOriginalName] = useState("");
    const [originalMessage, setOriginalMessage] = useState<string | null>(null);

    // Motion values for smooth animation
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    const [customMessage, setCustomMessage] = useState<string | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("edit") === "true") {
            setIsEditing(true);
        }
    }, [searchParams]);

    useEffect(() => {
        // Attempt to fetch invite by slug (name)
        const fetchInvite = async () => {
            const resolvedParams = await params;
            const slugOrName = decodeURIComponent(resolvedParams.name);

            try {
                const invite = await getInvite(slugOrName);

                if (invite) {
                    setInviteData(invite);
                    setName(invite.recipientName);
                    setOriginalName(invite.recipientName);
                    if (invite.message) {
                        setCustomMessage(invite.message);
                        setOriginalMessage(invite.message);
                    }
                } else {
                    // Fallback: It's just a name
                    const cleanName = slugOrName.charAt(0).toUpperCase() + slugOrName.slice(1).toLowerCase();
                    setName(cleanName);
                    setOriginalName(cleanName);
                }
            } catch (e) {
                // Fallback if fetch fails (e.g. rate limit or network)
                const resolvedParams = await params;
                const decodedName = decodeURIComponent(resolvedParams.name).charAt(0).toUpperCase() + decodeURIComponent(resolvedParams.name).slice(1).toLowerCase();
                setName(decodedName);
                setOriginalName(decodedName);
            }
        };
        fetchInvite();
    }, [params]);

    const moveAwayFromMouse = useCallback((mouseX: number, mouseY: number) => {
        if (!noButtonRef.current || !containerRef.current) return;

        const button = noButtonRef.current.getBoundingClientRect();

        // Use viewport dimensions for bounds
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 20; // Keep some padding from edges

        // Calculate button center
        const buttonCenterX = button.left + button.width / 2;
        const buttonCenterY = button.top + button.height / 2;

        // Calculate direction away from mouse
        const deltaX = buttonCenterX - mouseX;
        const deltaY = buttonCenterY - mouseY;

        // Normalize and scale the movement
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance === 0) return;

        const moveDistance = 150; // How far to move

        let newX = (deltaX / distance) * moveDistance;
        let newY = (deltaY / distance) * moveDistance;

        // Get current position
        const currentX = x.get();
        const currentY = y.get();

        // Calculate new target position
        let targetX = currentX + newX;
        let targetY = currentY + newY;

        // Calculate where the button would be in absolute screen coordinates
        const newButtonLeft = button.left + (targetX - currentX);
        const newButtonRight = newButtonLeft + button.width;
        const newButtonTop = button.top + (targetY - currentY);
        const newButtonBottom = newButtonTop + button.height;

        // Clamp to keep button fully within viewport
        if (newButtonLeft < padding) {
            targetX = currentX - (button.left - padding);
        }
        if (newButtonRight > viewportWidth - padding) {
            targetX = currentX + (viewportWidth - padding - button.right);
        }
        if (newButtonTop < padding) {
            targetY = currentY - (button.top - padding);
        }
        if (newButtonBottom > viewportHeight - padding) {
            targetY = currentY + (viewportHeight - padding - button.bottom);
        }

        x.set(targetX);
        y.set(targetY);
        setIsEscaping(true);
    }, [x, y]);

    // Reset button position when mouse is far away
    useEffect(() => {
        if (!isEscaping) return;

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!noButtonRef.current) return;

            const rect = noButtonRef.current.getBoundingClientRect();
            const buttonCenterX = rect.left + rect.width / 2;
            const buttonCenterY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(e.clientX - buttonCenterX, 2) +
                Math.pow(e.clientY - buttonCenterY, 2)
            );

            // If mouse is more than 300px away, return button to original position
            if (distance > 300) {
                x.set(0);
                y.set(0);
            }
        };

        window.addEventListener("mousemove", handleGlobalMouseMove);
        return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
    }, [isEscaping, x, y]);

    // Cleanup escape message after button is home for a while
    useEffect(() => {
        if (!isEscaping) return;

        // Use an interval to check if button has returned to center
        const interval = setInterval(() => {
            if (x.get() === 0 && y.get() === 0) {
                const timeout = setTimeout(() => setIsEscaping(false), 3000);
                clearInterval(interval);
                return () => clearTimeout(timeout);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isEscaping, x, y]);

    const handleMouseEnter = (e: React.MouseEvent) => {
        moveAwayFromMouse(e.clientX, e.clientY);
    };

    const toggleEdit = () => {
        if (!session) {
            router.push("/login");
            return;
        }
        if (isEditing) {
            // Cancel -> Revert
            setName(originalName);
            setCustomMessage(originalMessage);
            setIsEditing(false);
        } else {
            // Start editing
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return;

        try {
            // If owner -> Update
            if (inviteData && session?.user?.id === inviteData.userId) {
                const res = await updateInvite(inviteData.id, { recipientName: name, message: customMessage || undefined });
                if (res.success) {
                    setOriginalName(name);
                    setOriginalMessage(customMessage);
                    setInviteData({ ...inviteData, recipientName: name, message: customMessage }); // Optimistic update
                    setIsEditing(false);
                }
            }
            // If not owner -> Create New
            else {
                const res = await createInvite({ recipientName: name, message: customMessage || undefined });
                if (res.success && res.slug) {
                    router.push(`/valentine/${res.slug}`);
                }
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save. Please make sure you are logged in.");
        }
    }

    const handleYesClick = () => {
        setYesClicked(true);
    };

    const handleWhyClick = () => {
        setWhyClicked(true);
    };

    if (!name) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-red-400 to-rose-500">
                <div className="animate-pulse">
                    <Heart className="w-16 h-16 text-white" />
                </div>
            </div>
        );
    }

    if (whyClicked && !familyClicked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-red-400 to-rose-500 overflow-hidden p-4">
                {/* Floating hearts background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                scale: 0
                            }}
                            animate={{
                                scale: [0, 1, 1, 0],
                                y: [0, -100, -200, -300],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        >
                            <Heart
                                className="text-white/30 fill-white/10"
                                style={{
                                    width: `${20 + Math.random() * 30}px`,
                                    height: `${20 + Math.random() * 30}px`,
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    className="relative z-10"
                >
                    <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border-0 max-w-3xl w-full mx-auto">
                        <CardContent className="p-10 md:p-14 text-center">
                            <motion.p
                                className="text-xl md:text-2xl text-gray-700 mb-6"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Really? Ok, here... open my heart 💝
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="mb-6"
                            >
                                <DotLottieReact
                                    src="/media/Love is blind.lottie"
                                    loop
                                    autoplay
                                    className="w-full max-w-md mx-auto"
                                />
                            </motion.div>

                            <motion.h2
                                className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-6"
                                style={{ fontFamily: "'MGF Pinlock', cursive" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 }}
                            >
                                Because I&apos;m blind in your love... 💕
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                                className="flex flex-col md:flex-row gap-4 justify-center items-center"
                            >
                                <Button
                                    onClick={() => setWhyClicked(false)}
                                    className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-auto"
                                >
                                    Aww, go back 🥰
                                </Button>
                                <Button
                                    onClick={() => setFamilyClicked(true)}
                                    variant="secondary"
                                    className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold py-3 px-8 text-lg shadow-md h-auto border-2 border-pink-300"
                                >
                                    Want more reason? 💭
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (familyClicked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-red-400 to-rose-500 overflow-hidden p-4">
                {/* Floating hearts background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                scale: 0
                            }}
                            animate={{
                                scale: [0, 1, 1, 0],
                                y: [0, -100, -200, -300],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        >
                            <Heart
                                className="text-white/30 fill-white/10"
                                style={{
                                    width: `${20 + Math.random() * 30}px`,
                                    height: `${20 + Math.random() * 30}px`,
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    className="relative z-10"
                >
                    <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border-0 max-w-3xl w-full mx-auto">
                        <CardContent className="p-10 md:p-14 text-center">
                            <motion.p
                                className="text-xl md:text-2xl text-gray-700 mb-6"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Here&apos;s another reason... 💫
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="mb-6"
                            >
                                <DotLottieReact
                                    src="/media/family.lottie"
                                    loop
                                    autoplay
                                    className="w-full max-w-md mx-auto"
                                />
                            </motion.div>

                            <motion.h2
                                className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-4"
                                style={{ fontFamily: "'MGF Pinlock', cursive" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 }}
                            >
                                Because I see my future family with you...
                            </motion.h2>

                            <motion.p
                                className="text-xl md:text-2xl text-gray-600 mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                            >
                                You&apos;re not just my Valentine, you&apos;re my forever 💖
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.5 }}
                                className="flex flex-col md:flex-row gap-4 justify-center items-center"
                            >
                                <Button
                                    onClick={() => setFamilyClicked(false)}
                                    variant="secondary"
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 text-lg shadow-md h-auto"
                                >
                                    ← Go back
                                </Button>
                                <Button
                                    onClick={() => {
                                        setFamilyClicked(false);
                                        setWhyClicked(false);
                                        setYesClicked(true);
                                    }}
                                    className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-auto"
                                >
                                    I&apos;m convinced! Yes! 💕
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (yesClicked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-red-400 to-rose-500 overflow-hidden">
                {/* Floating hearts background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                scale: 0
                            }}
                            animate={{
                                scale: [0, 1, 1, 0],
                                y: [0, -100, -200, -300],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        >
                            <Heart
                                className="text-white/40 fill-white/20"
                                style={{
                                    width: `${20 + Math.random() * 40}px`,
                                    height: `${20 + Math.random() * 40}px`,
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-full max-w-3xl mx-auto"
                >
                    <Card className="relative z-10 bg-white/90 backdrop-blur-lg shadow-2xl border-0 w-full overflow-hidden">
                        <button
                            onClick={() => setYesClicked(false)}
                            className="absolute top-6 left-6 z-20 text-gray-400 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-pink-50"
                            title="Go back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <CardContent className="p-10 md:p-14 text-center">
                            <motion.div
                                className="mb-6"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <DotLottieReact
                                    src="/media/Cute bunnies love animation.lottie"
                                    loop
                                    autoplay
                                    className="w-40 h-40 md:w-60 md:h-60 mx-auto"
                                />
                            </motion.div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">Yay! 🎉💕</h1>
                            <p className="text-2xl text-gray-600 mb-2">
                                I knew you&apos;d say yes, {name}!
                            </p>
                            <p className="text-xl text-pink-600 font-medium">
                                You just made me the happiest person ever! 💖
                            </p>
                            <div className="mt-6 flex justify-center gap-2">
                                {["❤️", "💕", "💖", "💗", "💓"].map((emoji, i) => (
                                    <motion.span
                                        key={i}
                                        className="text-3xl"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.6,
                                            delay: i * 0.1
                                        }}
                                    >
                                        {emoji}
                                    </motion.span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 via-red-400 to-rose-500 overflow-hidden"
        >
            {/* Floating hearts background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    >
                        <Heart
                            className="text-white/20"
                            style={{
                                width: `${20 + Math.random() * 30}px`,
                                height: `${20 + Math.random() * 30}px`,
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            <Card className="relative z-10 bg-white/90 backdrop-blur-lg shadow-2xl border-0 max-w-3xl w-full mx-auto">
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                    {isEditing ? (
                        <>
                            <Button size="sm" onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4">
                                <Save className="w-4 h-4 mr-1" /> Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={toggleEdit} className="text-gray-500 hover:text-red-500 rounded-full px-4">
                                <X className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                        </>
                    ) : null}
                </div>
                <CardContent className="p-10 md:p-14 text-center">
                    {/* Animated teddy bear */}
                    <div className="mb-4 w-32 h-32 md:w-40 md:h-40 mx-auto">
                        <DotLottieReact
                            src="/media/Teddy Bear.lottie"
                            loop
                            autoplay
                            className="w-full h-full"
                        />
                    </div>

                    {/* Main question */}
                    {isEditing ? (
                        <div className="mb-4">
                            <label className="text-xs text-pink-400 mb-1 block uppercase tracking-wider font-semibold">Recipient Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-2xl md:text-3xl text-center font-bold text-red-500 h-12 border-pink-300 focus-visible:ring-pink-500 font-serif bg-white/50"
                            />
                        </div>
                    ) : (
                        <h1
                            className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-4"
                            style={{ fontFamily: "'MGF Pinlock', cursive" }}
                        >
                            {name}, will you be my Valentine?
                        </h1>
                    )}

                    {(isEditing || customMessage) && (
                        isEditing ? (
                            <div className="mb-4">
                                <label className="text-xs text-pink-400 mb-1 block uppercase tracking-wider font-semibold">Custom Message</label>
                                <Textarea
                                    value={customMessage || ""}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    placeholder="Add a sweet personal note..."
                                    className="text-base text-gray-600 italic min-h-[80px] border-pink-300 focus-visible:ring-pink-500 bg-white/50"
                                />
                            </div>
                        ) : (
                            <p className="text-lg text-gray-600 mb-4 italic max-w-lg mx-auto">
                                &ldquo;{customMessage}&rdquo;
                            </p>
                        )
                    )}

                    {/* Buttons container */}
                    <div className="flex justify-center gap-4 relative min-h-[60px]">
                        <Button
                            onClick={handleYesClick}
                            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-8 text-lg md:text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 h-auto"
                        >
                            Yes! 💖
                        </Button>

                        <motion.div
                            style={{ x: springX, y: springY }}
                            className="relative z-50"
                        >
                            <Button
                                ref={noButtonRef}
                                variant="secondary"
                                onMouseEnter={handleMouseEnter}
                                onTouchStart={(e) => {
                                    const touch = e.touches[0];
                                    moveAwayFromMouse(touch.clientX, touch.clientY);
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    moveAwayFromMouse(e.clientX, e.clientY);
                                }}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 text-lg md:text-xl shadow-md h-auto"
                            >
                                No 😢
                            </Button>
                        </motion.div>

                        <Button
                            onClick={handleWhyClick}
                            onMouseEnter={() => setIsEscaping(true)}
                            variant="secondary"
                            className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold py-3 px-8 text-lg md:text-xl shadow-md h-auto border-2 border-pink-300"
                        >
                            Why? 🤔
                        </Button>
                    </div>

                    {isEscaping && (
                        <motion.p
                            className="mt-6 text-lg text-pink-600"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Nice try! But you can&apos;t escape my love! 💕
                        </motion.p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
