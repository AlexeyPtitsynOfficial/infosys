import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from 'react-router-dom';
import { useAppSelector } from "../../hooks";
import { selectPostById } from "./postSlice";
import { Button, Card, CardActions, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import React from "react";

const PostExcerpt = (props: {postId: number}) => {
    const post = useAppSelector(state => selectPostById(state, props.postId))!
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>{post.title}</Typography>
                <Typography variant="body2" gutterBottom>{post.body.substring(0, 75)}</Typography>
                <Stack direction="row"> 
                    <PostAuthor user_id={post.user_id} />
                    <TimeAgo timestamp={post.date} />
                </Stack>
            </CardContent>
            <CardActions>
                <ReactionButtons post={post} />
                <Button size="small" variant="text" component={Link} to={`/post/${post.id}`}>Посмотреть пост</Button>
            </CardActions>
        </Card>
    )
}

export default React.memo(PostExcerpt, (prev,next) => {
    if(prev.postId ===next.postId)
        return false;
    else
        return true;
})