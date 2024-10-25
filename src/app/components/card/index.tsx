import React, { useState } from 'react';

import { Card as NextUiCard, CardHeader, Spinner, CardBody, CardFooter } from '@nextui-org/react';
import { useLikePostMutation, useUnlikePostMutation } from '../../services/likesApi';
import { useDeletePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery } from '../../services/postsApi';
import { useDeleteCommentMutation } from '../../services/commentsApi';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurent } from '../../../features/user/userSlice';
import { User } from '../user';
import { formatToClientDate } from '../../../utils/format-to-client-date';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Typogrpapy } from '../typogrpapy';
import { ErrorMessage } from '../error-message';
import { FcDislike } from 'react-icons/fc';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { FaRegComment } from 'react-icons/fa';
import { MetaInfo } from "../meta-info";
import { hasErrorField } from "../../../utils/has-error-field"


type Props = {
	avatarUrl: string;
	name: string;
	authorId: string;
	content: string;
	commentId?: string;
	likesCount?: number;
	commentsCount?: number;
	createdAt?: Date;
	id?: string;
	cardFor: 'comment' | 'post' | 'current-post';
	likedByUser?: boolean;
}


export const Card: React.FC<Props> = ({
	avatarUrl = '',
	name = '',
	authorId = '',
	content = '',
	commentId = '',
	likesCount = 0,
	commentsCount = 0,
	createdAt,
	id = '',
	cardFor = 'post',
	likedByUser = false,
}) => {
	const [likePost] = useLikePostMutation();
	const [unlikePost] = useUnlikePostMutation();
	const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
	const [triggerGetPostById] = useLazyGetPostByIdQuery();
	const [deletePost, deletePostStatus] = useDeletePostMutation();
	const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const currentUser = useSelector(selectCurent);

	const refetchPosts = async () => {
		switch (cardFor) {
			case 'post':
				await triggerGetAllPosts().unwrap();
				break
			case 'current-post':
				await triggerGetAllPosts().unwrap();
				break
			case 'comment':
				await triggerGetPostById(id).unwrap();
				break
			default:
				throw new Error('Wrong argument cardFor');
		}
	}

	const handleDelete = async () => {
		try {

			switch (cardFor) {
				case 'post':
					await deletePost(id).unwrap();
					await refetchPosts();
					break
				case 'current-post':
					await deletePost(id).unwrap();
					navigate('/');
					break
				case 'comment':
					await deleteComment(commentId).unwrap();
					await refetchPosts();
					break
				default:
					throw new Error('Wrong argument cardFor');
			}
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error);
			} else {
				setError(error as string);
			}
		}
	};

	const handleClick = async () => {
		try {
			likedByUser ?
				await unlikePost(id).unwrap()
			:
				await likePost({ postId: id }).unwrap()
			switch (cardFor) {
				case 'post':
					await triggerGetAllPosts().unwrap();
					break
				case 'current-post':
					await triggerGetPostById(id).unwrap()
					break
				default:
					throw new Error('Wrong argument cardFor');
			}
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error)
			} else {
				setError(error as string)
			}
		}
	}

	return (
		<NextUiCard className='mb-5'>
			<CardHeader className='justify-between items-center bg-transparent'>
				<Link to={`/users/${authorId}`}>
					<User
						name={name}
						avatarUrl={avatarUrl}
						className='text-small font-semibold leading-non text-default-600'
						description={createdAt && formatToClientDate(createdAt)}
					/>
				</Link>
				{authorId === currentUser?.id &&
					<div className='cursor-pointer' onClick={handleDelete}>
						{deletePostStatus.isLoading || deleteCommentStatus.isLoading ?
							<Spinner />
						:
							<RiDeleteBinLine />
						}
					</div>
				}
			</CardHeader>
			<CardBody className='px-3 py-2 mb-5'>
				<Typogrpapy>{ content }</Typogrpapy>
			</CardBody>
			{
				cardFor !== 'comment' && (
					<CardFooter className='gap-3'>
						<div className='flex gap-5 items-center'>
							<div onClick={handleClick}>
								<MetaInfo
									count={likesCount}
									Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder} />
							</div>
							<Link to={`/posts/${id}`}>
								<MetaInfo count={commentsCount} Icon={FaRegComment} />
							</Link>
						</div>
						<ErrorMessage error={error} />
					</CardFooter>
				)
			}
		</NextUiCard>
	)
}
