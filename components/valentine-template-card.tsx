"use client"

import * as React from "react"
import { Heart, Sparkles, Pencil } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PersonalizationModal } from "./personalization-modal"

export function ValentineTemplateCard() {
    const [modalOpen, setModalOpen] = React.useState(false)

    return (
        <>
            <Card
                className="group -py-6 pb-6 relative overflow-hidden border-pink-100 bg-white transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer w-full max-w-sm"
                onClick={() => setModalOpen(true)}
            >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="text-pink-400 h-5 w-5 animate-pulse" />
                </div>
                <div className="h-48 relative overflow-hidden bg-pink-50 flex items-center justify-center">
                    <div className="relative z-10 scale-100 group-hover:scale-110 transition-transform duration-500">
                        <Heart size={80} fill="#ec4899" className="text-pink-600 drop-shadow-lg" />
                    </div>
                    {/* Background decorative elements */}
                    <div className="absolute top-4 left-4 h-12 w-12 rounded-full bg-pink-200/50 blur-xl" />
                    <div className="absolute bottom-8 right-8 h-20 w-20 rounded-full bg-pink-300/30 blur-2xl" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-serif text-pink-800">Valentine Invitation</CardTitle>
                    <CardDescription className="text-pink-600/70">
                        A romantic and interactive way to ask &quot;Will you be my Valentine?&quot;
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">Interactive</span>
                        <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">Romantic</span>
                        <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">Personalized</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white border-none shadow-md group-hover:shadow-lg transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            setModalOpen(true);
                        }}
                    >
                        <Pencil className="mr-2 h-4 w-4" /> Customize
                    </Button>
                </CardFooter>
            </Card>

            <PersonalizationModal
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </>
    )
}
