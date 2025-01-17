"use server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import {
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
  IEvent,
} from "@/types";
import { connectToDb } from "../database";
import Order from "../database/models/order.model";
import Event from "../database/models/event.model";
import { User } from "../database/models/user.model";

type orderProps = {
  event: IEvent;
  userId: string;
};

export const checkoutOrder = async ({ event, userId }: orderProps) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const price = event.isFree ? 0 : Number(event.price) * 100;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: event.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: event._id,
        buyerId: userId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });
    redirect(session.url!);
  } catch (err) {
    throw err;
  }
};

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDb();

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    throw error;
  }
};
export async function getOrdersByUser({
  userId,
  limit = 3,
  page,
}: GetOrdersByUserParams) {
  try {
    await connectToDb();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { buyer: userId };

    const orders = await Order.distinct("event._id")
      .find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "event",
        model: Event,
        populate: {
          path: "organizer",
          model: User,
          select: "_id firstName lastName",
        },
      });

    const ordersCount = await Order.distinct("event._id").countDocuments(
      conditions
    );

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    throw error;
  }
}
export async function getOrdersByUserAgain({ userId }: { userId: string }) {
  try {
    await connectToDb();

    const conditions = { buyer: userId };

    const orders = await Order.distinct("event._id")
      .find(conditions)
      .sort({ createdAt: "desc" });

    return {
      data: JSON.parse(JSON.stringify(orders)),
    };
  } catch (error) {
    throw error;
  }
}

export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    await connectToDb();

    if (!eventId) throw new Error("Event ID is required");
    const eventObjectId = new ObjectId(eventId);

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: "$buyer",
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: "$event.eventTitle",
          eventId: "$event._id",
          buyer: {
            $concat: ["$buyer.firstName", " ", "$buyer.lastName"],
          },
        },
      },
      {
        $match: {
          $and: [
            { eventId: eventObjectId },
            { buyer: { $regex: RegExp(searchString, "i") } },
          ],
        },
      },
    ]);

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    throw error;
  }
}
