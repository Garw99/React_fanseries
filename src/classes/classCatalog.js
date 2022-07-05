// eslint-disable-next-line no-unused-vars
export default class Catalog
{
    constructor(filters, filtersOptions)
    {   
        if(typeof filters !== "undefined")
        {
            this.filters = filters; //FILTERS DATA
        }

        this.filtersActive = false;
        this._filtersOptions = filtersOptions;

        this._catalogData = null;
        this.tempCatalogData = null;

        this._elementsListFromFilters = null; // GENERAL DATA

        this._filterData = null; // FILTER FUNCTION
    }

    generateFilterList(filterType, currentData)
    {
        let tempArray = [];
        let data = this._elementsListFromFilters[filterType];

        currentData.forEach(name =>
        {
            for (const key in data)
            {
                if(data[key].includes(name) && !tempArray.includes(key))
                {
                    tempArray.push(key);
                }
            }
        });

        return tempArray;
    }

    dataFromFilter(filterType, currentData, filterString)
    {
        let data = this._elementsListFromFilters[filterType];
        let tempArray = [];

        currentData.forEach(name =>
        {
            if(data[filterString].includes(name) && !tempArray.includes(name))
            {
                tempArray.push(name);
            }
        });

        return tempArray;
    }

    dataFromSearchString(currentData, stringToSearch)
    {
        let tempArray = [];

        currentData.forEach(name =>
        {
            if(name.toLowerCase().includes(stringToSearch.toLowerCase()))
            {
                tempArray.push(name);
            }
        });

        return tempArray;
    }

    get catalogData()
    {
        let activeStatus = false;
        for (const key in this.filters)
        {
            const element = this.filters[key];
            activeStatus = activeStatus || element.active;
        }

        this.filtersActive = activeStatus;

        if(this.filtersActive === false)
        {
            this._catalogData = this._elementsListFromFilters.genres;
        }
        else
        {   
            this._catalogData = this.filterData;
        }
        
        return this._catalogData;
    }

    set catalogData(data)
    {
        throw new Error("Only read");
    }

    get elementsListFromFilters()
    {
        return this._elementsListFromFilters;
    }

    set elementsListFromFilters(data)
    {
        this._elementsListFromFilters = data;
    }

    set filterData(data)
    {
        throw new Error("Only read");
    }

    // eslint-disable-next-line getter-return
    get filterData()
    {
        let elements = this.elementsListFromFilters.titles;

        for (const key in this.filters)
        {
            const filterElement = this.filters[key];

            if(filterElement.active === false)
            {
                continue;
            }

            if(key === "genre")
            {
                elements = this.dataFromFilter("genres", elements, this.filters.genre.search);
            }
            else if(key === "type")
            {
                elements = this.dataFromFilter("types", elements, this.filters.type.search);
            }
            else if(key === "year")
            {
                elements = this.dataFromFilter("dates", elements, this.filters.year.search);
            }
            else if(key === "studio")
            {
                elements = this.dataFromFilter("studios", elements, this.filters.studio.search);
            }
            else if(key === "search")
            {
                elements = this.dataFromSearchString(elements, this.filters.search.search);
            }
        }

        return elements;
    }

    set filtersOptions(data)
    {
        throw new Error("Only read");
    }

    get filtersOptions()
    {
        let data = this._filtersOptions;
        
        let currentFilteredElements = this.filterData;
        
        for (const key in data.optionsData)
        {
            if(key === "genre")
            {
                data.optionsData[key] = this.generateFilterList("genres", currentFilteredElements);
            }
            if(key === "type")
            {
                data.optionsData[key] = this.generateFilterList("types", currentFilteredElements);
            }
            if(key === "year")
            {
                data.optionsData[key] = this.generateFilterList("dates", currentFilteredElements);
            }
            if(key === "studio")
            {
                data.optionsData[key] = this.generateFilterList("studios", currentFilteredElements);
            }
        }

        data.dataPresent = true;

        return this._filtersOptions = data;
    }
}