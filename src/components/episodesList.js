import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useState, useEffect } from "react";
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import axios from "axios";

function EpisodesList(props)
{
    const [elementData, setElementData] = useState();
    const [season, setSeason] = useState(-1);
    const [episodesList, setEpisodesList] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    
    const [activeSeason, setActiveSeason] = useState();
    const [activeEpisode, setActiveEpisode] = useState();

    const getElementData = async () =>
    {
        try
        {
            const response = await axios.post('/api/getSeasonsFromElement', { params:{ elementName: props.element } });
            setElementData(response);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const changeSeason = (season) =>
    {
        setSeason(season);
        setHasMore(true);

        setEpisodesList(elementData.data.seasons.length > 0 ? elementData.data.seasons[season].episodesData.slice(0, 8) : []);
    }

    const setDefaultSeason = () =>
    {
        if(!episodesList.length > 0)
        {
            changeSeason(0);
        }
    }

    const fetchMoreData = () =>
    {
        let currentEpisodesCount = episodesList.length;
        let episodesCount = episodesList.length;
        let totalEpisodesCount = elementData.data.seasons[season].episodesData.length;

        if(episodesCount + 5 > totalEpisodesCount)
        {
            episodesCount = totalEpisodesCount;
        }
        else
        {
            episodesCount += 5;
        }


        if(episodesCount >= totalEpisodesCount)
        {
            setHasMore(false);
        }
        
        setTimeout(() =>
        {
            setEpisodesList(episodesList.concat(elementData.data.seasons[season].episodesData.slice(currentEpisodesCount, episodesCount)));
        }, 800);
    };

    useEffect(()=>
    {
        getElementData();
    },[]);

    useEffect(()=>
    {
        setActiveSeason(props.activeSeason);
        setActiveEpisode(props.activeEpisode);
    });

    if(elementData != null && elementData.status === 200)
    {
        let seasonOptions = [];

        if(season === -1)
        {
            setDefaultSeason();
        }

        if(elementData.data.seasons.length > 0)
        {
            elementData.data.seasons.forEach((season, index) =>
            {
                seasonOptions.push({ value: index, label: "Stagione " + season.seasonNumber});
            });

            return(
                <div className="centerInfo__episodes">
                    <div className="centerInfo__episodesInfo">
                        <p>Episodi</p>
                        <Select key={"selectSeason"} value={seasonOptions[season]} options={seasonOptions} isClearable={false} isSearchable={false} placeholder="Stagione" onChange={ (seasonOptions) => { changeSeason(seasonOptions.value)} } className="select" noOptionsMessage={() => "Stagione non trovata"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    </div>
                    <div className="centerInfo__episodesList">
                    <InfiniteScroll dataLength={episodesList.length} next={fetchMoreData} hasMore={hasMore} loader={<p>Loading...</p>} height={600}>
                    {
                        episodesList.map((episode) =>
                        {
                            return(
                                <Link className={`centerInfo__episode${activeSeason === season + 1 && activeEpisode === episode.episodeNumber ? " active":""}`} key={ "episode_" + episode.episodeNumber } to={"/watch/" + props.element + `/${btoa(`type=Series&season=${season + 1}&episode=${episode.episodeNumber}`)}`}>
                                    <div className="centerInfo__episodeImage">
                                        <img src={"https://image.tmdb.org/t/p/w200" + episode.episodeImage} alt="episodeImage"/>
                                        <p>{ episode.episodeNumber }</p>
                                    </div>
                                    <div className="centerInfo__episodeTitle">{ episode.episodeName }</div>
                                    <div className="centerInfo__episodeDuration">43Min</div>
                                </Link>
                            );
                        })
                    }
                    </InfiniteScroll>
                    </div>
                </div>
            );
        }
        else
        {
            return(
                <div className="centerInfo__episodes">
                    <div className="centerInfo__episodesInfo">
                        <div className="centerInfo__noSeasonsAvailable ">Non ci sono stagioni disponibili</div>
                    </div>
                </div>
            );
        }
    }
    else
    {
        return(
            <div className="centerInfo__episodes">
                <div className="centerInfo__episodesInfo">
                    <Skeleton  variant="rectangular" sx={{backgroundColor:"#242424"}} width={"20%"} height={"calc((50/1080) * 100vh)"} className="skeleton" />
                    <Skeleton  variant="rectangular" sx={{backgroundColor:"#242424"}} width={"20%"} height={"calc((50/1080) * 100vh)"} className="skeleton" />
                </div>
                <div className="centerInfo__episodesList">
                    <Skeleton  variant="rectangular" sx={{backgroundColor:"#242424"}} width={"100%"} height={"calc((140/1080) * 100vh)"} className="skeleton" />
                </div>
            </div>
        );
    }
}

export default EpisodesList;