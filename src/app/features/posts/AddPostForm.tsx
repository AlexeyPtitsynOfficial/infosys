import { ChangeEvent, useState } from "react"
import { useAppSelector } from "../../hooks";

import { Post } from "./postSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from 'react-router-dom'
import { useAddNewPostMutation } from "./postSlice";

const AddPostForm = () => {
    const [addNewPost, { isLoading }] = useAddNewPostMutation()

    const navigate = useNavigate();

    const users = useAppSelector(selectAllUsers);

    const [post, setPost] = useState<Post>({
        id: 0, 
        user_id: 0, 
        user: '',
        title: '', 
        body: '', 
        date: new Date().toISOString(), 
        reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
        }
    });

    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))
    
    const onPostChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        
        setPost({...post, [e.target.name]: e.target.value})
    };

    const onSavePostClicked = async () => {
        if(post) {
            try {
                await addNewPost(post).unwrap()

                setPost({
                    id: 0, 
                    user_id: 0, 
                    user: '',
                    title: '', 
                    body: '', 
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        hooray: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                });

                navigate(`/`)
            } catch (error) {
                
            } 
        }

        
    }

    return (
        <section>
            <h2>Добавление поста</h2>
            <form>
                <label htmlFor="title">Post Title:</label>
                <input type="text" id="title" name="title" value={post.title} onChange={onPostChanged}/>
                <label htmlFor="author">Post Author:</label>
                <select id="userId" name='userId' value={post.user_id} onChange={onPostChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="body">Post Content:</label>
                <textarea id="body" name="body" value={post.body} onChange={onPostChanged} />
                <button type="button" onClick={onSavePostClicked}>Save Post</button>
            </form>
        </section>
    )
}

export default AddPostForm