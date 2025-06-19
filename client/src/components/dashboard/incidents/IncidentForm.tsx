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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  addIncident,
  getAllIncidents,
  getServiceIncident,
} from "../../../redux/incident";

type ServiceFormProps = {
  children: React.ReactNode;
};

const FormSchema = z.object({
  service: z
    .string({
      required_error: "Please select service.",
    })
    .min(1, { message: "Please select service." }),
  description: z
    .string({
      required_error: "Please enter description.",
    })
    .min(1, { message: "Please enter description." }),
});

const IncidentForm = ({ children }: ServiceFormProps) => {
  const dispatch = useAppDispatch();

  const { currentOrganisation } = useAppSelector((state) => state.organisation);
  const { services } = useAppSelector((state) => state.service);

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      await dispatch(
        addIncident({
          ServiceType: "SERVICE",
          Description: data.description,
          ServiceID: parseInt(data.service),
          OrgID: currentOrganisation?.id,
        })
      );
    } catch (err) {
      console.log("err =====", err);
    } finally {
      dispatch(getAllIncidents(currentOrganisation?.id));
      dispatch(getServiceIncident(parseInt(data.service)));
      setIsDialogOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new incident</DialogTitle>
          <DialogDescription>
            Create a new incident with description of the issue.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="type">Service</FormLabel>{" "}
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
                      {services?.map((service) => (
                        <SelectItem
                          key={service?.name}
                          value={service?.id?.toString() || ""}
                        >
                          {service.name}
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
              name="description"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="name">Description</FormLabel>{" "}
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

export default IncidentForm;
