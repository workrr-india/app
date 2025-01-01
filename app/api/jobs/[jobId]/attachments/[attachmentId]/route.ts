import { storage } from "@/config/firebase.config";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { jobId: string; attachmentId: string } }
) => {
  try {
    const { userId } = auth();
    const { jobId, attachmentId } = params;

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID Is missing", { status: 401 });
    }

    const attachment = await db.attachment.findUnique({
      where: {
        id: attachmentId,
      },
    });

    if (!attachment || attachment.jobId !== params.jobId) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // delete from the firebase storage
    const storageRef = ref(storage, attachment.url);
    await deleteObject(storageRef);

    // delete from mongodb
    await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    return NextResponse.json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.log(`[JOB_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
