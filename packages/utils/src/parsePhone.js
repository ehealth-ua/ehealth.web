const parsePhone = string => `+${string.replace(/[^\d]/g, "").substr(0, 12)}`;

export default parsePhone;
