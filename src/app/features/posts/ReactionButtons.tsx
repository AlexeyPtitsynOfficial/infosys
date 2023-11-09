import { Post, useAddReactionMutation } from "./postSlice";

const reactionEmoji = {
    thumbsUp: '👍',
    wow: '🥴',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕',
}

type ReactionButtonsProps = {
    post: Post
}

const ReactionButtons = (props: ReactionButtonsProps) => {

    const [addReaction] = useAddReactionMutation()
    
    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) =>{

        type ObjectKey = keyof typeof props.post.reactions;
        return (
            <button 
                key={name}
                type="button"
                className="reactionButton"
                onClick={() => {
                    const newValue = props.post.reactions[name as ObjectKey] + 1;
                    addReaction({ postId: props.post.id, reactions: { ...props.post.reactions, [name]: newValue}})
                }}
            >
                {emoji} {
                    props.post.reactions[name as ObjectKey]
                    }
            </button>
        )
    })

    return (
        <div>{reactionButtons}</div>
    )
}

export default ReactionButtons