import { Menu, School } from 'lucide-react'
import React, { useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DarkMode from "../darkMode.jsx"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link, useNavigate } from 'react-router-dom';
import { useLoadUserQuery, useLogoutUserMutation } from '@/features/api/authApi.js';
import { toast } from 'sonner';


const navbar = () => {
  const navigate = useNavigate();
  const [logoutUser, { data: logoutUserData, isSuccess, isError }] = useLogoutUserMutation();
  const { data } = useLoadUserQuery();
  const user = data?.user;


  const logoutHandler = async () => {
    await logoutUser();
  }


  useEffect(() => {
    if (isSuccess) {
      toast.success(logoutUserData.message || "Logged out successfully");
      navigate("/login");
    }
    if (isError) {
      toast.error(logoutUserData.data.message || "Error logging out");
    }
  }, [isSuccess, isError, logoutUserData]);


  return (
    <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 top-0 right-0 left-0 duration:300 z-10'>
      <div className='max-w-7xl md:flex mx-auto hidden items-center justify-between'>
        <div className='flex items-center gap-3 mt-3'>
          <School size={"30"} />
          <Link to="/"><h1 className='hidden md:block font-extrabold text-2xl'>E-Learning</h1></Link>
        </div>
        <div className='mt-3 flex items-center gap-8'>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="/profile">Profile</Link>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/my_learning">My Learning</Link>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={logoutHandler}>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
                {
                  user.role === "instructor" && (
                    <>
                    <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to="/admin">Dashboard</Link>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </>
                  )
                }
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/*Mobile Devices Navbar*/}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-learning</h1>
        <MobileNavbar />
      </div>
    </div>
  )
}

export default navbar


const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full bg-gray-200 text-black hover:bg-gray-200" variant="outline"><Menu /></Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>E-Learning</SheetTitle>
          <DarkMode />
        </SheetHeader>
        <nav className="flex flex-col space-y-4">
          <div>My Learning</div>
          <div>Edit Profile</div>
          <p>Log out</p>
        </nav>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}; 