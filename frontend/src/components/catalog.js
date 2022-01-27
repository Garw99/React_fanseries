import React, { useState, useEffect } from "react";
import CatalogHorizCarousel from "./catalogHorizCarousel";
import HorizontalCatalogCard from "./horizontalCatalogCard";

function Catalog(props)
{
    const [dataCatalog, setDataCatalog] = useState();

    const changeDataCatalog = () =>
    {
        setDataCatalog(props.dataElements);
    }

    useEffect(()=>
    {
        changeDataCatalog();
    });

    if(typeof dataCatalog !== "undefined")
    {
        if(dataCatalog.filter !== "default")
        {
            const data = dataCatalog.catalogData;

            return(
                <>
                    <div key={"catalogFromFilters"} className="catalogResultFilters__Container">
                        {
                            data.map((element) =>
                            {
                                const { elementName } = element

                                const idElement = elementName;
                                
                                return(<HorizontalCatalogCard key={idElement} dataElement={element} carouselId={"singleCard"}></HorizontalCatalogCard>);
                            })
                        }
                    </div>
                </>
            );
        }
        else if(dataCatalog.filter === "default")
        {
            const data = dataCatalog.catalogData;

            return(
                    <>
                        {
                            Object.keys(data).map(function(key, index)
                            {
                                return(
                                    <>
                                        <CatalogHorizCarousel key={key} title={key} slide={12} elements={data[key]}></CatalogHorizCarousel>
                                    </>
                                )
                            })
                        }
                    </>
            );
        }
    }
    else
    {
        return(<></>);
    }
}

export default Catalog;