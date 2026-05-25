export type AdminActionState = {
  message: string;
  redirectTo?: string;
  status: "error" | "idle" | "success";
};

export const initialAdminActionState: AdminActionState = {
  message: "",
  status: "idle",
};
