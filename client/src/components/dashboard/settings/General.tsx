import { Button } from "../../ui/button";
import { FormLabel } from "../../ui/form";
import { Input } from "../../ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Label } from "../../ui/label";
import { useAppDispatch, useAppSelector } from "../../../lib/reduxHook";
import {
  getOrganisation,
  updateOrganisation,
} from "../../../redux/organisation";
import { getUserOrganisations } from "../../../redux/user";

const GeneralSetting = () => {
  const dispatch = useAppDispatch();
  const { currentOrganisation } = useAppSelector((state) => state.organisation);
  const { user } = useAppSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(currentOrganisation?.name || "");
  const [error, setError] = useState(false);

  const onSubmit = async () => {
    if (!name || name?.length <= 0) {
      setError(true);
      return;
    }

    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    const org_id = queryParams.get("org") || "0";

    try {
      await dispatch(
        updateOrganisation({
          id: org_id,
          Name: name,
        })
      );
    } catch (err) {
      console.log("err =====", err);
    } finally {
      dispatch(getOrganisation(org_id));
      dispatch(getUserOrganisations(user?.id));
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">General</h2>
        <p className="text-gray-600">General settings for the organisation.</p>
      </div>

      <div className="space-y-6">
        <Label htmlFor="name" className="text-xl">
          Organisation Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setError(false);
            setName(e.target.value);
          }}
          placeholder="Organisation name"
        />

        {error && (
          <div className="text-red-600 text-sm">
            Please enter organisation name.
          </div>
        )}

        <Button type="submit" disabled={isLoading} onClick={onSubmit}>
          {isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Spinner icon
          )}
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default GeneralSetting;
