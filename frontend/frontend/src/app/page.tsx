"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";

const API_URL = "http://localhost:5140/test/generateVideo";

interface FormData {
  name: string;
  text: string;
  pose: "seating" | "standing";
  ratio: "16:9" | "9:16";
}

interface Response {
  url: string;
}

export default function Home() {
  const form = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      text: "",
      pose: "seating",
      ratio: "16:9",
    },
  });

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      console.log(data);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log("Successful response!");
      const responseData: Response = await response.json();
      setVideoUrl(responseData.url);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <div className="h-80 flex items-center">
        <img src="/favicon.ico" alt="Logo" className="w-32 h-32" />
      </div>
      <div className="w-full h-1/2 min-h-160 flex mt-8 relative">
        <div className="w-1/2 flex items-center justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-3/4 max-w-200"
            >
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text"
                rules={{ required: "Text is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you want he/she to say?</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    {form.formState.errors.text && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.text.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex flex-row items-center justify-around">
                <FormField
                  control={form.control}
                  name="pose"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Choose the pose</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue="seating"
                          className="flex flex-row space-y-1"
                        >
                          <div>
                            <RadioGroupItem
                              value="seating"
                              id="seating"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="seating"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <svg
                                fill="#000000"
                                xmlns="http://www.w3.org/2000/svg"
                                width="40px"
                                height="40px"
                                viewBox="0 0 199.213 199.214"
                              >
                                <g>
                                  <g>
                                    <path
                                      d="M71.209,40.171c-11.241,0.336-20.62-8.384-20.95-19.475c-0.332-11.088,8.51-20.351,19.75-20.687
			C81.245-0.326,90.626,8.395,90.958,19.48C91.289,30.572,82.445,39.836,71.209,40.171z"
                                    />
                                    <path
                                      d="M48.636,56.892c-0.274-2.674,0.598-5.338,2.397-7.335c1.8-1.996,4.362-3.146,7.051-3.146h25.562
			c4.153,0,7.628,3.155,8.027,7.289l6.432,66.479h37.982c3.858,0,7.562,1.535,10.289,4.268c2.728,2.73,4.257,6.437,4.251,10.295
			l-0.081,53.627c-0.01,6.009-4.883,10.846-10.887,10.846c-0.007,0-0.015,0-0.021,0c-6.012,0-10.879-4.887-10.871-10.899
			l0.066-43.052c0-0.888-0.353-1.74-0.979-2.368c-0.627-0.629-1.479-0.981-2.367-0.981H67.146c-6.014,0-10.254-4.589-10.889-10.882
			C56.214,130.616,50.956,79.45,48.636,56.892z"
                                    />
                                  </g>
                                </g>
                              </svg>
                              Seating
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="standing"
                              id="standing"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="standing"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <svg
                                fill="#000000"
                                xmlns="http://www.w3.org/2000/svg"
                                width="40px"
                                height="40px"
                                viewBox="0 0 197.418 197.418"
                              >
                                <g>
                                  <g>
                                    <ellipse
                                      cx="110.241"
                                      cy="16.513"
                                      rx="16.732"
                                      ry="16.513"
                                    />
                                    <path
                                      d="M141.916,42.798c0-4.125-3.341-7.472-7.465-7.472H86.157c-4.125,0-7.498,3.347-7.498,7.472l0.06,22.133
			c0.003,1.106-0.435,2.169-1.218,2.951L57.25,88.121c-2.33,2.33-2.335,6.108-0.005,8.438c1.165,1.165,2.689,1.748,4.217,1.748
			c1.526,0,3.042-0.583,4.207-1.748l24.615-24.626v116.536c0,4.942,3.995,8.949,8.938,8.949s8.938-4.007,8.938-8.949v-67.628h4.309
			v67.628c0,4.942,3.994,8.949,8.937,8.949s8.938-4.007,8.938-8.949v-83.541c1.028,1.789,2.953,2.993,5.164,2.993
			c3.297,0,6.409-2.671,6.409-5.966V42.798H141.916z"
                                    />
                                  </g>
                                </g>
                              </svg>
                              Standing
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ratio"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Choose the format </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue="16:9"
                          className="flex flex-row space-y-1"
                        >
                          <div>
                            <RadioGroupItem
                              value="16:9"
                              id="16:9"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="16:9"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <svg
                                fill="#000000"
                                xmlns="http://www.w3.org/2000/svg"
                                width="40px"
                                height="40px"
                                viewBox="924 796 200 200"
                                enableBackground="new 924 796 200 200"
                              >
                                <g>
                                  <path
                                    d="M1003.992,882.528c11.051,0,20.008-8.958,20.008-20.008c0-11.047-8.958-20.007-20.008-20.007
		c-11.05,0-20.008,8.96-20.008,20.007C983.984,873.57,992.942,882.528,1003.992,882.528z"
                                  />
                                  <path
                                    d="M1110.195,816.042h-172.39c-7.612,0-13.805,6.193-13.805,13.805v132.306c0,7.611,6.193,13.806,13.805,13.806h172.39
		c7.611,0,13.805-6.194,13.805-13.806V829.847C1124,822.235,1117.807,816.042,1110.195,816.042z M937.805,828.1h172.39
		c0.963,0,1.747,0.784,1.747,1.747v68.164l-43.076-43.079l-57.94,57.937c-1.835,1.839-4.323,2.867-6.92,2.867
		c-2.595,0-5.083-1.028-6.919-2.867l-27.403-27.403l-33.626,33.624v-89.242C936.058,828.884,936.842,828.1,937.805,828.1z"
                                  />
                                </g>
                              </svg>
                              16:9
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="9:16"
                              id="9:16"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="9:16"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <svg
                                fill="#000000"
                                xmlns="http://www.w3.org/2000/svg"
                                width="40px"
                                height="40px"
                                viewBox="796 796 200 200"
                                enableBackground="new 796 796 200 200"
                              >
                                <g>
                                  <path
                                    d="M976.831,857.4l-56.942-56.942c-2.875-2.876-6.696-4.458-10.762-4.458H825.93c-8.393,0-15.218,6.828-15.218,15.221V980.78
		c0,8.394,6.825,15.22,15.218,15.22H966.07c8.391,0,15.218-6.826,15.218-15.22V868.162
		C981.288,864.098,979.706,860.275,976.831,857.4z M825.932,807.616h79.409c2.174,0,3.937,1.762,3.937,3.936v42.935
		c0,7.25,5.875,13.127,13.123,13.127h43.343c1.044,0,2.045,0.415,2.782,1.153c0.739,0.738,1.153,1.739,1.153,2.783l-0.001,61.748
		l-42.757-42.757l-39.93,39.927c-1.265,1.266-2.979,1.977-4.769,1.977c-1.788,0-3.503-0.711-4.769-1.977l-18.885-18.886
		l-36.242,36.242V811.221C822.327,809.233,823.943,807.616,825.932,807.616z"
                                  />
                                  <path
                                    d="M870.173,890.535c10.078,0,18.248-8.17,18.248-18.247c0-10.076-8.17-18.247-18.248-18.247s-18.248,8.171-18.248,18.247
		C851.925,882.365,860.095,890.535,870.173,890.535z"
                                  />
                                </g>
                              </svg>
                              9:16
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full mt-5" disabled={loading}>
                {loading ? "G E N E R A T I N G" : "G E N E R A T E"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="w-0.5 bg-black"></div>
        <div className="w-1/2 flex items-center justify-center">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-black border-dashed rounded-full animate-spin"></div>
            </div>
          ) : videoUrl ? (
            <video controls className="w-3/4 max-w-lg rounded-lg shadow-lg">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-gray-500">No video available</p>
          )}
        </div>
      </div>
    </div>
  );
}
