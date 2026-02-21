import Link from 'next/link'

import { ThemeToggle } from "@/components/theme-toggle";
import { isHistoricalOnlyHours, isPreMarketHours, isMarketOpen } from "@/lib/utils";

export const Navbar = () => {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        StrikeZone
                    </Link>
                    <div className="flex items-center space-x-8">
                        {/* Market Status Badge */}
                        <div className={`flex items-center gap-3 px-5 py-1.5 rounded-full text-sm font-normal text-foreground/80 border ${
                            isHistoricalOnlyHours()
                                ? 'bg-red-500/10 border-red-500/50'
                                : isPreMarketHours()
                                ? 'bg-yellow-500/10 border-yellow-500/50'
                                : isMarketOpen()
                                ? 'bg-green-500/10 border-green-500/50'
                                : 'bg-red-500/10 border-red-500/50'
                        }`}>
                            <div className={`rounded-full h-2 w-2 ${isHistoricalOnlyHours() ? 'bg-red-500/80' : isPreMarketHours() ? 'bg-yellow-500/80' : 'bg-green-500/80'}`}/>
                            <p>{isHistoricalOnlyHours() ? 'Market Closed' : isPreMarketHours() ? 'Pre-Market' : isMarketOpen() ? 'Market Open' : 'Market Closed'}</p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};