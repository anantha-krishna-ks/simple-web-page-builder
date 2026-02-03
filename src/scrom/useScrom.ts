import { useEffect } from "react";
import { API } from "./scromAPI";

export const useScorm = (): void => {
  useEffect(() => {
    (window as any).API = API;

    return () => {
      if ((API as any).initialized) {
        API.LMSFinish("");
      }
      delete (window as any).API;
    };
  }, []);
};