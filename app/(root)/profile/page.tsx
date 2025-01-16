import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.action";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { IOrder, SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";
import { string } from "zod";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const ordersPageNo = await searchParams;
  const eventsPageNo = await searchParams;
  const ordersPage = Number(ordersPageNo) || 1;
  const eventsPage = Number(eventsPageNo) || 1;

  const orders = await getOrdersByUser({ userId, page: ordersPage });

  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];

  const organizedEvents = await getEventsByUser({ userId, page: eventsPage });

  return (
    <>
      {/* My Tickets */}
      <section className="bg-blue-50  bg-cover bg-center py-5 md:py-10">
        <div className=" flex max-w-7xl m-auto items-center justify-center sm:justify-between">
          <h3 className="md:text-5xl font-bold text-center text-xl">
            My Tickets
          </h3>
          <Button asChild size="lg" className="button  hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No event tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>

      {/* Events Organized */}
      <section className="bg-blue-50  bg-cover bg-center py-5 md:py-10">
        <div className="flex max-w-7xl m-auto items-center justify-center sm:justify-between">
          <h3 className="md:text-5xl font-bold text-center text-xl">
            Events Organized
          </h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="max-w-7xl m-auto my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;
