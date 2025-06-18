import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
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
import { addIncident, getAllIncidents } from "../../../redux/incident";
import { TEAM_ROLE } from "../../../utils/constant";
import { addMember } from "../../../redux/member";

type TeamFormProps = {
  children: React.ReactNode;
};

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please enter email.",
    })
    .min(1, { message: "Please enter email." }),
  name: z
    .string({
      required_error: "Please enter name.",
    })
    .min(1, { message: "Please enter name." }),
  member_type: z
    .string({
      required_error: "Please select member type.",
    })
    .min(1, { message: "Please select member type." }),
});

const TeamForm = ({ children }: TeamFormProps) => {
  const dispatch = useAppDispatch();

  const { currentOrganisation } = useAppSelector((state) => state.organisation);

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      member_type: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("data =====", data);
    setIsLoading(true);
    try {
      await dispatch(
        addMember({
          OrgID: currentOrganisation?.id,
          MemberType: data.member_type,
          Email: data.email,
          Name: data.name,
        })
      );
    } catch (err) {
      console.log("err =====", err);
    } finally {
      dispatch(getAllIncidents(currentOrganisation?.id));
      setIsDialogOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new member</DialogTitle>
          <DialogDescription>
            Add new member to the organisation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="member_type"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="type">Role</FormLabel>{" "}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]" id="type">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEAM_ROLE?.map((role) => (
                        <SelectItem key={role.label} value={role.value}>
                          {role.label}
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
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="email">Email</FormLabel>{" "}
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="name">Name</FormLabel>{" "}
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter name"
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
                Add member
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamForm;
