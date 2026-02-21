import Link from 'next/link'

import { ThemeToggle } from "@/components/theme-toggle";
import { isHistoricalOnlyHours, isPreMarketHours, isMarketOpen } from "@/lib/utils";

export const Navbar = () => {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="text-xl font-bold">
                        Options Dashboard
                    </Link>
                    <div className="flex items-center space-x-4">
                        {/* Market Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isHistoricalOnlyHours()
                                ? 'bg-red-100 text-red-800'
                                : isPreMarketHours()
                                ? 'bg-yellow-100 text-yellow-800'
                                : isMarketOpen()
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {isHistoricalOnlyHours() ? 'Market Closed' : isPreMarketHours() ? 'Pre-Market' : isMarketOpen() ? 'Market Open' : 'Market Closed'}
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};