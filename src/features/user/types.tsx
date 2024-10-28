import { UserInfo } from "firebase/auth";

export interface UserData {
  authIsReady: boolean;
  info: UserInfo | null;
}
