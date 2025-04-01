import { useEffect, useState } from "react";
import { ArrowsExpandIcon, XIcon } from "@heroicons/react/outline";

const Legend = ({config, selectedMap, isMobile}) => {

  const [isMaximized, setIsMaximized] = useState(false)
  const [legendItems, setLegendItems] = useState([])

  const resizeBtnClickHandler = (e) => {
    e.preventDefault()
    setIsMaximized(!isMaximized)   
  }

  useEffect(() => {
    if(isMobile === false) {
      console.log(isMobile)
      setIsMaximized(true)
    }
  }, [isMobile])

  useEffect(() => {
    if(selectedMap === null) { return; }

    if(!config.maps[selectedMap].hasOwnProperty("states")) {
      let layers = Object.keys(config.maps[selectedMap])
        .filter(key => key !== "name")
        .map(key => ({ key, ...config.maps[selectedMap][key] })); 
      layers.push(config.na_option)
      setLegendItems(layers)
      return          
    }

    setLegendItems([config.maps[selectedMap], config.na_option])

  }, [selectedMap])  

  return (
    <div className={`fixed ${isMaximized ? `md:pt-20` : `pt-4`} bottom-[0px] md:bottom-0 ${isMaximized ? `h-9/10` : `h-auto`} md:h-screen w-full md:w-1/3 lg:w-1/4 ${isMaximized ? `top-0` : `top-1/10`} left-0 z-48 p-4 pt-20 bg-[#d8d8d8] transition-all duration-300 ease-in-out`}>
      
      <div class="flex flex-row items-center">
        <div class="w-1/2 flex justify-start">
          <span className="text-lg text-gray-600">Legend</span>
        </div>
        <div class="w-1/2 flex justify-end md:hidden">
          { !isMaximized ?
            <a href="#" onClick={resizeBtnClickHandler} className="h-[20px] w-[20px] block">
              <ArrowsExpandIcon />
            </a>        
            :
            <a href="#" onClick={resizeBtnClickHandler} className="h-[20px] w-[20px] block">
              <XIcon />
            </a>             
          }
        </div>
      </div>

      {isMaximized ?
        <ul className="list-none">
            {legendItems && legendItems.map((item) => {
              return (<li>
                <div className="flex flex-rows gap-2 text-center my-4 items-center">
                  <svg width="50" height="25" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="25" fill={item.color} />
                  </svg>
                  <span className="uppercase text-sm md:text-md">{item.legend}</span>
                </div>
              </li>)                
            })}
        </ul>
      :
        ''
      }
    </div>
  )
}

export default Legend