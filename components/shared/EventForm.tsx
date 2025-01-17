"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DropDown from "./DropDown";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "./FileUploader";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { Checkbox } from "@/components/ui/checkbox";
import { createEvent, updateEvent } from "@/lib/actions/event.action";
import { createEprops, IEvent } from "@/types";

const eventDefaultValues = {
  eventTitle: "",
  category: "",
  description: "",
  imageUrl: "",
  location: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  price: "",
  isFree: false,
  url: "",
};

const formSchema = z.object({
  eventTitle: z
    .string()
    .min(2, { message: "Event Title must be at least 2 characters." })
    .nonempty("Event Title is required."),
  category: z.string().nonempty("Category is required."),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .nonempty("Description is required."),
  imageUrl: z.string().url("Add image").nonempty("Image URL is required."),
  location: z.string().nonempty("Location is required."),
  startDateTime: z.date({
    invalid_type_error: "Start DateTime must be a valid date.",
  }),
  endDateTime: z.date({
    invalid_type_error: "End DateTime must be a valid date.",
  }),
  price: z.string().nonempty("Price is required."),
  isFree: z.boolean(),
  url: z.string().url("URL must be a valid URL.").nonempty("URL is required."),
});

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
  event?: IEvent;
  eventId?: string;
};

export default function EventForm({
  userId,
  type,
  event,
  eventId,
}: EventFormProps) {
  const initialValues =
    event && type === "Update"
      ? {
          eventTitle: event.eventTitle,
          category: event.category._id,
          description: event.description,
          imageUrl: event.imageUrl,
          location: event.location,
          price: event.price,
          isFree: event.isFree,
          url: event.imageUrl,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues;

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      console.log("---------------", userId);
      return;
    }
    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          userId,
          values,
        });
        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          values,
          event,
        });
        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 overflow-hidden"
      >
        <div className="mx-1">
          <FormField
            control={form.control}
            name="eventTitle"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="bg-gray-50 h-[54px] placeholder-gray-500 mt-2 rounded-md px-4 py-3 text-[16px] border-none focus:ring-0 focus:outline-none"
                    placeholder="Event Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mx-1">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <DropDown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mx-1">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    className="bg-gray-50 h-[104px] placeholder-gray-500 mt-2 rounded-md px-4 py-3 text-[16px] border-none focus:ring-0 focus:outline-none"
                    placeholder="Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mx-1">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full bg-gray-50 h-[60px] placeholder-gray-500 rounded-md px-4  text-[16px] border-none focus:ring-0 focus:outline-none">
                <FormControl>
                  <FileUploader onFileChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-1">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex relative">
                    <Image
                      className="absolute left-2 top-5"
                      src="/assets/icons/location-grey.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                    />

                    <Input
                      placeholder="Event location or Online"
                      {...field}
                      className="bg-gray-50 h-[54px] placeholder-gray-500 mt-2 rounded-md px-4 py-3 text-[16px] border-none focus:ring-0 focus:outline-none pl-8 ml-1"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* dates */}
        <div className="flex flex-col md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex items-center gap-3 bg-gray-50 h-[54px] placeholder-gray-500 mt-2 rounded-md py-3 text-[16px] border-none focus:ring-0 focus:outline-none ">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="ml-2"
                    />
                    <p className="text-gray-500">Start Date:</p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex items-center gap-3 bg-gray-50 h-[54px] placeholder-gray-500 mt-2 rounded-md py-3 text-[16px] border-none focus:ring-0 focus:outline-none">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="ml-2"
                    />
                    <p className="text-gray-500">End Date:</p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          {/* Price and Free Ticket */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormControl>
                  <div className="flex items-center h-[54px] w-full overflow-hidden rounded-md bg-grey-50 py-2 bg-gray-50 ">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="flex-grow p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem className="ml-4 flex items-center">
                          <FormControl>
                            <div className="flex items-center">
                              <label
                                htmlFor="isFree"
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Free Ticket
                              </label>
                              <Checkbox
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id="isFree"
                                className="h-5 w-5 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* URL Field */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className=" flex relative ">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="link"
                      width={24}
                      height={24}
                      className="absolute top-3"
                    />
                    <Input
                      placeholder="URL"
                      {...field}
                      className="flex items-center h-[54px] w-full overflow-hidden  bg-grey-50 py-2  bg-gray-50 placeholder-gray-500  rounded-md border-none focus:ring-0 focus:outline-none pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="bg-[#624CF5] hover:bg-[#533af4] col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Event `}
        </Button>
      </form>
    </Form>
  );
}
