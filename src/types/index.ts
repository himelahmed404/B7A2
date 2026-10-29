export type Role = "contributor" | "maintainer";

export type Query = {
  sort?: "newest" | "oldest" ;
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved" | "closed";
};
