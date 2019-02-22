import { normalizeErrors } from "@ehealth/utils";

const handleMutation = async (mutation, action) => {
  const { errors } = await mutation();
  if (!errors && action) action();
  return normalizeErrors(errors);
};

export default handleMutation;
