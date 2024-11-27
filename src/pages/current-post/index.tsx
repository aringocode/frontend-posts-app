import React from 'react';
import { useParams } from 'react-router-dom';

import { Card } from '../../app/components/card';
import { GoBack } from '../../app/components/go-back';
import { useGetPostByIdQuery } from '../../app/services/postsApi';
import { Comment } from '../../app/types';
import { CreateComment } from '../../app/components/create-comment';

export const CurrentPost = () => {
	const params = useParams<{ id: string }>();
	const { data } = useGetPostByIdQuery(params?.id ?? '');

	if (!data) {
		return <h2>Post not exist</h2>
	}

	const {
		content,
		id,
		authorId,
		comments,
		likes,
		author,
		likedByUser,
		createdAt
	} = data;

	return (
		<>
			<GoBack />
			<Card
				cardFor='current-post'
				avatarUrl={author.avatarUrl ?? ''}
				content={content}
				name={author.name ?? ''}
				likesCount={likes.length}
				commentsCount={comments.length}
				authorId={authorId}
				id={id}
				likedByUser={likedByUser}
				createdAt={createdAt}
			/>
			<div className='mt-10'>
				<CreateComment />
			</div>
			<div className='mt-10'>
				{comments ?
					comments.map((comment: Comment) => (
						<Card
							key={comment.id}
							cardFor='comment'
							avatarUrl={comment.user.avatarUrl ?? ''}
							content={comment.content}
							name={comment.user.name ?? ''}
							authorId={comment.userId}
							commentId={comment.id}
							id={id}
						/>
					))
				:
					null
				}
			</div>
		</>
	)
};
