import EventForm from "@/components/shared/EventForm";
import { getCurrent } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

async function page() {
  const user = await currentUser();
  const userId = user.publicMetadata.userId as string;
  return (
    <div className=" max-w-7xl p-3 m-auto  mb-8">
      <div className="text-3xl font-bold text-center my-8">Create Event</div>
      <EventForm userId={userId} type="Create" />
    </div>
  );
}

export default page;
