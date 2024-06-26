import { useState } from "react";
import { useAuthContext } from "./UseUserhook";

export const useLogin = () => {
    const [error , setError] = useState(null)
    const[isloading , setLoading ] = useState(null)
    const {dispatch} = useAuthContext()
    
    const login = async (email , password ) => {
        setLoading(true)
        setError(null)
        const response = await fetch('http://localhost:4000/barbers/login' , {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({ email , password})

        })
        const json = await response.json()
        if(!response.ok){
            setLoading(false)
            setError(json.error)
        }
        if(response.ok){
            localStorage.setItem('user' , JSON.stringify(json))
            dispatch({ type : 'LOGIN' , payload : json})
            setLoading(false)
            
        }
    }
    return { login , isloading , error }
}