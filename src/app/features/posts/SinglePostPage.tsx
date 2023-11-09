import { useAppSelector } from "../../hooks";
import { selectPostById, useAddCommentMutation, useGetPostCommentsQuery, useLazyGetPostCommentsQuery, Comment  } from "./postSlice";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from "react";
import { Avatar, Button, Card, CardActionArea, CardActions, CardContent, Stack, TextField, Typography } from "@mui/material";
import EditPostForm from "./EditPostForm";
import { AddComment } from "@mui/icons-material";

const SinglePostPage = () => {
    const { postId } = useParams()

    const post = useAppSelector((state) => selectPostById(state, Number(postId)))

    /*const [getPostComments, {
        data: comments,
        isLoading,
        isSuccess,
        isError
    }] = useLazyGetPostCommentsQuery()*/

    const  { refetch,
        data: comments,
        isLoading,
        isSuccess,
        isError
    } = useGetPostCommentsQuery(Number(postId))

    const [ addComment ] = useAddCommentMutation()
    const [ comment, setComment ] = useState<Comment>({
        id: 0,
        post_id: Number(postId),
        name: 'Иванов Иван',
        email: 'Example@mail.ru',
        body: ''
    })

    const [open, setOpen] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState(-1);


    const handleEditClick = () => {
        setOpen(true)
    }

    const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
        setComment({...comment, body: e.target.value})
    }

    const handleAddComment = async () => {
        if(comment){
            try{
                await addComment(comment).unwrap()

                setComment({
                    id: 0,
                    post_id: Number(postId),
                    name: 'Иванов Иван',
                    email: 'Example@mail.ru',
                    body: ''
                })
                refetch()
                //getPostComments(Number(postId))
            }
            catch(error) {

            }
        }
    }


    const handleDialogClose = () => {
        
    }

    if(!post){
        return (
            <section>
                <h2>Пост не найден!</h2>
            </section>
        )
    }

    let commentsContent
    if(isSuccess) {

        const { ids, entities } = comments
        commentsContent = ids?.map(id => {
            return (<Stack direction="row" spacing={1}>
                        <Avatar/>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2">{entities[id]?.name}</Typography>
                            <Typography variant="body1" gutterBottom>{entities[id]?.body}</Typography>
                        </Stack>
                    </Stack>)
            })
    }

    return (
        <Stack spacing={1}>
            <Card key={post.id}>
                <CardContent>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography>{post.body.substring(0, 100)}</Typography>
                    <p className="postCredit">
                        <PostAuthor user_id={post.user_id} />
                        <TimeAgo timestamp={post.date} />
                    </p>
                </CardContent>
                <CardActions>
                    <ReactionButtons post={post} />
                    <Button size="small" onClick={handleEditClick}>Редактировать</Button>
                    { open ? <EditPostForm id={selectedRowId} onClose={handleDialogClose} />: ''}
                </CardActions>
            </Card>
            <Typography variant="h6">Комментарии</Typography>
            <Card>
                <CardContent>
                    <TextField fullWidth size="small" label="Введите комментарий" value={comment.body} onChange={handleCommentChange}/>
                </CardContent>
                <CardActions>
                    <Button size="small" variant="contained" onClick={handleAddComment}>Добавить Комментарий</Button>
                </CardActions>
            </Card>
            <Card>
                <CardContent>
                    <Stack spacing={1}>
                        {commentsContent}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    )
}

export default SinglePostPage