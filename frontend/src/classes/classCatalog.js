// eslint-disable-next-line no-unused-vars
export default class Catalog
{
    constructor(filter, searchString)
    {   
        if(typeof filter !== "undefined")
        {
            this.filter = filter;
        }

        if(typeof searchString !== "undefined")
        {
            this.searchString = searchString;
        }

        this._catalogData = null;
        this._generalElementsData = null;

        this._listGenres = null;
        this._listYears = null;

        this._elementsFilteredFromGenres = null;
        this._elementsFilteredFromYears = null;
        
        this._genresFilter = null;
    }

    get catalogData()
    {
        if(this.filter === "default")
        {
            this._catalogData = this.elementsFilteredFromGenres;
        }
        else if(this.filter === "genre")
        {
            this._catalogData = this.genresFilter;
        }

        return this._catalogData;
    }

    set catalogData(data)
    {
        throw new Error("Only read");
    }

    get generalElementsData()
    {
        return this._generalElementsData;
    }

    set generalElementsData(data)
    {
        this._generalElementsData = data;
    }

    set listGenres(data)
    {
        throw new Error("Only read");
    }

    get listGenres()
    {
        let genres = [];

        for (const key in this._generalElementsData)
        {
            if (Object.hasOwnProperty.call(this._generalElementsData, key))
            {
                let tempData = this._generalElementsData[key];
                let genresArray = tempData.genres;

                genresArray.forEach(element =>
                {
                    if(!genres.includes(element))
                    {
                        genres.push(element);
                    }
                });
            }
        }

        return this._listGenres = genres;
    }

    set listYears(data)
    {
        throw new Error("Only read");
    }

    get listYears()
    {
        let years = [];

        for (const key in this._generalElementsData)
        {
            if (Object.hasOwnProperty.call(this._generalElementsData, key))
            {
                let tempData = this._generalElementsData[key];

                if(!years.includes(tempData.releaseDate[0]))
                {
                    years.push(tempData.releaseDate[0]);
                }
            }
        }

        return this._listYears = years;
    }

    set elementsFilteredFromGenres(data)
    {
        throw new Error("Only read");
    }

    // eslint-disable-next-line getter-return
    get elementsFilteredFromGenres()
    {
        let data = this.generalElementsData;
        let genres = this.listGenres;

        let filteredData = {};

        for (const key in data)
        {
            if (Object.hasOwnProperty.call(data, key))
            {
                let genresArray = data[key].genres;
                
                genresArray.forEach(element =>
                {
                    if(genres.includes(element))
                    {
                        let elementData = [];

                        if(!filteredData.hasOwnProperty(element))
                        {
                            elementData.push(data[key]);
                            filteredData[element] = elementData;
                        }
                        else
                        {
                            filteredData[element].push(data[key]);
                        }
                    }
                });
            }
        }
        
        return this._elementsFilteredFromGenres = filteredData;
    }

    set genresFilter(data)
    {
        throw new Error("Only read");
    }

    get genresFilter()
    {
        let data = this.elementsFilteredFromGenres;

        if(data != null)
        {
            let arrayData = Object.entries(data);
            let newDataCatalog = "";
            
            arrayData.filter(element =>
            {
                if(element[0].toLowerCase().includes(this.searchString.toLowerCase()))
                {
                    newDataCatalog = element[1];
                }
            })

            return newDataCatalog;
        }
    }
}