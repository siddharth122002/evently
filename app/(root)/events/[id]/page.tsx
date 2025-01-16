import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.action";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { getOrdersByUserAgain } from "@/lib/actions/order.actions";

const EventDetails = async ({ params, searchParams }: SearchParamProps) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const { page } = await searchParams;
  const { id } = await params;
  const event = await getEventById(id);
  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: page as string,
  });
  const orders = await getOrdersByUserAgain({ userId });
  const alreadyPurchased = orders.data.some(
    (order: any) => order.event.toString() === id
  );

  return (
    <>
      <section className="flex justify-center bg-dotted-pattern bg-contain px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2  2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-auto w-full min-h-[300px] object-contain object-center"
          />
          <div className="flex w-full flex-col gap-6 p-5 sm:p-8 md:p-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {event.eventTitle}
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-2 sm:gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-4 sm:px-5 py-2 text-green-700">
                    {event.isFree ? "FREE" : `$${event.price}`}
                  </p>
                  <p className="rounded-full bg-gray-500/10 px-4 py-2.5 text-gray-500">
                    {event.category.name}
                  </p>
                </div>
                <p className="p-medium-18 ml-0 sm:ml-2 mt-2 sm:mt-0 text-sm sm:text-base">
                  by{" "}
                  <span className="text-purple-800">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>
            <CheckoutButton
              purchased={alreadyPurchased}
              event={event}
              userId={userId}
            />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 md:gap-3 items-center">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap gap-1">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} -{" "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly} -{" "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>
              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-bold text-grey-600">What You'll Learn:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-medium-16 lg:p-regular-18 text-blue-500 underline truncate"
              >
                {event.url}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 bg-cover bg-center py-5 md:py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center sm:flex-row sm:justify-between gap-4">
          <h3 className="text-xl md:text-3xl font-bold text-center">
            Related Events
          </h3>
        </div>
      </section>

      <div className="max-w-7xl mx-auto mt-8 px-4">
        <Collection
          data={relatedEvents?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={3}
          page={page as string}
          totalPages={relatedEvents?.totalPages}
        />
      </div>
    </>
  );
};

export default EventDetails;
