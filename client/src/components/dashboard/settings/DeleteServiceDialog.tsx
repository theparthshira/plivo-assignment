import type React from "react";
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
import { useState } from "react";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../lib/reduxHook";
import { deleteMember, getMembers } from "../../../redux/member";

const DeleteMemberDialog = ({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();

  const { currentOrganisation } = useAppSelector((state) => state.organisation);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(deleteMember(id));
    } catch (err) {
      console.log("err =====", err);
    } finally {
      dispatch(getMembers(currentOrganisation?.id));
      setIsDeleteOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new service</DialogTitle>
          <DialogDescription>
            Create new service with name and type of your service
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={() => handleDelete()}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Spinner icon
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMemberDialog;
