import { AvatarDAO } from "../../service/interfaces/AvatarDAO";
import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const BUCKET = "tweeter-avatars-dbl00m11";
const REGION = "us-west-2"

export class S3AvatarDAO implements AvatarDAO{
  async uploadAvatar(imageBytes: string, fileExtension: string, fileName: string): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageBytes.toString(),
      "base64"
    );
    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: `image/${fileExtension}`,
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return (
        `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`
      );
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}