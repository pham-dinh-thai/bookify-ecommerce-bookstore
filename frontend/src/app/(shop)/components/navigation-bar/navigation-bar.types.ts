type NavLink = {
  label: string;
  path?: string;
  children?: {
    label: string;
    path: string;
  }[];
};
