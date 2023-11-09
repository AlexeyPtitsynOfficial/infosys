import { FunctionComponent, useEffect } from "react";
import { useAppSelector } from "../../hooks";
import { selectAllUsers, useGetUsersQuery } from "../users/usersApiSlice";
import { Link } from "react-router-dom";

type AuthorProps = {
    user_id:number
}

const PostAuthor = (props: AuthorProps ) => {

    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()
    
    const users = useAppSelector(selectAllUsers);

    

    let content  = <p>Загрузка...</p>;
    if(isLoading) {
        content = <p>Загрузка...</p>
    } else if (isSuccess) {
        const author = users.find(user => user.id === props.user_id);
        content = <span> {author ? <Link to={`/user/${props.user_id}`}>{author.name}</Link> : 'Неизвестный автор'}</span>
    }

    return content
}

export default PostAuthor