import React, { useState, useContext, useEffect, Fragment} from 'react';
import { InputLabel, Select, TextField } from '@material-ui/core'
import { FormControl } from '../_styledCriteriaConfigForm';
import MasterDriverContext from '../../../context/masterDriverContext';
import ClusterContext from '../../../context/clusterContext';
import configMapping from '../../../constants/jsonTemplates/configurationMapping.json'
import {FloatInputGray as FloatInput} from '../../common/_styledInput'
import {SmallLabel} from '../../common/_styledLabel'
import {_CRITERIA} from '../../../constants/strings'

export default function Status(props) {
    let {devices, configuration, setConfiguration} = useContext(MasterDriverContext);
    let {clusterFocus} = useContext(ClusterContext);
    const [state, setState] = useState({
        stateClusterFocus: clusterFocus
    })

    useEffect(() => {
        if(clusterFocus !== state.stateClusterFocus){
            setState({
                ...state,
                stateClusterFocus: clusterFocus
            })
        }
    }, [configuration, clusterFocus, props.device, props.setting, props.criteria,
        state])
    
    const clone = (obj) => JSON.parse(JSON.stringify(obj));

    const handleChange = (event) => {
        const name = event.target.name
        updateConfiguration(name, event.target.value)
        setState({
            ...state,
            [name]: event.target.value
        })
    }

    const handleFloatChange = (event) => {
        const name = event.target.name
        updateConfiguration(name, parseFloat(event.target.value))
        setState({
            ...state,
            [name]: event.target.value
        })
    }

    const updateConfiguration = (name, value) => {
        let newConfiguration = clone(configuration);
        let {device, setting, criteria } = props;
        newConfiguration[`${clusterFocus}${_CRITERIA}`][device][device][setting][criteria][name] = value
        setConfiguration(newConfiguration)
    }

    const getPoints = (device_name) => {
        let points = [];
        for(let deviceIndex in devices){
            if(devices[deviceIndex]["device_name"] === device_name){
                points = devices[deviceIndex]["points"]
            }
        }
        return points;
    }

    const points = getPoints(props.device);

    const {point_name, on_value, off_value} = configuration[`${clusterFocus}${_CRITERIA}`][props.device][props.device][props.setting][props.criteria]

    return (
            <Fragment>
                <FormControl >
                    <InputLabel htmlFor="point">Point Name</InputLabel>
                    <Select
                        native
                        value={point_name ? point_name : ""}
                        onChange={handleChange}
                        inputProps={{
                            name: 'point_name',
                            id: 'point_name'
                        }}
                    >
                        <option aria-label="None" value="" />
                        {points.map(point => {return <option value={point}>{point}</option>})}
                    </Select>
                </FormControl>
                <FormControl >
                    <SmallLabel>On Value</SmallLabel>
                    <FloatInput
                        id={`${clusterFocus}onValue`}
                        name="on_value"
                        label="On Value"
                        type="number"
                        value= {on_value ? on_value : ""}
                        step='0.01'
                        onChange={handleFloatChange}/>
                </FormControl>
                <FormControl >
                    <SmallLabel>Off Value</SmallLabel>
                    <FloatInput
                        id="offValue"
                        name="off_value"
                        label="Off Value"
                        type="number"
                        value= {off_value ? off_value : ""}
                        step='0.01'
                        onChange={handleFloatChange}/>
                </FormControl>
            </Fragment>
      
    );
}