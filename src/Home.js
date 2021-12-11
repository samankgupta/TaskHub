import React from "react";
import homeimage from "./assets/homeimage.png"
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

    async function addMember() {

        let emailPresent = false;

        const { data } = await supabase
            .from('Members')
            .select()

        data.map(d => d.Email === supabase.auth.user().user_metadata.email ? emailPresent = true : '')

        if (!emailPresent) {
            const { addData } = await supabase
                .from('Members')
                .insert([
                    {
                        Name: supabase.auth.user().user_metadata.name,
                        Email: supabase.auth.user().user_metadata.email
                    }
                ])
        }
    }
    React.useEffect(() => {
        if (supabase.auth.user()) {
            addMember();
        }
    }, [supabase.auth.user()])

    const navigate = useNavigate()

    async function signInWithGoogle() {

        const { error } = await supabase.auth.signIn({
            provider: 'google',
        })
    }
    return (
        <div className="grid grid-cols-2 pt-20 bg-blue-500 h-screen">
            <div className="text-center mt-12 px-20">
                <h1 className="mt-12 mb-12 text-xl font-medium text-orange-900">Working from home makes it difficult for you to manage your tasks?<br /><br /><br /><span className="text-4xl">Introducting <span className="text-7xl bg-clip-text text-transparent bg-gradient-to-r from-orange-900 to-orange-600 filter drop-shadow hover:drop-shadow-xl">TaskHub</span>.</span><br /><br /><br />TaskHub helps you manage your individual/organizational tasks easily and efficiently.</h1>
                <div className="flex justify-center">
                    {supabase.auth.user() ?
                        <button onClick={() => navigate("/account")} className="flex items-center mt-4 py-2 px-6 bg-white shadow-md rounded-md text-gray-800 text-sm font-semibold ml-3 border border-gray-200 hover:shadow-xl text-2xl">Go To Account</button>
                        :
                        <button onClick={signInWithGoogle} className="flex items-center mt-4 py-2 px-6 bg-white shadow-md rounded-md text-gray-800 text-sm font-semibold ml-3 border border-gray-200 hover:shadow-xl"><img src="https://img.icons8.com/color/48/000000/google-logo.png" /><span className="ml-4 text-lg">Login with Google</span></button>
                    }
                </div>
            </div >
            <div className="mr-5">
                <img src={homeimage} alt="TaskHub" />
            </div>
        </div >
    );
};

export default HomePage;