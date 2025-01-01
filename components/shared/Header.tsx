import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import NavItems from './NavItems'
import MobileNav from './MobileNav'
function Header() {
  return (
    <header>
      <div className='container max-w-7xl flex items-center justify-between my-4 px-3 m-auto'>
        <Link href={'/'}>
          <Image
            src={'/assets/images/logo.svg'}
            width={128}
            height={38}
            alt='Evently'
          />
        </Link>
        <nav  className='hidden md:block'>
          <NavItems/>
        </nav>
        <div>
          <SignedIn>
            <div className='flex gap-3 '>
              <UserButton afterSignOutUrl='/'/>
              <MobileNav/>
            </div>
          </SignedIn>
          <SignedOut>
            <Button asChild size="lg" className='bg-[#624CF5] hover:bg-[#3e2abe] rounded-full'>
              <Link href={"/sign-in"}>
                Login
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header