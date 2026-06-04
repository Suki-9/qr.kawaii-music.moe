export type LinkRecord = {
  url: string;
  name: string;
  icon?: string; // base64 PNG data URL (32x32)
};

export type LinkTree = {
  title: string;
  icon?: string; // base64 PNG data URL (32x32)
  records: LinkRecord[];
};
