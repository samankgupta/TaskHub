import React from "react";
import "./styles.scss";
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../supabaseClient'

export default function Navbar(props) {

  const navigate = useNavigate()

  React.useEffect(() => {
    if (!supabase.auth.user())
      navigate('/')
  }, [])

  async function signout() {
    const { error } = await supabase.auth.signOut()
    if (!error)
      navigate('/')
  }

  return (
    <div>
      <nav>
        <div className="container">
          <div>
            <h1 onClick={() => navigate("/")} className="cursor-pointer text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-orange-600 hover:drop-shadow">TaskHub</h1>
          </div>
          <div className="flex justify-end">
            <h2 className="font-bold">{supabase.auth.user() ? supabase.auth.user().user_metadata.name : ''}</h2>
            <button onClick={signout} className="bg-blue-500 px-4 py-2 shadow-md rounded-md ml-3 hover:shadow-xl">Sign Out</button>
          </div>
          {props.page === "personal" ?
            <div className="flex justify-end">
              <h2 className="px-8 font-bold cursor-pointer">Personal Tasks</h2>
              <h2 onClick={() => navigate("/org")} className="cursor-pointer">Organisation Tasks</h2>
            </div>
            :
            <div className="flex justify-end">
              <h2 onClick={() => navigate("/account")} className="px-8 cursor-pointer">Personal Tasks</h2>
              <h2 className="font-bold cursor-pointer">Organisation Tasks</h2>
            </div>
          }
        </div>
      </nav>
    </div>
  );
}
