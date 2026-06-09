export type SettingItem = {
  id: string;
  settingKey: string;
  settingValue: string;
  settingGroup: string;
  valueType: string;
  isEncrypted: boolean;
  description?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type SettingFormValues = {
  settingKey: string;
  settingValue: string;
  settingGroup: string;
  valueType: string;
  description: string;
  isActive: boolean;
};

export const SETTING_VALUE_TYPES = ["TEXT", "NUMBER", "BOOLEAN", "JSON"] as const;
