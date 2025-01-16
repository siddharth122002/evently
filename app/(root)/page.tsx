import Collection from "@/components/shared/Collection";
import Filter from "@/components/shared/Filter";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.action";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
  const { query, category, page } = await searchParams;
  const pageNo = Number(page) || 1;
  const searchText = (query as string) || "";
  const categoryText = (category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category: categoryText,
    page: pageNo,
    limit: 6,
  });
  return (
    <>
      <section className="bg-[rgb(131,112,255)]  py-5 md:py-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 max-w-7xl p-3 m-auto">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="font-bold text-6xl md:text-7xl text-white text-[40px] leading-[48px]">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="text-xl text-white">
              Book and learn helpful tips from 3,168+ mentors in world-class
              companies with our global community.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-black text-white font-bold text-lg transition-all duration-500 w-full sm:w-fit rounded-full"
            >
              <Link href="#events">Explore Now</Link>
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

      <section
        id="events"
        className="max-w-7xl m-auto my-8 flex flex-col gap-8 md:gap-12 p-3"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Trust by <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col gap-5 ">
          <Search />
          <Filter />
        </div>

        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          limit={6}
          page={pageNo}
          totalPages={events?.totalPages}
          collectionType="All_Events"
        />
      </section>
    </>
  );
}
