import React, { useEffect, useState , useRef} from "react";
import EmojiPicker from 'emoji-picker-react';
import {
  MoreHorizontal,
  Heart,
  Repeat,
  Send,
  MessageCircle,
  Image,
  Trash2
} from "react-feather";
import Thread from "../components/Thread";
import {Query, ID} from 'appwrite'
import { database, storage, DEV_DB_ID, COLLECTION_ID_THREADS, BUCKET_ID_IMAGES } from '../appwriteConfig'

const Feed = () => {
  const [threads, setThreads] = useState([]);
  const fileRef = useRef(null)
  const [threadBody,setThreadBody] = useState('');
  const [threadImg , setThreadImg] = useState(null)
  useEffect(() => {
    getThreads();
  }, []);

  const getThreads = async () => {
    const response = await database.listDocuments(
      DEV_DB_ID,
      COLLECTION_ID_THREADS,
      [
        Query.orderDesc('$createdAt'),
       
      ]
    );
    console.log("response:", response);
    setThreads(response.documents);

    
  };

  const handleThreadSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      "owner_id":"64ad7d3975faf6831d86",
      "body": threadBody,
      "image": threadImg
    }

    const response = await database.createDocument(
      DEV_DB_ID,
      COLLECTION_ID_THREADS,
      ID.unique(),
      payload
    )
    console.log("response", response)
    setThreads(prevState => [response, ...prevState])
    setThreadBody('')
    setThreadImg(null)
  }

  const handleClick = async(e) => {
    fileRef.current.click()
  } 

  const handleFileChange = async(e) => {
    const fileObj = e.target.files && e.target.files[0];
        console.log('fileObj:', fileObj)

        if(!fileObj){
            return
        }
       const response = await storage.createFile(
        BUCKET_ID_IMAGES,
        ID.unique(),
        fileObj
       )


       
       const imagePreview = storage.getFilePreview(BUCKET_ID_IMAGES, response.$id);
       setThreadImg(imagePreview.href)



       console.log('file uploaded', response)


  } 

  return (
    <div className="container mx-auto   max-w-[600px]">

      <div className="p-4 ">
        <form onSubmit={handleThreadSubmit}>
          <textarea 
          className="rounded-lg p-4 w-full bg-[rgba(29,29,29,1)]"
          required
          name="body"
          placeholder="Say something..."
          value={threadBody}
          onChange={(e) => {setThreadBody(e.target.value)}}
          >
          
          </textarea>

          <img src={threadImg} />

          <input  onChange={handleFileChange} style={{display: "none"}} type="file" ref={fileRef} />
          <div className="flex justify-between items-center border-y border-[rgba(49,49,50,1)] py-2">
            <Image onClick={handleClick} className="cursor-pointer " size={24}/>
            

            <input className="bg-white text-sm text-black py-2 px-4 border border-black rounded" type="submit" value="Post" />
          </div>
        </form>
      </div>
      {threads.map((thread) => (
        <Thread key={thread.$id} thread={thread} setThreads={setThreads} />
      ))}
    </div>
  );
};

export default Feed;
