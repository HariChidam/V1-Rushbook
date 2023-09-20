import React, { useState } from 'react';
import supabase from '../supabase.js';
import Router from 'next/router';
import RusheeTile from '../components/RusheeTile';
import ProtectedRoute from '../components/ProtectedRoute.tsx';

export default function AddRushee() {
    const [rusheeEmail, setRusheeEmail] = useState('');
    const [rusheeName, setRusheeName] = useState('');
    const [Major , setMajor] = useState('');
    const [Year , setYear] = useState('');
    const [Gender , setGender] = useState('');
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
                Rushee_Email: rusheeEmail,
                Rushee_Name: rusheeName,
                Likes: [],
                Comments: [],
                Dislikes: [],
                q1: q1,
                q2: q2,
                q3: q3,
                Major: Major,
                Year: Year,
                Gender: Gender,
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
                .upload(rusheeEmail, fileBlob, { contentType: 'image/jpeg' });
            if (AvatarError) {
                console.log('Error uploading avatar:', AvatarError);
            }
        }
    
        setRusheeEmail('');
        setRusheeName('');
        setImageUrl(null);
        setMajor('');
        setYear('');
        setGender('');
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
            <h1 onClick={BackToHome} className='text-6xl lg:text-8xl font-bold bg-amber-400 bg-clip-text text-transparent py-4 text-center'>V1 Rushbook</h1>
            <div className="flex pt-8">
                <div className="w-full pr-4 flex flex-col items-center">
                    <form className="flex flex-col w-11/12 mx-auto bg-white shadow-xl rounded-md">
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Email: </label>
                            <input
                                type="text"
                                name="rusheeEmail"
                                value={rusheeEmail}
                                onChange={(e) => setRusheeEmail(e.target.value)}
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
                            <label className="p-4 font-bold">Gender: </label>
                            <input
                                type="text"
                                name="Gender"
                                value={Gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Tell us about your builder journey so far.</label>
                            <input
                                type="text"
                                name="q1"
                                value={q1}
                                onChange={(e) => setQ1(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Why are you interested in V1? What do you hope to give and gain from our community? </label>
                            <input
                                type="text"
                                name="q2"
                                value={q2}
                                onChange={(e) => setQ2(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg"
                            />
                        </div>
                        <div className="flex items-center p-4">
                            <label className="p-4 font-bold">Tell us a fun fact about yourself in one or two sentences.</label>
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
                            className="bg-black text-white m-2 p-2 rounded-lg hover:scale-105 shadow-lg mb-4"
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
                        Rushee_Email={rusheeEmail}
                        Rushee_Name={rusheeName}
                        Major={Major}
                        Year={Year}
                        Gender={Gender}
                        q1={q1}
                        q2={q2}
                        q3={q3}
                        imageUrl={imageUrl ? URL.createObjectURL(imageUrl) : ''}
                        Big={true}
                    />
                    <button
                        onClick={BackToHome}
                        className="bg-black text-white m-6 p-2 rounded-lg hover:scale-105 shadow-lg mb-4"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    </ProtectedRoute>
    );
}
