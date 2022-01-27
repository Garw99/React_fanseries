import React, { useState, useEffect } from "react";

function SelectOptions(props)
{
    const [listOptions, setListOptions] = useState();
    const [typeTitle, setTypeTitle] = useState();

    const changeListOptions = () =>
    {
        setListOptions(props.options);
    }

    const changeStypeTitle = () =>
    {
        setTypeTitle(props.textType);
    }

    useEffect(()=>
    {
        changeListOptions();
        changeStypeTitle();
    },[listOptions, typeTitle]);

    if(listOptions != null && typeTitle != null)
    {
        return(
            <details>
                <summary className="radios">
                    <input type="radio" name="item" id="default" title={typeTitle}/>
                    {
                        Object.keys(listOptions).map((element) =>
                        {
                            return (<input type="radio" name="item" id={"select_" + element} title={element}/>);
                        })
                    }
                </summary>
                <ul className="list">
                    {
                        Object.keys(listOptions).map((element) =>
                        {
                            return (
                                <li>
                                    <label htmlFor={"select_" + element}>{element}</label>
                                </li>
                            );
                        })
                    }
                </ul>
            </details>
        );
    }
    else
    {
        return(
            <details>
                <summary className="radios">
                </summary>
                <ul className="list">
                </ul>
            </details>
        );
    }
}

export default SelectOptions;