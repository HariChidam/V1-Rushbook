import RusheeTile from "../../components/RusheeTile";
import { useRouter } from "next/router";
import { useEffect , useState } from "react";
import supabase from "../../supabase";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function RusheePage() {

    const router = useRouter();
    const { Rushee_Email } = router.query;
    const [email, setEmail] = useState('');
    const [name , setName] = useState('');
    const [q1 , setQ1] = useState('');
    const [q2 , setQ2] = useState('');
    const [q3 , setQ3] = useState('');
    const [comments, setComments] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [Major, setMajor] = useState('');
    const [Year, setYear] = useState('');
    const [Gender, setGender] = useState('');
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
      }, [Rushee_Email]);
    
      useEffect(() => {
        const fetchRushee = async () => {
          if (Rushee_Email) {
            const { data, error } = await supabase
              .from('V1-Book')
              .select('*')
              .eq('Rushee_Email', Rushee_Email);
    
            if (error) {
              console.log(error);
            } else if (data && data.length > 0) {
              const rusheeData = data[0];
              setEmail(rusheeData.Rushee_Email);
              setName(rusheeData.Rushee_Name);
              setQ1(rusheeData.q1);
              setQ2(rusheeData.q2);
              setQ3(rusheeData.q3);
              setLikes(rusheeData.Likes);
              setDislikes(rusheeData.Dislikes);
              setComments(rusheeData.Comments);
              setMajor(rusheeData.Major);
              setYear(rusheeData.Year);
              setGender(rusheeData.Gender);
    
              // Check if the current user has already liked or disliked the rushee
              if (userEmail) {
                setAlreadyLiked(rusheeData.Likes.includes(userEmail));
                setAlreadyDisliked(rusheeData.Dislikes.includes(userEmail));
              }
            }
          }
        };
    
        fetchRushee();
      }, [Rushee_Email, userEmail]);
    
      useEffect(() => {
        const fetchRusheeImage = async () => {
          const email = Rushee_Email as string;
        
          if (email) {
            const { data: ImageData, error } = await supabase
              .storage
              .from('rushee')
              .download(email);
        
            if (error) {
              console.log(error);
            } else {
              setImageUrl(URL.createObjectURL(ImageData));
            }
          }
        };
    
        fetchRusheeImage();
      }, [Rushee_Email]);
    
      const handleLike = async () => {
        if (userEmail) {
          // Update the state with the new liked status
          const updatedLikes: Likes = [...likes, userEmail];
          setLikes(updatedLikes);
          setAlreadyLiked(true);
    
          // Update the database with the new liked status
          await supabase.from('V1-Book').update({ Likes: updatedLikes }).eq('Rushee_Email', Rushee_Email);
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
            .eq("Rushee_Email", Rushee_Email);
        }
      };
    
    
      const handleDislike = async () => {
        if (userEmail) {
          // Update the state with the new disliked status
          const updatedDislikes: Dislikes = [...dislikes, userEmail];
          setDislikes(updatedDislikes);
          setAlreadyDisliked(true);
    
          // Update the database with the new disliked status
          await supabase.from('V1-Book').update({ Dislikes: updatedDislikes }).eq('Rushee_Email', Rushee_Email);
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
            .eq("Rushee_Email", Rushee_Email);
        }
      };
    
      const handleHome = () => {
        router.push('/');
      };

      const handleComment = async (comment: string) => {
        if (Rushee_Email && userEmail) {
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
              .eq("Rushee_Email", Rushee_Email);
      
            console.log('Comment added to the database successfully.');
          } catch (error) {
            console.error('Error adding comment to the database:', error);
          }
        }
      };
      

    return (
      <ProtectedRoute allowedRoles={['member','admin']}>
        <div className="flex flex-col items-center m-8">           
            <RusheeTile 
                Rushee_Email={email} 
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
                Gender={Gender}
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
            <button className='bg-black text-amber-400 m-2 p-2 rounded-lg hover:scale-105 shadow-lg mt-4' onClick={handleHome}>Back to Home</button>
        </div>
      </ProtectedRoute>
    );
}