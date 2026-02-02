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
                className="group -py-6 pb-6 relative overflow-hidden border-border bg-card transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer w-full max-w-sm"
                onClick={() => setModalOpen(true)}
            >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="text-primary h-5 w-5 animate-pulse" />
                </div>
                <div className="h-48 relative overflow-hidden bg-muted flex items-center justify-center">
                    <div className="relative z-10 scale-100 group-hover:scale-110 transition-transform duration-500">
                        <Heart size={80} fill="currentColor" className="text-primary drop-shadow-lg" />
                    </div>
                    {/* Background decorative elements */}
                    <div className="absolute top-4 left-4 h-12 w-12 rounded-full bg-primary/20 blur-xl" />
                    <div className="absolute bottom-8 right-8 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-serif text-foreground">Valentine Invitation</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        A romantic and interactive way to ask &quot;Will you be my Valentine?&quot;
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-full bg-muted text-primary text-xs font-medium">Interactive</span>
                        <span className="px-2 py-1 rounded-full bg-muted text-primary text-xs font-medium">Romantic</span>
                        <span className="px-2 py-1 rounded-full bg-muted text-primary text-xs font-medium">Personalized</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full shadow-md group-hover:shadow-lg transition-all"
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
