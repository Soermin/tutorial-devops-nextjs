export type AdminActionState = {
  message: string;
  status: "error" | "idle";
};

export const initialAdminActionState: AdminActionState = {
  message: "",
  status: "idle",
};
