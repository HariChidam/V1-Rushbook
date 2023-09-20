// Import the necessary modules and components
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import supabase from '../supabase.js';
import RusheeTile from '../components/RusheeTile';

interface Rushee {
  Rushee_Uniquename: string;
  Rushee_Name: string;
  Bio: string;
  Likes: string[];
  Comments: string[];
  Dislikes: string[];
  imageUrl: string;
  Major: string;
  Year: string;
  Gender: string;
  q1: string;
  q2: string;
  q3: string;
}

export default function Home() {
  const [book, setBook] = useState<Rushee[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Fetch the rushees info from the database
    const fetchBook = async () => {
      const { data, error } = await supabase.from('V1-Book').select('*')
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        const sortedData = data.sort((a: Rushee, b: Rushee) => {
          const likesA = a.Likes.length;
          const dislikesA = a.Dislikes.length;
          const likesDiffA = likesA - dislikesA;
    
          const likesB = b.Likes.length;
          const dislikesB = b.Dislikes.length;
          const likesDiffB = likesB - dislikesB;
    
          // Sort in descending order based on the calculated value (likesDiff)
          return likesDiffB - likesDiffA;
        });
        
        setBook(data || []);
      }
    };
    fetchBook();
  }, []);

  useEffect(() => {
    // Trigger getRusheeImages function when the book is updated
    if (book.length > 0) {
      getRusheeImages();
    }
  }, [book]);

  const getRusheeImages = async () => {
    // Get the rushee images from the storage
    const updatedBook = await Promise.all(
      book.map(async (rushee) => {
        if (rushee.imageUrl) {
          return rushee;
        } else {
          const { data: ImageData, error } = await supabase
            .storage
            .from('rushee')
            .download(rushee.Rushee_Uniquename);
          if (error) {
            console.log(error);
            return rushee;
          } else {
            const blob = new Blob([ImageData as BlobPart], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            return { ...rushee, imageUrl };
          }
        }
      })
    );
    setBook(updatedBook);
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session) {
          console.log(session)
          setUserEmail(session.data.session?.user.email || '')
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSession();
    // Listen for changes in the authentication state
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUserEmail(session.user?.email || '');
      }
      if (event === 'SIGNED_OUT') {
        setUserEmail('');
        Router.push('/');
      }
    });
  }, []);

  // useEffect(() => {
  //   // Check if the user is a brother
  //   const checkStatus = async () => {
  //     const { data, error } = await supabase.from('emails').select('*').eq('email', userEmail);
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log(data);
  //       if (data.length > 0) {
  //         setIsMember(true);
  //         setIsAdmin(data[0].Role);
  //       }
  //     }
  //   };
  //   checkStatus();
  // }, [userEmail]);

  useEffect(() => {
    // Check if the user is a member
    const checkStatus = async () => {
      const { data, error } = await supabase.from('V1-Members').select('*').eq('email', userEmail);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        if (data.length > 0) {
          setIsMember(true);
          setIsAdmin(data[0].Role);
        }
      }
    };
    checkStatus();
  }, [userEmail]);

  const handleGoogleSignIn = async () => {
    // Handle the Google sign in
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    console.log('here');
    console.log(data);
    console.log(error);
  };

  const handleGoogleSignOut = async () => {
    // Handle the Google sign out
    const { error } = await supabase.auth.signOut();
    console.log(error);
    setIsMember(false);
  };

  const handleAddRushee = async () => {
    // Handle the add rushee button
    Router.push('/AddRushee');
  };

  const handleJoin = async () => {
    // Handle the join button
    window.open('https://v1michigan.com/')
  };

  const handleHome = async () => {
    Router.push('/')
  }

  const filteredBook = book.filter((rushee) =>
    rushee.Rushee_Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Head>
        <title>V1 Rushbook</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.png" />
      </Head>
      <div className='flex flex-col items-center bg-black'>
        <h1 onClick={handleHome} className='text-6xl lg:text-8xl font-bold bg-amber-400 bg-clip-text text-transparent py-2 text-center'>V1 Rushbook</h1>
        <div className='flex mb-4'>
          {isMember && (
            <div className='flex flex-col items-center'>
              <h2 className='text-2xl font-bold text-center text-amber-400'>Welcome {userEmail}!</h2>
              {isAdmin === 'admin' && (<h1 className='font-bold text-amber-400'>You are an admin</h1>)}
            </div>
          ) }
        </div>
      </div>
      {isMember &&
        <div className='flex flex-col items-center'>
          <button className='text-black bg-amber-400 m-2 p-2 rounded-lg hover:scale-105 shadow-lg' onClick={handleGoogleSignOut}>Sign out</button>
          {isAdmin === 'admin' && (<button className='text-black bg-amber-400 m-2 p-2 rounded-lg hover:scale-105 shadow-lg' onClick={handleAddRushee}>Add Rushee</button>)}
        </div>
      }
      {isMember ? 
        (
          <div>
            <div className='flex flex-col items-center p-4'>
              <h1 className='text-xl font-bold text-center'>Here are all our Rushees! Please leave your thoughts!</h1>
              
            </div>
            <div className="flex justify-center items-center pb-4">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-md p-2 w-1/2 border-red-950"
              />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pt-4'>
              {filteredBook.map((rushee) => (
                <RusheeTile
                  key={rushee.Rushee_Uniquename}
                  Rushee_Uniquename={rushee.Rushee_Uniquename}
                  Rushee_Name={rushee.Rushee_Name}
                  q1={rushee.q1}
                  q2={rushee.q2}
                  q3={rushee.q3}
                  Likes={rushee.Likes}
                  Dislikes={rushee.Dislikes}
                  Comments={rushee.Comments}
                  imageUrl={rushee.imageUrl}
                  Major={rushee.Major}
                  Year={rushee.Year}
                  Gender={rushee.Gender}
                  Big={false}
                  userEmail={userEmail}
                />
              ))}
            </div>
          </div>
        )
      :
      (
        <div className='flex flex-col items-center p-8'>
          <h1 className='text-xl font-bold pb-4 text-center'>This is for V1 Members only!</h1>
          <button onClick={handleJoin} className='bg-black text-amber-400 m-2 p-2 rounded-lg hover:scale-105 shadow-lg'>Join Us!</button>
          <button className='bg-black text-amber-400 m-2 p-2 rounded-lg hover:scale-105 shadow-lg' onClick={handleGoogleSignIn}>Sign in with Google</button>
        </div>
      )
      }
    </div>
  );
}
