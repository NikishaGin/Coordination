import React, { useState, useEffect } from "react";
import Template from "./template/Template.jsx";
import { useParams } from "react-router";
import { activesAPI } from "../../../../../api/index.js";



export default function () {
    const [actives, setActives] = useState([])
    const { inn } = useParams()

    useEffect(() => {
        activesAPI.getActives(inn, "transport").then(data => setActives(data.data)).catch(console.log)
    }, [])

    return <Template nameActive="transport" data={actives} />
}