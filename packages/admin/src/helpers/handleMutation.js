import { normalizeErrors } from "@ehealth/utils";

const handleMutation = async (mutation, action, prefix) => {
  const { errors } = await mutation();
  if (!errors && action) action();
  return normalizeErrors(errors, prefix);
};

export default handleMutation;
