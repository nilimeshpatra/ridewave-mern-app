import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
const MapsContext = createContext({ isLoaded: false });
const LIBRARIES = ["places"];
export const MapsProvider = ({ children }) => {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, libraries: LIBRARIES });
  return <MapsContext.Provider value={{ isLoaded }}>{children}</MapsContext.Provider>;
};
export const useMaps = () => useContext(MapsContext);
