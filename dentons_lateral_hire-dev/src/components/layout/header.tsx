"use client";

import { Bell, HelpCircle, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { LogoSmall } from "./logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/sign-in');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e0e7] px-10 py-3 bg-white sticky top-0 z-10">
      <LogoSmall />

      <div className="flex flex-1 justify-end gap-6 items-center">
        {/* Notification, Help, and Settings icons - commented out
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-[#f7f6f8] text-[#7c6b80] hover:bg-[#f0eef1]"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-[#f7f6f8] text-[#7c6b80] hover:bg-[#f0eef1]"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-[#f7f6f8] text-[#7c6b80] hover:bg-[#f0eef1]"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-white">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
