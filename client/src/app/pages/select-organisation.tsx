import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { useAppDispatch, useAppSelector } from "../../lib/reduxHook";
import { useEffect, useState } from "react";
import type { OrganisationOptions } from "../../types/organisation";
import { useNavigate } from "react-router";
import { updateCurrentOrganisation } from "../../redux/organisation";

const FormSchema = z.object({
  organisation: z.string({
    required_error: "Please select a organisation.",
  }),
});

const SelectOrganisation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { organisations } = useAppSelector((state) => state.user);

  const [organisationList, setOrganisationList] = useState<OrganisationOptions>(
    []
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  console.log("form =====", form);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const currentOrganisation = organisations?.find(
      (organisation) => organisation.id?.toString() === data.organisation
    );
    navigate(`/dashboard?org=${data.organisation}&tab=services`);
    dispatch(updateCurrentOrganisation(currentOrganisation));
  }

  useEffect(() => {
    if (organisations && organisations?.length > 0) {
      setOrganisationList(
        organisations?.map((organisation) => ({
          label: organisation?.name,
          value: organisation?.id?.toString(),
        }))
      );
    }
  }, [organisations]);

  return (
    <div className="flex justify-center items-center mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="organisation"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xl">Organisation</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? organisationList.find(
                              (organisation) =>
                                organisation.value === field.value
                            )?.label
                          : "Select organisation"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search organisation..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {organisationList?.map((organisation) => (
                            <CommandItem
                              value={organisation.value}
                              key={organisation.label}
                              onSelect={() => {
                                form.setValue(
                                  "organisation",
                                  organisation.value
                                );
                              }}
                            >
                              {organisation.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  organisation.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the organisation that will be used in the dashboard.
                </FormDescription>
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

export default SelectOrganisation;
