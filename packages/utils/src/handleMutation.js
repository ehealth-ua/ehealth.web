import { normalizeErrors } from "./";

const handleMutation = async (mutation, prefix) => {
  const { errors, data } = await mutation;
  if (errors) throw normalizeErrors(errors, prefix);
  return data;
};

export default handleMutation;
