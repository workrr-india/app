import nodemailer from "nodemailer";
import handlebars from "handlebars";
import toast from "react-hot-toast";
import { text } from "stream/consumers";
import { ThankYouTemplate } from "./designs/thank-you";
import { SendSelectedTempalte } from "./designs/send-selected-tempalte";
import { SendRejectionTemplate } from "./designs/send-rejection-template";

export const sendMail = async ({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) => {
  const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const textResult = await transport.verify();
    console.log(text);
  } catch (error) {
    console.log(error);
    toast.error((error as Error)?.message);
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    return sendResult;
  } catch (error) {
    console.log(error);
    toast.error((error as Error)?.message);
  }
};

export const compileThankyouEmailTemplate = (name: string) => {
  const template = handlebars.compile(ThankYouTemplate);

  const htmlBody = template({
    name: name,
  });

  return htmlBody;
};

export const compileSendSelectedEmailTemplate = (name: string) => {
  const template = handlebars.compile(SendSelectedTempalte);

  const htmlBody = template({
    name: name,
  });

  return htmlBody;
};

export const compileSendRejectionEmailTemplate = (name: string) => {
  const template = handlebars.compile(SendRejectionTemplate);

  const htmlBody = template({
    name: name,
  });

  return htmlBody;
};
