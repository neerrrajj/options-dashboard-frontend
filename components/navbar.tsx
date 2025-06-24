import Link from 'next/link'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle";

export const Navbar = () => {

    const navItems = [
        { path: "/gex", label: "GEX Analysis" },
        { path: "/greeks", label: "Greeks Analysis" },
    ];

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold">
                            Options Dashboard
                        </Link>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <div className="flex items-center space-x-6">
                                    {navItems.map((item) => (
                                        <NavigationMenuItem key={item.path}>
                                            <NavigationMenuLink asChild>
                                                <Link href={item.path}>{item.label}</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </div>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};