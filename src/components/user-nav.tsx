"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getUserDisplayName, getUserEmail, getUserInitials, getStaffRole, logout } from "@/lib/auth"

export function UserNav() {
    const [name, setName] = useState("User")
    const [email, setEmail] = useState("")
    const [initials, setInitials] = useState("U")
    const [role, setRole] = useState("user")

    useEffect(() => {
        setName(getUserDisplayName())
        setEmail(getUserEmail())
        setInitials(getUserInitials())
        setRole(getStaffRole() || "staff")
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full cursor-pointer p-0 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                    type="button"
                >
                    <Avatar className="h-9 w-9 cursor-pointer">
                        <AvatarImage src="/avatars/01.png" alt="Profile" />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-[100]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium leading-none">{name}</p>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                                {role}
                            </Badge>
                        </div>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email || "No email"}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/settings">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/settings/organization">Billing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
