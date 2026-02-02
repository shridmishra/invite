import { ValentineTemplateCard } from "@/components/valentine-template-card";

export default function Page() {
    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            <section>
                <h1 className="text-4xl font-serif text-slate-800 tracking-tight mb-2">Welcome back!</h1>
                <p className="text-slate-500 text-lg">Pick a template to start creating your perfect invitation.</p>
            </section>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-slate-800">Featured Templates</h2>
                    <button className="text-pink-600 hover:text-pink-700 font-medium text-sm">View all</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ValentineTemplateCard />

                    {/* Placeholders for other templates */}
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                        <div className="h-12 w-12 rounded-full bg-slate-200 mb-4" />
                        <h3 className="text-slate-400 font-medium tracking-tight">Birthday Invitation</h3>
                        <p className="text-slate-400 text-sm">Coming soon</p>
                    </div>
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                        <div className="h-12 w-12 rounded-full bg-slate-200 mb-4" />
                        <h3 className="text-slate-400 font-medium tracking-tight">Party Invite</h3>
                        <p className="text-slate-400 text-sm">Coming soon</p>
                    </div>
                </div>
            </section>

            <section className="bg-pink-50 rounded-2xl p-8 border border-pink-100 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                    <h2 className="text-3xl font-serif text-pink-900">Share the Love this Valentine's</h2>
                    <p className="text-pink-800/70 text-lg">
                        Our Valentine template is specially crafted to make your loved one feel truly special.
                        With interactive elements and personalized messages, it's more than just an invite.
                    </p>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                        Try it now
                    </button>
                </div>
                <div className="w-full md:w-1/3 aspect-video rounded-xl bg-pink-200/50 blur-sm animate-pulse" />
            </section>
        </div>
    );
}