"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import { CreateUserParams, UpdateUserParams } from "@/types";
import { User } from "../database/models/user.model";
import Event from "@/lib/database/models/event.model";
import Order from "../database/models/order.model";
import { auth } from "@clerk/nextjs/server";

export async function getCurrent() {
  try {
    const { sessionClaims } = await auth();
    return sessionClaims.userId as string;
  } catch (error) {
    throw new Error("cant find");
  }
}
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDb();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDb();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error("cant find");
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDb();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    throw new Error("cant update");
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDb();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    throw error;
  }
}
