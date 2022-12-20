import { useState, useCallback, useRef, useEffect } from "react";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useTranslation } from "react-i18next";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { MapboxEvent } from "mapbox-gl";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_KEY || "";

interface Props {
  onResult: (address: MapboxGeocoder.Result) => any;
  address?: string;
  required?: boolean;
}

export default function GeocoderSelector(props: Props) {
  const { t } = useTranslation();
  const refDiv = useRef<any>();

  useEffect(() => {
    const _geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      placeholder: t("enterYourAddress"),
    });

    _geocoder.addTo(refDiv.current);

    if (props.required) {
      (refDiv.current as HTMLDivElement)
        .querySelector("input")
        ?.setAttribute("required", "required");
    }

    _geocoder.on("result", (e: { result: MapboxGeocoder.Result }) => {
      props.onResult(e.result);
    });

    return () => {
      _geocoder.clear();
    };
  }, []);

  return <div className="relative z-20" ref={refDiv}></div>;
}
