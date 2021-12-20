import './settings.css'
import Sidebar from '../../components/sidebar/Sidebar'
import { useContext,useState } from 'react'
import {Context} from "../../context/Context"
import axios from "axios"


export default function Settings() {
    
    const {user,dispatch} = useContext(Context)
    const PF = "http://localhost:5000/images/";
    const [file,setFile] = useState(null)
    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [success,setSuccess] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({type:"UPDATE_START"})
        const updatedUser = {
            userId: user._id,
            username:username,
            email:email,
            password:password,
            
        };

        if (file){
            const data = new FormData();
            const filename = Date.now()+ file.name;
            data.append("name",filename)
            data.append("file",file)
            updatedUser.profilePic = filename;
            try{
                await axios.post("/upload",data)
                
            }catch(err){

            }


        }
        try{
        const res = await axios.put("/users/"+user._id , updatedUser);
        setSuccess(true);
        dispatch({type:"UPDATE_SUCCESS",payload: res.data})

        }catch(err) {
        dispatch({type:"UPDATE_FAILURE"})
        }
    }

    

    return (
        <div className="settings">
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingsUpdateTitle">Update your account</span>
                    <span className="settingsDeleteTitle">Delete account</span>
                </div>
                <form className="settingsForm" onSubmit={handleSubmit}>

                    <label>Profile Picture</label>
                    <div className="settingsPP">
                        <img className="settingsImg"
                        src={file? URL.createObjectURL(file):PF+user.profilePic}    
                        alt=""/>

                        <label htmlFor="fileInput">
                        <i className="settingsPPIcon far fa-user-circle"/>
                        </label>
                        <input type="file"
                         id="fileInput"
                         style={{display:'none'}}
                         onChange={(e) => {setFile(e.target.files[0]); setSuccess(false) } }   
                          />
                    </div>
                <label>Username</label>
                <input type="text" placeholder={user.username} 
                onChange={ (e) => {setUsername(e.target.value); setSuccess(false)}} />
                
                <label>Email</label>
                <input type="email" placeholder={user.email}
                onChange={ (e) => {setEmail(e.target.value); setSuccess(false)} }/>
                
                <label>Password</label>
                <input type="password"
                onChange={ (e) => {setPassword(e.target.value); setSuccess(false) } } />

                <button className="settingsSubmit"
                type="submit">Update</button>

                {success && <span className="success">Profile has been updated !</span>}

                </form>
            </div>
            <Sidebar/>
        </div>
    )
}