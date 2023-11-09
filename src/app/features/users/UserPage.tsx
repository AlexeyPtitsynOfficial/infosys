import { useAppSelector } from "../../hooks";
import { selectUserById } from "./usersApiSlice";
import { selectAllPosts } from "../posts/postSlice";
import { Link, useParams } from "react-router-dom";
import { useGetPostByUserIdQuery } from "../posts/postSlice";
import { ReactElement } from "react";
import { Stack, Typography } from "@mui/material";

const UserPage = () => {
    const { userId } = useParams()
    const user = useAppSelector((state) => selectUserById(state, Number(userId)));

    const {
        data: postsForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostByUserIdQuery(Number(userId))

    let content
    if(isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        const { ids, entities } = postsForUser
        content = ids.map(id => {
            return (<li key={id}>
                <Link to={`/post/${id}`}>{entities[id]?.title}</Link>
            </li>)
        })
    } else if (isError) {
        content = <p></p>
    }

    return (
        <Stack>
            <Typography variant="h6">Посты пользователя</Typography>
            <h2>{user?.name}</h2>
            <ol>{content}</ol>
        </Stack>
    )
}

export default UserPage