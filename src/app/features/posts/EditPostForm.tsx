import { ChangeEvent, useDebugValue, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Post, selectPostById } from "./postSlice";
import { useParams, useNavigate } from 'react-router-dom';

import { useAddNewPostMutation, useUpdatePostMutation, useDeletePostMutation } from "./postSlice";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { selectAllUsers } from "../users/usersApiSlice";

const EditPostForm = (props: {id?: Number, onClose: (value?: string) => void}) => {
    const { postId } = useParams()
    const navigate = useNavigate()

    const [ addPost, { data, isSuccess } ] = useAddNewPostMutation()
    const [updatePost, { isLoading }] = useUpdatePostMutation()
    const [deletePost] = useDeletePostMutation()

    const postOrigin = useAppSelector((state) => selectPostById(state, Number(postId)))
    const users = useAppSelector(selectAllUsers)

    const [post, setPost] = useState<Post>(postOrigin || {
        id: 0, 
        user_id: 0, 
        user: 'sdf',
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

    const dispatch = useAppDispatch()

    const handleClose = () => {
        props.onClose();
    };

    const onPostChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        
        setPost({...post, [e.target.name]: e.target.value})
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        setPost({...post, [e.target.name]: e.target.value})
    };

    const onSavePostClicked = async () => {
        if(post) {
            try {
                if(post.id == 0) {
                    await addPost(post).unwrap()
                }
                else {
                    await updatePost(post).unwrap()
                    navigate(`/post/${postId}`)
                }
                
                /*setPost({
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
                });*/
        
                
            } catch (error) {
                console.error('Failed to save the post', error)
            } 
        }

        
    }

    if(isSuccess) {
        props.onClose();
    }

    const usersOptions = users.map(user=> (
        <MenuItem id="userId" key={user.id} value={user.id}>{user.name}</MenuItem>
    ))

    const onDeletePostClicked = async () => {
        try {
            await deletePost(post).unwrap()

            setPost({
                id: 0, 
                user_id: 0, 
                user: 'asd',
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
            console.error('Failed to delete the post', error)
        } 
    }
    
    return (
        <Dialog fullWidth maxWidth="sm" open={true} onClose={handleClose}>
            <DialogTitle>Редактирование поста</DialogTitle>
            <DialogContent>
                <form>
                    <Grid container spacing={1} xs={12}>
                        <Grid item xs={12}><TextField fullWidth size="small" label="Заголовок" name="title" value={post.title} onChange={onPostChanged}/></Grid>
                        <Grid container item>
                            <FormControl fullWidth>
                                <InputLabel id="postUsersLabel">Автор</InputLabel>
                                <Select
                                    labelId="postUsersLabel"
                                    id="user_id"
                                    value={String(post.user_id)}
                                    label="Автор"
                                    name="user_id"
                                    onChange={handleSelectChange}
                                    >
                                    {usersOptions}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Содержание" name="body" 
                                    multiline rows={4}  
                                    value={post.body} onChange={onPostChanged}/>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={onSavePostClicked}>Сохранить</Button>
                {post.id !== 0 ? <Button className="deleteButton" type="button" onClick={onDeletePostClicked}>Удалить</Button> : ''}
            </DialogActions>
        </Dialog>
    )
}

export default EditPostForm