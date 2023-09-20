import React, { useState } from 'react';
import supabase from '../supabase.js';
import Router from 'next/router';
import RusheeTile from '../components/RusheeTile';
import ProtectedRoute from '../components/ProtectedRoute.tsx';

export default function AddRushee() {
    const [uniqueName, setUniqueName] = useState('');
    const [rusheeName, setRusheeName] = useState('');
    const [Major , setMajor] = useState('');
    const [Year , setYear] = useState('');
    const [pronouns , setPronouns] = useState('');
    const [q1 , setQ1] = useState('');
    const [q2 , setQ2] = useState('');
    const [q3 , setQ3] = useState('');


    const [imageUrl, setImageUrl] = useState(null);

    const onImageChange = (e) => {
        const files = e.target.files[0];
        setImageUrl(files);

        const reader = new FileReader();

        reader.onloadend = () => {
            // No need to setAvatarImg here, we'll use imageUrl as a File object directly
        };
        // No need to read the file as a data URL, imageUrl now holds the selected File object
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { error } = await supabase.from('V1-Book').insert([
            {
                Rushee_Uniquename: uniqueName,
                Rushee_Name: rusheeName,
                Likes: [],
                Comments: [],
                Dislikes: [],
                q1: q1,
                q2: q2,
                q3: q3,
                Major: Major,
                Year: Year,
                Pronouns: pronouns,
            },
        ]);
        if (error) {
            console.log(error);
        }
    
        console.log('imageUrl:', imageUrl);
    
        if (imageUrl) {
            // Convert File to Blob
            const fileBlob = new Blob([imageUrl], { type: 'image/jpeg' });
    
            const { data: avatarData, error: AvatarError } = await supabase.storage
                .from('rushee')
                .upload(uniqueName, fileBlob, { contentType: 'image/jpeg' });
            if (AvatarError) {
                console.log('Error uploading avatar:', AvatarError);
            }
        }
    
        setUniqueName('');
        setRusheeName('');
        setImageUrl(null);
        setMajor('');
        setYear('');
        setPronouns('');
        setQ1('');
        setQ2('');
        setQ3('');
    
        console.log('Form submitted!');
    };
    

    const BackToHome = async () => {
        Router.push('/');
    };

    return (
    <ProtectedRoute allowedRoles={['admin']}>
        <div className="flex flex-col items-center">
            <h1 onClick={BackToHome} className='text-6xl lg:text-8xl font-bold bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 bg-clip-text text-transparent py-4 text-center'>THT Rushbook</h1>
            <hr className='h-2 my-4 w-full rounded bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 mb-20' />
            <div className="flex pt-8">
                <div className="w-full pr-4 flex flex-col items-center">
                    <form className="flex flex-col w-11/12 mx-auto bg-white shadow-xl rounded-md">
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Uniquename: </label>
                            <input
                                type="text"
                                name="uniquename"
                                value={uniqueName}
                                onChange={(e) => setUniqueName(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Name: </label>
                            <input
                                type="text"
                                name="name"
                                value={rusheeName}
                                onChange={(e) => setRusheeName(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Major: </label>
                            <input
                                type="text"
                                name="major"
                                value={Major}
                                onChange={(e) => setMajor(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Year: </label>
                            <input
                                type="text"
                                name="year"
                                value={Year}
                                onChange={(e) => setYear(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Pronouns: </label>
                            <input
                                type="text"
                                name="pronouns"
                                value={pronouns}
                                onChange={(e) => setPronouns(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Write a few sentences about any interests you have?</label>
                            <input
                                type="text"
                                name="q1"
                                value={q1}
                                onChange={(e) => setQ1(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Why do you want to join Theta Tau? </label>
                            <input
                                type="text"
                                name="q2"
                                value={q2}
                                onChange={(e) => setQ2(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Tell us a Joke</label>
                            <input
                                type="text"
                                name="q3"
                                value={q3}
                                onChange={(e) => setQ3(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="flex p-4">
                                <label className="p-4 font-bold">Image: </label>
                                <input
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                                    type="file"
                                    name="image"
                                    onChange={onImageChange}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 text-white m-2 p-2 rounded-lg hover:scale-105 shadow-lg mb-4"
                            onClick={(e) => handleSubmit(e)}
                        >
                            Add Rushee
                        </button>
                    </form>
                </div>
                <div className="w-full flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-black bg-clip-text text-transparent py-2 text-center">
                        Preview
                    </h1>
                    <RusheeTile
                        Rushee_Uniquename={uniqueName}
                        Rushee_Name={rusheeName}
                        Major={Major}
                        Year={Year}
                        Pronouns={pronouns}
                        q1={q1}
                        q2={q2}
                        q3={q3}
                        imageUrl={imageUrl ? URL.createObjectURL(imageUrl) : ''}
                        Big={true}
                    />
                    <button
                        onClick={BackToHome}
                        className="bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 text-white m-6 p-2 rounded-lg hover:scale-105 shadow-lg mb-4"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    </ProtectedRoute>
    );
}
