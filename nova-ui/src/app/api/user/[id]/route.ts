// src/app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== params.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const usersCollection = client.db().collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(params.id) });

    client.close();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
