"use client"

import * as React from "react"
import { Copy, ExternalLink, Check } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface PersonalizationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PersonalizationModal({
    open,
    onOpenChange,
}: PersonalizationModalProps) {
    const [name, setName] = React.useState("")
    const [step, setStep] = React.useState<"input" | "result">("input")
    const [copied, setCopied] = React.useState(false)

    const router = useRouter() // Import useRouter from next/navigation
    const productionUrl = `https://invitely.shrid.in/valentine/${encodeURIComponent(name)}`
    const localUrl = typeof window !== "undefined"
        ? `${window.location.origin}/valentine/${encodeURIComponent(name)}`
        : ""

    const handleCreate = () => {
        if (name.trim()) {
            setStep("result")
        }
    }

    const handleCustomize = () => {
        if (name.trim()) {
            // Navigate to the valentine page with edit mode enabled
            router.push(`/valentine/${encodeURIComponent(name)}?edit=true`)
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(productionUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy!", err)
        }
    }

    const reset = () => {
        setName("")
        setStep("input")
        setCopied(false)
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val)
            if (!val) setTimeout(reset, 300)
        }}>
            <DialogContent className="sm:max-w-[425px]">
                {step === "input" ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Personalize Invitation</DialogTitle>
                            <DialogDescription>
                                Enter the name of the person you want to invite.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Partner&apos;s Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Sarah"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                />
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                                onClick={handleCustomize}
                                disabled={!name.trim()}
                                variant="outline"
                                className="flex-1 w-full sm:w-auto border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800"
                            >
                                <span className="mr-2">✨</span> Customize More
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={!name.trim()}
                                className="bg-pink-600 hover:bg-pink-700 flex-1 w-full sm:w-auto"
                            >
                                Generate Link
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Invitation Ready! ❤️</DialogTitle>
                            <DialogDescription>
                                Your personalized invitation link has been generated.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="relative">
                                <Input
                                    readOnly
                                    value={productionUrl}
                                    className="pr-10 bg-slate-50"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-start gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={copyToClipboard}
                            >
                                {copied ? "Copied!" : "Copy Link"}
                            </Button>
                            <Button
                                className="flex-1 bg-pink-600 hover:bg-pink-700"
                                onClick={() => window.open(localUrl, "_blank")}
                            >
                                Open (Local)
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
