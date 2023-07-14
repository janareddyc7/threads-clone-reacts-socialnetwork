import React, { useState, useEffect } from "react";

import {
  MoreHorizontal,
  Heart,
  Repeat,
  Send,
  MessageCircle,
  Trash2
} from "react-feather";
import {functions, database, DEV_DB_ID, COLLECTION_ID_THREADS} from "../appwriteConfig"
import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

const Thread = ({ thread , setThreads}) => {
  const [loading, setloading] = useState(true);
  const [threadBody,setThreadBody] = useState('');
  const [owner, setOwner] = useState(null);
  const [threadInstance, setThreadInstance] = useState(thread);
  const currentUserId = 

  useEffect(() => {
    if(thread?.owner_id){
      getUserInfo()
  }
    
  }, []);

  const getUserInfo = async () => {
    const payload = {
      "owner_id": thread.owner_id
    }
    const response = await functions.createExecution(
      '64ad9b2da8fa5da4c67b',
      JSON.stringify(payload),
      );
    
    
    const userData = JSON.parse(response.response)
    setOwner(userData)
    setloading(false);

}

const handleDelete = async () => {
  

  database.deleteDocument(DEV_DB_ID, COLLECTION_ID_THREADS, thread.$id)
  console.log('Thread was deleted!')
  setThreads(prevState => prevState.filter(item => item.$id !== thread.$id) )
 // setThreads(prevState => prevState.filter(thread => thread.$id !== thread.$id) )
}

const toggleLike = async () => {
  console.log('Liked toggled')

  const users_who_liked = thread.users_who_liked



if(users_who_liked.includes(currentUserId)){
  const index = users_who_liked.indexOf(currentUserId)
  users_who_liked.splice(index, 1)
}else{
  users_who_liked.push(currentUserId)
}
 

const payload = {
  'users_who_liked':users_who_liked,
  'likes':users_who_liked.length
}

const response = await database.updateDocument(
  DEV_DB_ID,
  COLLECTION_ID_THREADS,
  thread.$id,
  payload
)

setThreadInstance(response)
}
  if (loading) return;

  return (
    <div className="flex p-4">
      <img
        src={owner.profile_pic}
        className="w-10 h-10 rounded-full object-cover  "
      />

      <div className="w-full  px-2  pb-4 border-b border-[rgba(49, 49, 50 ,1)]">
        {/* Thread Section*/}
        <div className="flex justify-between gap-2  items-center">
          <strong>{owner.name}</strong>
          <div className="flex justify-between gap-2 items-center cursor-pointer">
          <p className="text-[rgba(97,97,97,1)]">{<ReactTimeAgo date={new Date(thread.$createdAt).getTime()} locale="en-US"/>}</p>

            <Trash2 onClick={handleDelete} size={14}/>
          </div>
        </div>

        {/* Thread Body*/}
        <div className="py-4" style={{whiteSpace:"pre-wrap"}}>
          {thread.body}
          {thread.image && (
            <img  className="object-cover border border-[rgba(49,49,50,1)] rounded-md" src={thread.image} />
          )}
        </div>

        <div className="flex gap-4 py-4 ">
          <Heart 
          color={threadInstance.users_who_liked.includes(currentUserId) ? '#ff0000' : '#fff'}
          onClick={toggleLike} className="cursor-pointer" size={22} />
          <MessageCircle size={22} />
          <Repeat size={22} />

          <Send size={22} />
        </div>

        <div className="flex gap-4">
          <p className="text-[rgba(97,97,97,1)]">Replies 16</p>
          <p>.</p>
          <p className="text-[rgba(97,97,97,1)]">{threadInstance.likes} Likes</p>
        </div>
      </div>
    </div>
  );
};

export default Thread;
