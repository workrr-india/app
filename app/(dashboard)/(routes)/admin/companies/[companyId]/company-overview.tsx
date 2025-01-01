"use client";

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company, Job } from "@prisma/client";
import axios from "axios";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanyOverviewFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  overview: z.string().min(1),
});

export const CompanyOverviewForm = ({
  initialData,
  companyId,
}: CompanyOverviewFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollname, setRollname] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overview: initialData?.overview || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Generate an overview content about ${rollname}. Include information about its history, purpose, features, user base, and impact on the industry. Focus on providing a comprehensive yet concise summary suitable for readers unfamiliar with the platform.`;

      await getGenerativeAIResponse(customPrompt).then((data) => {
        data = data.replace(/^'|'$/g, "");
        let cleanedText = data.replace(/[\*\#]/g, "");
        // form.setValue("description", cleanedText);
        setAiValue(cleanedText);
        setIsPrompting(false);
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong...");
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Overview
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* display the description if not editing */}
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.overview && "text-neutral-500 italic"
          )}
        >
          {!initialData.overview && "No overview"}
          {initialData.overview && <Preview value={initialData.overview} />}
        </div>
      )}

      {/* on editing mode display the input */}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g 'Mahalakshmi Design Studioz'"
              value={rollname}
              onChange={(e) => setRollname(e.target.value)}
              className="w-full p-2 rounded-md"
            />

            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className="w4 h-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGeneration}>
                  <Lightbulb className="w4 h-4 " />
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Note: Type the company name overhere to generate the overview
            content
          </p>

          {aiValue && (
            <div className="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
              {aiValue}

              <Button
                className="absolute top-3 right-3 z-10"
                variant={"outline"}
                size={"icon"}
                onClick={onCopy}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
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
        </>
      )}
    </div>
  );
};
