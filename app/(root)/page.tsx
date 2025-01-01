import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <section className="bg-[rgb(131,112,255)]  py-5 md:py-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 max-w-7xl p-3 m-auto">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="font-bold text-6xl md:text-7xl text-white text-[40px] leading-[48px]">Host, Connect, Celebrate: Your Events, Our Platform!</h1>
            <p className="text-xl text-white">Book and learn helpful tips from 3,168+ mentors in world-class companies with our global community.</p>
            <Button size="lg" asChild className="hover:bg-[#FA776C] font-bold text-lg transition-all duration-500 w-full sm:w-fit rounded-full">
              <Link href="#events">
                Explore Now
              </Link>
            </Button>
          </div>

          <Image 
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section> 

      <section id="events" className="max-w-7xl m-auto my-8 flex flex-col gap-8 md:gap-12 p-3">
        <h2 className="text-3xl md:text-4xl font-bold">Trust by <br /> Thousands of Events</h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          search and filter here
        </div>
      </section> 
    </>
  );
}
