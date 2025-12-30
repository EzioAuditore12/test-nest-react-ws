export type DeviceConfigStoreType = {
  expoPushToken: string | null;
  setExpoPushToken: (token: string) => void;
  clearExpoPushToken: () => void;
};
