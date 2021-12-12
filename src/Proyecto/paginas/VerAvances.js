import React, {useEffect} from "react";
import { useQuery } from "@apollo/client";
import { GET_AVANCES } from "./queries";

const ListarAvances = () => {
    const {data, error, loading} = useQuery (GET_AVANCES)
    useEffect(() => {
        console.log ("data servidor", data);
        
    }, [data]);

    return <div>Todos los avances</div>;

};

export default ListarAvances;