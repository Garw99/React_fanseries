import React, { useState, useEffect } from "react";
import CatalogHorizCarousel from "./catalogHorizCarousel";
import HorizontalCatalogCard from "./horizontalCatalogCard";

function CatalogComponent(props)
{
    const [dataCatalog, setDataCatalog] = useState();
    const [filtersStatus, setFiltersStatus] = useState();

    const changeComponentData = () =>
    {
        setDataCatalog(props.elementsData);
        setFiltersStatus(props.filterStatus);
    }

    // eslint-disable-next-line no-extend-native
    Array.prototype.shuffle = function()
    {
        for (var i = 0; i < this.length; i++)
        {
            var a = this[i];
            var b = Math.floor(Math.random() * this.length);
            this[i] = this[b];
            this[b] = a;
        }
    }

    const getKeys = (obj) =>
    {
        var arr = new Array();
        for (var key in obj)
            arr.push(key);
        return arr;
    }

    const shuffleProperties = (obj) =>
    {
        var new_obj = {};
        var keys = getKeys(obj);
        keys.shuffle();
        for (var key in keys){
            if (key == "shuffle") continue; // skip our prototype method
            new_obj[keys[key]] = obj[keys[key]];
        }
        return new_obj;
    }

    useEffect(()=>
    {
        changeComponentData();
    });

    if(dataCatalog != null && filtersStatus != null)
    {
        if(filtersStatus === true)
        {
            if(dataCatalog !== null && typeof dataCatalog !== "undefined" && dataCatalog.length !== 0)
            {
                return(
                    <>
                        <div className="catalogResult-title">Risultati</div>
                        <div key={"catalogFromFilters"} className="catalogResultFilters__Container">
                            {
                                /* dataCatalog.map((element) =>
                                {
                                    return(<HorizontalCatalogCard cardsOnClickEvent={props.onClickCardFunction} key={element} elementTitle={element} carouselId={"singleCard"}></HorizontalCatalogCard>);
                                }) */
                            }
                        </div>
                    </>
                );
            }
            else
            {
                return(
                    <>
                        <div className="catalogResult-title">Nessun risultato</div>
                    </>
                );
            }
        }
        else if(filtersStatus === false)
        {
            const data = shuffleProperties(dataCatalog);

            return(
                Object.keys(data).map((key, index) =>
                {
                    if(data[key].length >= 5)
                    {
                        return(
                            <CatalogHorizCarousel cardsOnClickEvent={props.onClickCardFunction} key={key} title={key} slide={15} elements={data[key]}></CatalogHorizCarousel>
                        )
                    }
                })
            );
        }
    }
    else
    {
        return(<></>);
    }
}

export default CatalogComponent;