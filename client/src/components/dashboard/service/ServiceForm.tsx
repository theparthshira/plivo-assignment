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
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { SERVICE_TYPES } from "../../../utils/constant";
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
import { useAppDispatch, useAppSelector } from "../../../lib/reduxHook";
import { createService, getServices } from "../../../redux/service";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type ServiceFormProps = {
  children: React.ReactNode;
};

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
});

const ServiceForm = ({ children }: ServiceFormProps) => {
  const dispatch = useAppDispatch();

  const { currentOrganisation } = useAppSelector((state) => state.organisation);
  const { user } = useAppSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // Add default values to prevent "uncontrolled to controlled" warnings
      name: "",
      type: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      await dispatch(
        createService({
          Name: data.name,
          ServiceType: data.type,
          OrgID: currentOrganisation?.id,
          CreatedBy: user?.id,
        })
      );
    } catch (err) {
      console.log("err =====", err);
    } finally {
      const queryParams = new URLSearchParams(location.search);
      const id = queryParams.get("org") || "0";

      dispatch(getServices(id));
      setIsDialogOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
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

export default ServiceForm;
