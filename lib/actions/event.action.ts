"use server";
import { connectToDb } from "../database";
import Event from "../database/models/event.model";
import Category from "../database/models/category.model";
import {
  createEprops,
  DeleteEventParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
} from "@/types";
import { User } from "../database/models/user.model";
import { revalidatePath } from "next/cache";

const populateEvent = (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({
      path: "category",
      model: Category,
      select: "_id name",
    });
};
export async function createEvent({ userId, values }: createEprops) {
  try {
    await connectToDb();
    const newEvent = await Event.create({
      eventTitle: values.eventTitle,
      description: values.description,
      imageUrl: values.imageUrl,
      location: values.location,
      startDateTime: values.startDateTime,
      endDateTime: values.endDateTime,
      price: values.price,
      isFree: values.isFree,
      url: values.url,
      category: values.category,
      organizer: userId,
    });
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    console.log(error);
    throw new Error("cant find");
  }
}
export async function createCategory(cat: string) {
  try {
    await connectToDb();
    const newCategory = await Category.create({
      name: cat,
    });
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    throw error;
  }
}
export async function getAllCategories() {
  try {
    await connectToDb();
    const all = await Category.find();
    return JSON.parse(JSON.stringify(all));
  } catch (error) {
    throw error;
  }
}
export async function getEventById(eventId: string) {
  try {
    await connectToDb();
    const event = await populateEvent(Event.findById(eventId));
    if (!event) throw new Error("Event not found");
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    throw error;
  }
}

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};

export async function getAllEvents({
  query,
  category,
  page,
  limit = 6,
}: {
  query: string;
  category: string;
  page: number;
  limit: number;
}) {
  try {
    await connectToDb();

    const titleCondition = query
      ? { eventTitle: { $regex: query, $options: "i" } }
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };

    const skipAmount = (Number(page) - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);
    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    throw error;
  }
}
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDb();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
export async function updateEvent({
  userId,
  values,
  event,
}: UpdateEventParams) {
  try {
    if (!event) return "event not found";
    await connectToDb();

    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      {
        ...values,
      },
      { new: true }
    );
    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    throw error;
  }
}

export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDb();
    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    throw error;
  }
}

export async function getEventsByUser({
  userId,
  limit = 6,
  page,
}: GetEventsByUserParams) {
  try {
    await connectToDb();

    const conditions = { organizer: userId };
    // const skipAmount = (page - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      // .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    throw error;
  }
}
