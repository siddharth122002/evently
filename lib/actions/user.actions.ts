"use server";

import { CreateUserParams } from "@/types";
import { connectToDb } from "../database";
import { User } from "../database/models/user.model";

export const createUser = async(user:CreateUserParams)=>{
    try{
        await connectToDb();
        
        const newUser = await User.create(user);
        
        return JSON.parse(JSON.stringify(newUser));

    } catch(error){
        throw new Error("error while creating a new User");
    }
}