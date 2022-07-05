import CatalogComponent from "../components/catalogComponent";
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useState, useRef } from "react";
import Select from 'react-select';
import axios from "axios";

import CatalogClass from "../classes/classCatalog";

function CatalogPage()
{
    const filterObj =
    {
        "genre": {"active":false, "search":"default"},
        "type": {"active":false, "search":"default"},
        "year": {"active":false, "search":"default"},
        "studio": {"active":false, "search":"default"},
        "search": {"active":false, "search":"default"},
    };

    const filtersOptionsData =
    {
        "dataPresent": false,
        "optionsData": {
            "genre": [],
            "type": [],
            "year": [],
            "studio": [],
        },
    };

    const genreFilterBlock = useRef();
    const typeFilterBlock = useRef();
    const yearFilterBlock = useRef();
    const searchBarFilterBlock = useRef();

    const onClear = () =>
    {
        genreFilterBlock.current.clearValue();
        typeFilterBlock.current.clearValue();
        yearFilterBlock.current.clearValue();
        searchBarFilterBlock.current.value = "";

        setFilters(filterObj);
    };

    const [catalogFiltersData, setCatalogFiltersData] = useState([]);
    const [filters, setFilters] = useState(filterObj);

    const catalog = new CatalogClass(filters, filtersOptionsData);

    const getCatalogFiltersData = async () =>
    {
        try
        {
            const response = await axios.get('/api/catalogFiltersData');
            setCatalogFiltersData(response);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const changeCatalogData = () =>
    {
        catalog.elementsListFromFilters = catalogFiltersData.data;
    }

    const updateFilters = (key, active, search) =>
    {
        setFilters({...filters, [key]: {"active": active, "search": search}});
    }

    useEffect(()=>
    {
        getCatalogFiltersData();
    },[]);
    
    if(catalogFiltersData.status === 200)
    {
        let loader = document.querySelector(".loader")
        if(loader != null)
        {
            loader.classList.remove("loader--visible")
        }
        
        changeCatalogData();

        const genresOptions = [];
        const typesOptions = [];
        const yearsOptions = [];
        const studioOptions = [];

        catalog.filtersOptions.optionsData.genre.forEach(element =>
        {
            genresOptions.push({ value: element, label: element});
        });

        catalog.filtersOptions.optionsData.type.forEach(element =>
        {
            typesOptions.push({ value: element, label: element});
        });

        catalog.filtersOptions.optionsData.year.forEach(element =>
        {
            yearsOptions.push({ value: element, label: element});
        });

        catalog.filtersOptions.optionsData.studio.forEach(element =>
        {
            studioOptions.push({ value: element, label: element});
        });

        return(
            <div className="catalog__container">
                <h3>Catalogo</h3>
                <div className="catalogFilters">
                    <Select ref={genreFilterBlock} key={"selectGenres"} options={genresOptions} placeholder="Genere" onChange={(option) => { updateFilters("genre", option !== null ? true:false, option !== null ? option.value:"default"); }} className="select" noOptionsMessage={() => "Genere non trovato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    <Select ref={typeFilterBlock} key={"selectType"} options={typesOptions} placeholder="Tipologia" onChange={(option) =>  { updateFilters("type", option !== null ? true:false, option !== null ? option.value:"default"); }} className="select" noOptionsMessage={() => "Tipo non trovato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    <Select ref={yearFilterBlock} key={"selectYears"}  options={yearsOptions} placeholder="Anno" onChange={(option) => { updateFilters("year", option !== null ? true:false, option !== null ? option.value:"default"); }} className="select" noOptionsMessage={() => "Anno non trovato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    {/* <Select key={"selectStudio"}  options={studioOptions} placeholder="Studio" onChange={(option) => { updateFilters("studio", option !== null ? true:false, option !== null ? option.value:"default"); }} className="select" noOptionsMessage={() => "Studio non trovato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/> */}
                    <input ref={searchBarFilterBlock} key={"inputSearch"} onChange={(event) => { updateFilters("search", event.target.value !== "" ? true:false, event.target.value !== "" ? event.target.value:"default"); }} placeholder="Cerca..."></input>
                    <div className="catalogFilters--trashIcon" onClick={() => { onClear() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></svg>
                    </div>
                    <div className="catalogFilters--filtersIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.479 2l-7.479 12.543v5.924l-1-.6v-5.324l-7.479-12.543h15.958zm3.521-2h-23l9 15.094v5.906l5 3v-8.906l9-15.094z"/></svg>
                    </div>
                </div>
                <div className="catalog--content">
                    <CatalogComponent key={"catalog"} elementsData={catalog.catalogData} filterStatus={catalog.filtersActive}></CatalogComponent>
                </div>
            </div>
        )
    }
    else
    {
        let loader = document.querySelector(".loader")
        if(loader != null)
        {
            loader.classList.add("loader--visible")
        }

        return(<></>);
    }
}

export default CatalogPage;