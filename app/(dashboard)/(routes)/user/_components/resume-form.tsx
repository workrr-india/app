"use client";

import { AttachmentsUploads } from "@/components/attachments-uploads";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, Attachment, UserProfile, Resumes } from "@prisma/client";
import axios from "axios";
import {
  File,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  ShieldCheck,
  ShieldX,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ResumeFormProps {
  initialData: (UserProfile & { resumes: Resumes[] }) | null;
  userId: string;
}

const formSchema = z.object({
  resumes: z.object({ url: z.string(), name: z.string() }).array(),
});

export const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isActiveResumeId, setIsActiveResumeId] = useState<string | null>(null);
  const router = useRouter();

  // Assuming initialData is available and has type of any
  const initialResumes = Array.isArray(initialData?.resumes)
    ? initialData.resumes.map((resume: any) => {
        if (
          typeof resume === "object" &&
          resume !== null &&
          "url" in resume &&
          "name" in resume
        ) {
          return { url: resume.url, name: resume.name };
        }
        return { url: "", name: "" }; // Provide default values if the shape is incorrect
      })
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumes: initialResumes,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values, userId);
    try {
      const response = await axios.post(`/api/users/${userId}/resumes`, values);
      toast.success("Resume updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const onDelete = async (resume: Resumes) => {
    try {
      setDeletingId(resume.id);
      if (initialData?.activeResumeId === resume.id) {
        toast.error("Can't Delete the active resume");
        return;
      }
      await axios.delete(`/api/users/${userId}/resumes/${resume.id}`);
      toast.success("Resume Removed");
      router.refresh();
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const setActiveResumeId = async (resumeId: string) => {
    setIsActiveResumeId(resumeId);
    const response = await axios.patch(`/api/users/${userId}`, {
      activeResumeId: resumeId,
    });
    toast.success("Resume Activated");
    router.refresh();
    try {
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something went wrong");
    } finally {
      setIsActiveResumeId(null);
    }
  };

  return (
    <div className="mt-6 border flex-1 w-full rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Your Resumes
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {/* display the attachments if not editing */}
      {!isEditing && (
        <div className="space-y-2">
          {initialData?.resumes.map((item) => (
            <div className="grid grid-cols-12 gap-2" key={item.id}>
              <div
                key={item.url}
                className="p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md flex items-center col-span-10"
              >
                <File className="w-4 h-4 mr-2 " />
                <p className="text-xs w-full truncate">{item.name}</p>
                {deletingId === item.id && (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="p-1"
                    type="button"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
                )}
                {deletingId !== item.id && (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="p-1"
                    onClick={() => {
                      onDelete(item);
                    }}
                    type="button"
                  >
                    <X className="w-4 h4" />
                  </Button>
                )}
              </div>

              <div className="col-span-2 flex items-center justify-start gap-2">
                {isActiveResumeId === item.id ? (
                  <>
                    <div className="flex items-center justify-center w-full">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "flex items-center justify-center",
                        initialData.activeResumeId === item.id
                          ? "text-emerald-500"
                          : "text-red-500"
                      )}
                      onClick={() => setActiveResumeId(item.id)}
                    >
                      <p>
                        {initialData.activeResumeId === item.id
                          ? "Live"
                          : "Activate"}
                      </p>

                      {initialData.activeResumeId === item.id ? (
                        <ShieldCheck className="w-4 h-4 ml-2" />
                      ) : (
                        <ShieldX className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* on editing mode display the input */}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(resumes) => {
                        if (resumes) {
                          onSubmit({ resumes });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
