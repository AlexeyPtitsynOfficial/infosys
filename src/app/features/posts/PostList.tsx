import { useAppSelector, } from "../../hooks";
import { selectPostIds } from "./postSlice";
import PostExcerpt from "./PostExcerpt";
import { useGetPostsQuery } from "./postSlice";
import { Button, Grid, Stack } from "@mui/material";
import EditPostForm from "./EditPostForm";
import { FunctionComponent, useEffect, useState } from "react";

const PostList: FunctionComponent = () => {
    const { refetch,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery()
    const orderedPostIds = useAppSelector(selectPostIds)

    const [ open, setOpen ] = useState(false)

    const handleAddPost = () => {
        setOpen(true)
    }

    const handleDialogClose = () => {
        setOpen(false)
        refetch()
    }

    let content
    if(isLoading) {
        content = <p>"Загрузка..."</p>
    } else if (isSuccess) {
        content = orderedPostIds.map(postId => <PostExcerpt key={postId} postId={Number(postId)}/>)
    } else if (isError) {
        //content = <p>{error}</p>
    }

    return (
        <Stack spacing={1}>
            <Grid container direction="column" alignItems="flex-end">
                <Grid item>
                    <Button variant="contained" onClick={handleAddPost}>Добавить пост</Button>
                </Grid>
            </Grid>
            { open ? <EditPostForm onClose={handleDialogClose}/> : ''}
            {content}
        </Stack>
    )
}

export default PostList