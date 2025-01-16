import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type UpdateEventProps = {
  params: {
    id: string;
  };
};
async function UpdateEvent({ params }: UpdateEventProps) {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const { id } = await params;
  const event = await getEventById(id);
  return (
    <div className=" max-w-7xl p-3 m-auto  mb-8">
      <div className="text-3xl font-bold text-center my-8">Update Event</div>
      <EventForm
        type="Update"
        event={event}
        eventId={event._id}
        userId={userId}
      />
    </div>
  );
}

export default UpdateEvent;
