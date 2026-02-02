import { ValentineTemplateCard } from "@/components/valentine-template-card";
import { getUserInvites } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, Pencil, Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
    const invites = await getUserInvites();

    return (
        <div className="flex flex-col gap-12 max-w-6xl mx-auto py-8">
            <section>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h1 className="text-4xl font-serif text-foreground tracking-tight mb-2">My Invitations</h1>
                        <p className="text-muted-foreground text-lg">Manage your custom invitations and share them with your loved ones.</p>
                    </div>
                    <Link href="/valentine/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create New
                        </Button>
                    </Link>
                </div>

                {invites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {invites.map((invite) => (
                            <Card key={invite.id} className="group -py-6 overflow-hidden border-border hover:shadow-lg transition-all hover:bg-muted/50">
                                <div className="h-24 bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center">
                                    <Heart className="text-white/50 w-12 h-12" fill="currentColor" />
                                </div>
                                <CardHeader className="pb-2 text-center">
                                    <CardTitle className="text-xl">{invite.recipientName}</CardTitle>
                                    <CardDescription className="italic truncate">"{invite.message || 'No message'}"</CardDescription>
                                </CardHeader>
                                <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/30 p-3 pt-4">
                                    <Link href={`/valentine/edit/${invite.id}`} className="w-full">
                                        <Button variant="outline" size="sm" className="w-full text-xs">
                                            <Pencil className="mr-1 h-3 w-3" /> Customize
                                        </Button>
                                    </Link>
                                    <Link href={`/valentine/${invite.slug || invite.id}`} target="_blank" className="w-full">
                                        <Button variant="outline" size="sm" className="w-full text-xs">
                                            <ExternalLink className="mr-1 h-3 w-3" /> View link
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border-2 border-dashed border-border bg-muted/50 p-12 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="text-primary w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-medium text-foreground mb-2">No invitations yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Create your first personalized Valentine's Day invitation to share with someone special.</p>
                        <Link href="/valentine/create">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                )}
            </section>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Featured Templates</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ValentineTemplateCard />

                    {/* Placeholders for other templates */}
                    <div className="rounded-xl border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                        <div className="h-12 w-12 rounded-full bg-muted mb-4" />
                        <h3 className="text-muted-foreground font-medium tracking-tight">Birthday Invitation</h3>
                        <p className="text-muted-foreground/60 text-sm">Coming soon</p>
                    </div>
                    <div className="rounded-xl border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                        <div className="h-12 w-12 rounded-full bg-muted mb-4" />
                        <h3 className="text-muted-foreground font-medium tracking-tight">Party Invite</h3>
                        <p className="text-muted-foreground/60 text-sm">Coming soon</p>
                    </div>
                </div>
            </section>
        </div>
    );
}