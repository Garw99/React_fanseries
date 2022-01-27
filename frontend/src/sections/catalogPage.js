import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from 'react-select';
import CatalogComponent from "../components/catalog";

import CatalogClass from "../classes/classCatalog";

function CatalogPage()
{
    const [allElementsData, setAllElementsData] = useState([]);
    const [filter, setFilter] = useState("default");
    const [search, setSearch] = useState("default");

    const catalog = new CatalogClass(filter, search);

    const getAllElementsData = async () =>
    {
        try
        {
            const response = await axios.get('/api/listAllElementsData');
            setAllElementsData(response);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const changeCatalogData = () =>
    {
        catalog.generalElementsData = allElementsData.data;
    }

    const changeFilter = () =>
    {
        catalog.filter = filter;
    }

    const changeSearch = () =>
    {
        catalog.searchString = search;
    }

    useEffect(()=>
    {
        getAllElementsData();
    },[]);

    useEffect(()=>
    {
        changeFilter();
        changeSearch();
    },[filter, search]);

    if(allElementsData.status === 200)
    {
        changeCatalogData();

        const genresOptions = [];
        const typesOptions = [];
        const yearsOptions = [];
        const studioOptions = [];

        catalog.listGenres.forEach(element =>
        {
            genresOptions.push({ value: element, label: element});
        });

        catalog.listYears.forEach(element =>
        {
            yearsOptions.push({ value: element, label: element});
        });

        return(
            <>
                <div className="catalog__container">
                    <h3>Catalogo</h3>
                    <div className="catalogFilters">
                        <Select key={"selectGenres"} options={genresOptions} placeholder="Genere" isClearable onChange={(option) => { setSearch(option !== null ? option.value : "default"); setFilter(option !== null ? "genre" : "default")}} className="catalogFilter--filter" noOptionsMessage={() => "Genere non trovato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                        <Select key={"selectType"} options={typesOptions} placeholder="Tipologia" isClearable onChange={(option) => { setSearch(option !== null ? option.value : "default"); setFilter(option !== null ? "type" : "default")}} className="catalogFilter--filter" noOptionsMessage={() => "Tipo non trovato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                        <Select key={"selectYears"} options={yearsOptions} placeholder="Anno" isClearable onChange={(option) => { setSearch(option !== null ? option.value : "default"); setFilter(option !== null ? "years" : "default")}} className="catalogFilter--filter" noOptionsMessage={() => "Anno non trovato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                        <Select key={"selectStudio"} options={studioOptions} placeholder="Studio" isClearable onChange={(option) => { setSearch(option !== null ? option.value : "default"); setFilter(option !== null ? "studio" : "default")}} className="catalogFilter--filter" noOptionsMessage={() => "Studio non trovato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                        <input key={"inputSearch"} placeholder="Cerca..."></input>
                    </div>
                    <div className="catalog--content">
                        <CatalogComponent key={"catalog"} dataElements={catalog} filterType={catalog.filter} searchString={catalog.searchString}></CatalogComponent>
                    </div>
                </div>
            </>
        )
    }
    else
    {
        return(
            <div>Loading...</div>
        );
    }
}

export default CatalogPage;