// src/app/api/user/update/route.ts
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import formidable, { Fields, Files, File } from "formidable";
import { promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";
import { IncomingMessage } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: Request): Promise<{ fields: Fields; files: Files }> {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    const incoming = new Readable().wrap(req.body as any) as unknown as IncomingMessage;
    form.parse(incoming, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { fields, files } = await parseForm(request);
    
    // Handle fields to extract strings safely
    const firstName = Array.isArray(fields.first_name) ? fields.first_name[0] : fields.first_name;
    const lastName = Array.isArray(fields.last_name) ? fields.last_name[0] : fields.last_name;
    let profilePictureUrl = null;

    if (files.profilePicture) {
      const file = files.profilePicture[0] as File;
      const data = await fs.readFile(file.filepath);

      const uploadDir = path.join(process.cwd(), "public", "uploads", session.user.id);
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, file.originalFilename || "profile.jpg");
      await fs.writeFile(filePath, data);

      profilePictureUrl = `/uploads/${session.user.id}/${file.originalFilename || "profile.jpg"}`;
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const usersCollection = client.db().collection("users");

    const updateData: any = {};
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (profilePictureUrl !== null) updateData.profilePictureUrl = profilePictureUrl;

    await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateData }
    );

    client.close();

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
