import type React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "../../../lib/reduxHook";
import { createService, getServices } from "../../../redux/service";

const DeleteServiceDialog = ({
  id,
  isDeleteOpen,
  setIsDeleteOpen,
}: {
  id: number;
  isDeleteOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(createService(id));
    } catch (err) {
      console.log("err =====", err);
    } finally {
      const queryParams = new URLSearchParams(location.search);
      const id = queryParams.get("org") || "0";

      dispatch(getServices(id));
      setIsDeleteOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
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

export default DeleteServiceDialog;
