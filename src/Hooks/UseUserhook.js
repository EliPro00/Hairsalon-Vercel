import { useContext } from "react";
import {AuthContext } from "../Context/AuthContext"

export const  useAuthContext = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw Error('useAuthCOntext must be used in the provider')
    }
    return context
} 