// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { MongoClient } from "mongodb";

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const usersCollection = client.db().collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      client.close();
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    await usersCollection.insertOne({
      email,
      password: hashedPassword,
      username,
      profilePictureUrl: null, // Initialize as null or leave it out
    });

    client.close();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
