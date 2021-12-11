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
        <div className="container cursor-default">
          <div>
            <h1 onClick={() => navigate("/")} className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-800 to-orange-600 hover:drop-shadow">TaskHub</h1>
          </div>
          <div className="flex justify-end">
            <h2 className="font-bold">{supabase.auth.user() ? supabase.auth.user().user_metadata.name : ''}</h2>
            <button onClick={signout} className="bg-blue-400 px-4 py-2 shadow-md rounded-md ml-3 hover:shadow-xl">Sign Out</button>
          </div>
          {props.page === "personal" ?
            <div className="flex justify-end">
              <h2 className="px-8 font-bold">Personal Tasks</h2>
              <h2 onClick={() => navigate("/org")}>Organisation Tasks</h2>
            </div>
            :
            <div className="flex justify-end">
              <h2 onClick={() => navigate("/account")} className="px-8">Personal Tasks</h2>
              <h2 className="font-bold">Organisation Tasks</h2>
            </div>
          }
        </div>
      </nav>
    </div>
  );
}
