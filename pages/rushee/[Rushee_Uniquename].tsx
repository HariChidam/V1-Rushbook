import RusheeTile from "../../components/RusheeTile";
import { useRouter } from "next/router";
import { useEffect , useState } from "react";
import supabase from "../../supabase";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function RusheePage() {

    const router = useRouter();
    const { Rushee_Uniquename } = router.query;
    const [uniqueName, setUniqueName] = useState('');
    const [name , setName] = useState('');
    const [q1 , setQ1] = useState('');
    const [q2 , setQ2] = useState('');
    const [q3 , setQ3] = useState('');
    const [comments, setComments] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [Major, setMajor] = useState('');
    const [Year, setYear] = useState('');
    const [Pronouns, setPronouns] = useState('');
    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const [alreadyDisliked, setAlreadyDisliked] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    type Likes = string[];
    type Dislikes = string[];

  // Update the useState hooks to specify the types
    const [likes, setLikes] = useState<Likes>([]);
    const [dislikes, setDislikes] = useState<Dislikes>([]);

    useEffect(() => {
        const fetchSession = async () => {
          try {
            const session = await supabase.auth.getSession();
            if (session) {
              setUserEmail(session.data.session?.user.email || '');
            }
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchSession();
      }, [Rushee_Uniquename]);
    
      useEffect(() => {
        const fetchRushee = async () => {
          if (Rushee_Uniquename) {
            const { data, error } = await supabase
              .from('V1-Book')
              .select('*')
              .eq('Rushee_Uniquename', Rushee_Uniquename);
    
            if (error) {
              console.log(error);
            } else if (data && data.length > 0) {
              const rusheeData = data[0];
              setUniqueName(rusheeData.Rushee_Uniquename);
              setName(rusheeData.Rushee_Name);
              setQ1(rusheeData.q1);
              setQ2(rusheeData.q2);
              setQ3(rusheeData.q3);
              setLikes(rusheeData.Likes);
              setDislikes(rusheeData.Dislikes);
              setComments(rusheeData.Comments);
              setMajor(rusheeData.Major);
              setYear(rusheeData.Year);
              setPronouns(rusheeData.Pronouns);
    
              // Check if the current user has already liked or disliked the rushee
              if (userEmail) {
                setAlreadyLiked(rusheeData.Likes.includes(userEmail));
                setAlreadyDisliked(rusheeData.Dislikes.includes(userEmail));
              }
            }
          }
        };
    
        fetchRushee();
      }, [Rushee_Uniquename, userEmail]);
    
      useEffect(() => {
        const fetchRusheeImage = async () => {
          const uniqueName = Rushee_Uniquename as string;
        
          if (uniqueName) {
            const { data: ImageData, error } = await supabase
              .storage
              .from('rushee')
              .download(uniqueName);
        
            if (error) {
              console.log(error);
            } else {
              setImageUrl(URL.createObjectURL(ImageData));
            }
          }
        };
    
        fetchRusheeImage();
      }, [Rushee_Uniquename]);
    
      const handleLike = async () => {
        if (userEmail) {
          // Update the state with the new liked status
          const updatedLikes: Likes = [...likes, userEmail];
          setLikes(updatedLikes);
          setAlreadyLiked(true);
    
          // Update the database with the new liked status
          await supabase.from('V1-Book').update({ Likes: updatedLikes }).eq('Rushee_Uniquename', Rushee_Uniquename);
        }
      };

      const handleRemoveLike = async () => {
        if (userEmail) {
          // Update the state with the new liked status
          const updatedLikes: Likes = likes.filter((email) => email !== userEmail);
          setLikes(updatedLikes);
          setAlreadyLiked(false);
    
          // Update the database with the new liked status
          await supabase
            .from("book")
            .update({ Likes: updatedLikes })
            .eq("Rushee_Uniquename", Rushee_Uniquename);
        }
      };
    
    
      const handleDislike = async () => {
        if (userEmail) {
          // Update the state with the new disliked status
          const updatedDislikes: Dislikes = [...dislikes, userEmail];
          setDislikes(updatedDislikes);
          setAlreadyDisliked(true);
    
          // Update the database with the new disliked status
          await supabase.from('V1-Book').update({ Dislikes: updatedDislikes }).eq('Rushee_Uniquename', Rushee_Uniquename);
        }
      };

      const handleRemoveDislike = async () => {
        if (userEmail) {
          // Update the state with the new disliked status
          const updatedDislikes: Dislikes = dislikes.filter((email) => email !== userEmail);
          setDislikes(updatedDislikes);
          setAlreadyDisliked(false);
    
          // Update the database with the new disliked status
          await supabase
            .from("V1-Book")
            .update({ Dislikes: updatedDislikes })
            .eq("Rushee_Uniquename", Rushee_Uniquename);
        }
      };
    
      const handleHome = () => {
        router.push('/');
      };

      const handleComment = async (comment: string) => {
        if (Rushee_Uniquename && userEmail) {
          try {
            const { data, error } = await supabase
              .from('V1-Members')
              .select('*')
              .eq('email', userEmail);
      
            if (error) {
              console.log(error);
              return;
            }
      
            let firstName = '';
            let lastName = '';
      
            if (data && data.length > 0) {
              firstName = data[0].firstname;
              lastName = data[0].lastname;
            }
      
            const commentWithUser = `${firstName} ${lastName}: ${comment}`;
      
            // Update the state with the new comment
            const updatedComments = [...comments, commentWithUser];
            setComments(updatedComments);
      
            // Update the database with the new comments
            await supabase
              .from("book")
              .update({ Comments: updatedComments })
              .eq("Rushee_Uniquename", Rushee_Uniquename);
      
            console.log('Comment added to the database successfully.');
          } catch (error) {
            console.error('Error adding comment to the database:', error);
          }
        }
      };
      

    return (
      <ProtectedRoute allowedRoles={['member','admin']}>
        <div className="flex flex-col items-center">
            <h1 onClick={handleHome} className='text-6xl lg:text-8xl font-bold bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 bg-clip-text text-transparent py-4 pb-2 text-center'>THT Rushbook</h1>
            <hr className='h-2 my-4 w-full rounded bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 mb-20' />
            <RusheeTile 
                Rushee_Uniquename={uniqueName} 
                Rushee_Name={name}
                q1={q1}
                q2={q2}
                q3={q3}
                Likes={likes} 
                Comments={comments} 
                Dislikes={dislikes} 
                imageUrl={imageUrl} 
                Major={Major}
                Year={Year}
                Pronouns={Pronouns}
                Big={true} 
                alreadyLiked={alreadyLiked} 
                alreadyDisliked={alreadyDisliked} 
                userEmail={userEmail} 
                onLike={handleLike} 
                onDislike={handleDislike}
                onRemoveLike={handleRemoveLike}
                onRemoveDislike={handleRemoveDislike}
                onComment={handleComment}
              />
            <button className='bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 text-white m-2 p-2 rounded-lg hover:scale-105 shadow-lg mt-4' onClick={handleHome}>Back to Home</button>
        </div>
      </ProtectedRoute>
    );
}