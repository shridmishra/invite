"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Copy, Check, ExternalLink } from "lucide-react"
import { createInvite } from "@/app/actions"


export default function CreateInvitePage() {
    const { data: session, isPending } = useSession()
    const router = useRouter()

    const [recipientName, setRecipientName] = useState("")
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [createdSlug, setCreatedSlug] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login")
        }
    }, [session, isPending, router])

    const handleSubmit = async () => {
        if (!recipientName.trim()) return;
        setIsSubmitting(true);
        try {
            const result = await createInvite({
                recipientName,
                message
            })
            if (result.success && result.slug) {
                setCreatedSlug(result.slug)
            }
        } catch (error) {
            console.error(error)
            alert("Failed to create invite. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const generatedUrl = createdSlug ? `https://invitely.shrid.in/valentine/${createdSlug}` : "";

    if (isPending || !session) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="animate-spin text-pink-500" size={32} />
            </div>
        )
    }

    if (createdSlug) {
        return (
            <div className="container py-12 max-w-2xl">
                <Card className="border-pink-200 shadow-xl overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center">
                        <Sparkles className="text-white h-12 w-12" />
                    </div>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-serif text-pink-700">Invite Created! 🎉</CardTitle>
                        <CardDescription className="text-lg">
                            Your Valentine invite for <span className="font-semibold text-pink-600">{recipientName}</span> is ready.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-pink-50 rounded-lg border border-pink-100 flex flex-col gap-2">
                            <Label className="text-pink-600 font-medium">Share this link</Label>
                            <div className="flex gap-2">
                                <Input value={generatedUrl} readOnly className="bg-white" />
                                <Button size="icon" variant="outline" onClick={() => {
                                    navigator.clipboard.writeText(generatedUrl)
                                    setCopied(true)
                                    setTimeout(() => setCopied(false), 2000)
                                }}>
                                    {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" onClick={() => setCreatedSlug(null)}>Create Another</Button>
                            <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => window.open(generatedUrl.replace("https://invitely.shrid.in", window.location.origin), "_blank")}>
                                Open Invite <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-4xl">
            <h1 className="text-3xl font-serif text-pink-900 mb-2">Create Custom Invite</h1>
            <p className="text-slate-500 mb-8">Personalize your Valentine's Day invitation.</p>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invite Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Recipient Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Shreya"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Custom Message (Optional)</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Add a sweet note that will appear on the card..."
                                    className="min-h-[100px]"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">This will replace the default "Will you be my Valentine?" message or appear alongside it depending on the template.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t p-4 bg-slate-50">
                            <Button
                                onClick={handleSubmit}
                                disabled={!recipientName.trim() || isSubmitting}
                                className="bg-pink-600 hover:bg-pink-700 text-white min-w-[140px]"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                {isSubmitting ? "Creating..." : "Create Magic"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="md:col-span-1">
                    <div className="sticky top-24">
                        <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-6 text-center">
                            <h3 className="font-serif text-xl text-pink-800 mb-2">Preview</h3>
                            <div className="aspect-[3/4] bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center mb-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-white opacity-50" />
                                <div className="z-10 p-4">
                                    <div className="text-3xl font-serif text-pink-500 mb-2">
                                        {recipientName || "Name"}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        will you be my...
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-pink-600/80">
                                This is just a rough preview. The actual card will be interactive and animated!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
