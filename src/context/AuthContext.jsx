import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { account, database, DEV_DB_ID } from "../appwriteConfig";


const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
     const [loading, setLoading] = useState(true)
     const navigate = useNavigate()
     useEffect(() => {
        setLoading(false)
     })



     const loginUser = async (userInfo) => {

       
        try{
            const response = await account.createEmailSession(
                userInfo.email, userInfo.password
                ) 
            
            const accountDetails =  await account.get()
           
            setUser(accountDetails)
        }catch(error){
            console.log('ERROR:', error)
        }
    }

    const logoutUser = async () => {
        console.log('Logout clicked')
        account.deleteSession('current')
        setUser(null)
        navigate('/login')
    }
   
   
     const contexData = {
        user,
        loginUser,
        logoutUser

    }

    return (
        <AuthContext.Provider  value={contexData}>
               {loading ? <p>loading....</p> : children}
        </AuthContext.Provider>
    )
}
export const useAuth = ()=> {return useContext(AuthContext)}
export default AuthContext