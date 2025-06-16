import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { useAppDispatch } from "../../lib/reduxHook";
import {
  createOrganisation,
  updateCurrentOrganisation,
} from "../../redux/organisation";
import { useNavigate } from "react-router";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Please enter organisation name.",
    })
    .refine((val) => val.length > 0),
});

const CreateOrganisation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("data =====", data);

    const response: any = await dispatch(
      createOrganisation({
        Name: data.name,
        CreatedBy: 1,
        MemberType: "ADMIN",
      })
    );

    console.log("response =====", response);
    const organisation = response?.payload?.data;
    dispatch(updateCurrentOrganisation(organisation));
    navigate(`/dashboard?org=${organisation?.id}&tab=services`);
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xl">Create Organisation</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => form.setValue("name", e.target.value)}
                  placeholder="Organisation name"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateOrganisation;
