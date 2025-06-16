import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { SERVICE_TYPES, STATUS_TYPES } from "../../../utils/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form"; // Import FormControl
import { useAppDispatch } from "../../../lib/reduxHook";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { IService } from "../../../types/service";
import { getServices, updateService } from "../../../redux/service";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Please enter service name.",
    })
    .min(1, { message: "Please enter service name." }),
  type: z
    .string({
      required_error: "Please select service type.",
    })
    .min(1, { message: "Please select service type." }),
  status: z
    .string({
      required_error: "Please select service type.",
    })
    .min(1, { message: "Please select service type." }),
});

const UpdateServiceDialog = ({
  service,
  isUpdateOpen,
  setIsUpdateOpen,
}: {
  service: Partial<IService>;
  isUpdateOpen: boolean;
  setIsUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: service.name || "",
      type: service.service_type || "",
      status: service.service_status || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      await dispatch(
        updateService({
          id: service?.id,
          Name: data?.name,
          ServiceType: data?.type,
          ServiceStatus: data?.status,
        })
      );
    } catch (err) {
      console.log("err =====", err);
    } finally {
      const queryParams = new URLSearchParams(location.search);
      const id = queryParams.get("org") || "0";

      dispatch(getServices(id));
      setIsUpdateOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new service</DialogTitle>
          <DialogDescription>
            Create new service with name and type of your service
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="name">Name</FormLabel>{" "}
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Enter service name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="type">Type</FormLabel>{" "}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]" id="type">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_TYPES?.map((service) => (
                        <SelectItem key={service?.label} value={service?.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="status">Status</FormLabel>{" "}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]" id="status">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_TYPES?.map((status) => (
                        <SelectItem key={status?.label} value={status?.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Spinner icon
                )}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateServiceDialog;
