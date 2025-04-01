import { useEffect, useRef, useState } from "react";
import * as turf from '@turf/turf'
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import usaStatesGeoJson from '../../data/states.json'

const Map = ({config, selectedMap}) => {
  const map = useRef(null);
  const mapContainer = useRef(null);
  const [initialBounds, setInitialBounds] = useState(null)

  const updateMapContent = (stateList) => {
    if(map.current === null) { return; }

    if(!stateList.hasOwnProperty('states')) { 
      let layers = Object.keys(stateList)
        .filter(key => key !== "name")
        .map(key => ({ key, ...stateList[key] }));

      let filterExpression = ["case"]
      layers.forEach((layer) => {
        filterExpression.push(["in", ["get", "STUSPS"], ["literal", layer.states]])
        filterExpression.push(layer.color)
      })
      filterExpression.push(config.na_option.color)

      map.current.setPaintProperty("states-fill-lyr", "fill-color", filterExpression)

      return 
    }

    let condition = ["in", ["get", "STUSPS"], ["literal", stateList.states]]

    map.current.setPaintProperty("states-fill-lyr", "fill-color", [
      "case",
      condition,
      stateList.color,
      config.na_option.color
    ])
  }

  useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: 'Empty Style',
        sources: {},
        layers: [],
      },
      center: [-100, 40],
      zoom: 3.2
    });

    map.current.on("load", () => {

      // Fit bounds to USA extent
      const llb = turf.bbox(usaStatesGeoJson)
      const sw = new maplibregl.LngLat(llb[0], llb[1]); // Southwest corner
      const ne = new maplibregl.LngLat(llb[2], llb[3]); // Northeast corner
      const bounds = new maplibregl.LngLatBounds(sw, ne);

      setInitialBounds(bounds)

      map.current.addSource("states-src", {"type": "geojson", "data": usaStatesGeoJson})

      map.current.addLayer({
        "id": "states-fill-lyr",
        "type": "fill",
        "source": "states-src",
        "paint": {
          "fill-color": "rgba(0,0,0,0)"
        }
      })
      map.current.addLayer({
        "id": "states-line-lyr",
        "type": "line",
        "source": "states-src",
        "paint": {
          "line-color": "#000",
          "line-width": 1
        }
      }) 
      
      map.current.fitBounds(bounds, {"padding": {top: 30, bottom:30, left: 30, right: 30}})
      //map.current.setMaxBounds(bounds)
    })
    
    return () => map.current.remove();
  }, []);    
  
  useEffect(() => {
    if(selectedMap === null) { return; }
    console.log(selectedMap)
    updateMapContent(config.maps[selectedMap])
  }, [selectedMap])

  return (
    <div ref={mapContainer} className="fixed left-0 md:left-1/4 top-0 md:top-0 bottom-[57px] md:bottom-0 right-0" />
  )
}

export default Map;