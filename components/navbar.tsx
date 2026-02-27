import Link from 'next/link'

import { UserMenu } from "@/components/user-menu";
import { isHistoricalOnlyHours, isPreMarketHours, isMarketOpen } from "@/lib/utils";

const monoFont = { fontFamily: 'var(--font-mono), monospace' };

export const Navbar = () => {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <span className="text-landing-accent text-xl">◆</span>
                        <span className="text-2xl font-bold">optionstrike</span>
                    </Link>
                    <div className="flex items-center space-x-8">
                        {/* Market Status Badge */}
                        <div 
                            style={monoFont}
                            className={`flex items-center gap-3 px-4 pb-1.5 pt-2 rounded-full text-xs font-normal text-foreground/80 border uppercase tracking-wide ${
                                isHistoricalOnlyHours()
                                    ? 'bg-red-500/10 border-red-500/50'
                                    : isPreMarketHours()
                                    ? 'bg-yellow-500/10 border-yellow-500/50'
                                    : isMarketOpen()
                                    ? 'bg-green-500/10 border-green-500/50'
                                    : 'bg-red-500/10 border-red-500/50'
                            }`}
                        >
                            <div className={`rounded-full h-2 w-2 ${isHistoricalOnlyHours() ? 'bg-red-500/80' : isPreMarketHours() ? 'bg-yellow-500/80' : 'bg-green-500/80'}`}/>
                            <p>{isHistoricalOnlyHours() ? 'Market Closed' : isPreMarketHours() ? 'Pre-Market' : isMarketOpen() ? 'Market Open' : 'Market Closed'}</p>
                        </div>
                        <UserMenu />
                    </div>
                </div>
            </div>
        </nav>
    );
};
