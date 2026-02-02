"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Copy, Check, ExternalLink, ArrowLeft, Heart, Save } from "lucide-react"
import { motion } from "motion/react"
import { updateInvite, getInviteById } from "@/app/actions"


export default function EditInvitePage() {
    const { data: session, isPending } = useSession()
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [recipientName, setRecipientName] = useState("")
    const [message, setMessage] = useState("")
    const [reason1, setReason1] = useState("")
    const [reason2, setReason2] = useState("")
    const [theme, setTheme] = useState("pink")
    const [slug, setSlug] = useState("")

    const [isFetching, setIsFetching] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login")
        }
    }, [session, isPending, router])

    useEffect(() => {
        const fetchInvite = async () => {
            if (!id) return
            try {
                const data = await getInviteById(id)
                if (data) {
                    if (session?.user && data.userId !== session.user.id) {
                        router.push("/")
                        return
                    }
                    setRecipientName(data.recipientName)
                    setMessage(data.message || "")
                    setReason1(data.reason1 || "")
                    setReason2(data.reason2 || "")
                    setTheme(data.theme || "pink")
                    setSlug(data.slug || data.id)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsFetching(false)
            }
        }
        if (session) fetchInvite()
    }, [id, session, router])

    const handleSubmit = async () => {
        if (!recipientName.trim()) return;
        setIsSubmitting(true);
        try {
            const result = await updateInvite(id, {
                recipientName,
                message,
                reason1,
                reason2,
                theme
            })
            if (result.success) {
                setIsSaved(true)
                setTimeout(() => setIsSaved(false), 3000)
            }
        } catch (error) {
            console.error(error)
            alert("Failed to update invite. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const generatedUrl = slug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/valentine/${slug}` : "";

    if (isPending || isFetching) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="animate-spin text-pink-500" size={32} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-100/30 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[120px]" />
            </div>

            <div className="container py-12 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white shadow-sm border">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-serif text-slate-900 tracking-tight">Customize Invitation</h1>
                            <p className="text-slate-500">Fine-tune your message to perfection.</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-8"
                    >
                        <Card className="border-0 shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/80 backdrop-blur-xl">
                            <CardHeader className="border-b bg-slate-50/50">
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-pink-500" />
                                    Invitation Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Recipient Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Shreya"
                                            value={recipientName}
                                            onChange={(e) => setRecipientName(e.target.value)}
                                            className="h-12 border-slate-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl bg-white/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold uppercase tracking-wider text-slate-500">Card Style</Label>
                                        <div className="flex gap-3">
                                            {[
                                                { id: "pink", class: "bg-pink-500" },
                                                { id: "ocean", class: "bg-blue-500" },
                                                { id: "purple", class: "bg-purple-600" },
                                                { id: "dark", class: "bg-slate-900" },
                                            ].map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTheme(t.id)}
                                                    className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 ${theme === t.id ? "border-white ring-2 ring-slate-900 shadow-lg" : "border-transparent opacity-60"
                                                        } ${t.class}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Personal Love Note</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Add a sweet note that will appear on the card..."
                                        className="min-h-[100px] border-slate-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl bg-white/50"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="reason1" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Reason 1 (Why?)</Label>
                                        <Input
                                            id="reason1"
                                            placeholder="Because I'm blind in your love..."
                                            value={reason1}
                                            onChange={(e) => setReason1(e.target.value)}
                                            className="h-12 border-slate-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl bg-white/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reason2" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Reason 2 (Family)</Label>
                                        <Input
                                            id="reason2"
                                            placeholder="Because I see my future family with you..."
                                            value={reason2}
                                            onChange={(e) => setReason2(e.target.value)}
                                            className="h-12 border-slate-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl bg-white/50"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/80 p-6 flex justify-between items-center border-t">
                                <Button variant="outline" onClick={() => window.open(generatedUrl, "_blank")} className="rounded-xl border-slate-300">
                                    <ExternalLink className="mr-2 h-4 w-4" /> View Live
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!recipientName.trim() || isSubmitting}
                                    className="bg-pink-600 hover:bg-pink-700 text-white min-w-[160px] h-12 rounded-xl font-bold shadow-lg shadow-pink-200 hover:-translate-y-0.5 transition-all"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : isSaved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                    {isSubmitting ? "Saving..." : isSaved ? "Changes Saved!" : "Save Changes"}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="border-0 shadow-xl shadow-pink-100/50 bg-gradient-to-br from-pink-50 to-white overflow-hidden">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-pink-900">Share Your Invite</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-6">
                                <div className="flex gap-2 p-1 rounded-2xl bg-white shadow-inner border">
                                    <Input value={generatedUrl} readOnly className="border-0 bg-transparent focus-visible:ring-0 h-11" />
                                    <Button
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedUrl)
                                            setCopied(true)
                                            setTimeout(() => setCopied(false), 2000)
                                        }}
                                        className={`${copied ? 'bg-green-500' : 'bg-slate-900'} hover:opacity-90 rounded-xl px-6 transition-all`}
                                    >
                                        {copied ? <Check size={18} /> : "Copy Link"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Preview Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-5 lg:sticky lg:top-12 flex flex-col items-center"
                    >
                        <div className="w-full max-w-[340px] relative">
                            {/* Device Frame */}
                            <div className="absolute inset-x-[-15px] inset-y-[-15px] rounded-[3rem] border-[12px] border-slate-900 shadow-2xl pointer-events-none z-20" />
                            <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-30" />

                            <div className={`aspect-[9/19.5] w-full rounded-[2rem] overflow-hidden relative shadow-inner transition-colors duration-700 ${theme === 'pink' ? 'bg-gradient-to-br from-pink-400 to-rose-500' :
                                theme === 'ocean' ? 'bg-gradient-to-br from-blue-400 to-indigo-600' :
                                    theme === 'purple' ? 'bg-gradient-to-br from-purple-500 to-violet-700' :
                                        'bg-slate-950'
                                }`}>
                                {/* Preview Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                                    <motion.div
                                        key={recipientName}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="mb-4"
                                    >
                                        <Heart className={`w-20 h-20 ${theme === 'dark' ? 'text-red-500' : 'text-white'} fill-current drop-shadow-lg`} />
                                    </motion.div>

                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-serif tracking-tight leading-tight">
                                            {recipientName || "Sweetheart"}
                                        </h3>
                                        <p className="text-white/80 text-sm font-medium italic">
                                            {message || "Will you be my Valentine?"}
                                        </p>
                                    </div>

                                    <div className="pt-8 flex flex-col gap-3 w-full">
                                        <div className="h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-bold uppercase tracking-widest border border-white/30">
                                            Yes! 💖
                                        </div>
                                        <div className="h-10 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center text-xs font-medium border border-white/10 opacity-70">
                                            Why? 💭
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full blur-sm animate-pulse" />
                                <div className="absolute bottom-20 right-10 w-8 h-8 bg-white/10 rounded-full blur-md animate-bounce" />
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Live Preview
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
