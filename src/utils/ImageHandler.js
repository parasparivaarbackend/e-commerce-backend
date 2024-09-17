import fs from "fs";
import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";

dotenv.config();

const storage = new Storage({
  keyFilename: "keys.json",
});

export async function ImageUpload(file) {
  try {
    const bucket = storage.bucket(process.env.bucketName);
    const destination = `images/${file.filename}`;

    const data = await bucket.upload(file.path, {
      destination: destination,
      resumable: true,
      metadata: {
        contentType: file.mimetype,
      },
    });

    fs.unlinkSync(file.path);

    const image_url = `https://storage.googleapis.com/${data[1].bucket}/${data[1].name}`;
    return { image_url, image_id: data[1].name };
  } catch (err) {
    fs.unlinkSync(file.path);
    console.log(err);
  }
}

export async function deleteImage(fileName) {
  try {
    await storage.bucket(process.env.bucketName).file(fileName).delete();
    return "deleted successfully";
  } catch (err) {
    console.error("Error deleting file:", err);
    throw new Error("Failed to delete image");
  }
}
