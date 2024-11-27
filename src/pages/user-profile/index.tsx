import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Image, useDisclosure, Button } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { CiEdit } from 'react-icons/ci';
import { MdOutlinePersonAddAlt1, MdOutlinePersonAddDisabled } from 'react-icons/md';

import { resetUser, selectCurent } from '../../features/user/userSlice';
import { useGetUserByIdQuery, useLazyCurrentQuery, useLazyGetUserByIdQuery } from '../../app/services/userApi';
import { useFollowUserMutation, useUnfollowUserMutation } from '../../app/services/followApi';
import { GoBack } from '../../app/components/go-back';
import { BASE_URL } from '../../constants';
import { ProfileInfo } from '../../app/components/profile-info';
import { CountInfo } from '../../app/components/count-info';
import { formatToClientDate } from '../../utils/format-to-client-date';
import { EditProfile } from '../../app/components/edit-profile';

export const UserProfile = () => {
	const { id } = useParams<{ id: string }>();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const currentUser = useSelector(selectCurent);
	const { data } = useGetUserByIdQuery(id ?? '');
	const [ followUser ] = useFollowUserMutation();
	const [ unfollowUser ] = useUnfollowUserMutation();
	const [ triggerGetUserByIdQuery ] = useLazyGetUserByIdQuery();
	const [ triggerCurrentQuery ] = useLazyCurrentQuery();

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(resetUser());
	}, []);

	const handleFollow = async () => {
		try {
			if (id) {
				data?.isFollowing
					? await unfollowUser(id).unwrap()
					: await followUser({ followingId: id }).unwrap();

				await triggerGetUserByIdQuery(id);

				await triggerCurrentQuery();
			}
		} catch (error) {
			console.log(error)
		}
	};

	const handleClose = async () => {
		try {
			if (id) {
				await triggerGetUserByIdQuery(id);
				await triggerCurrentQuery();
				onClose();
			}
		} catch (e) {
			console.error(e)
		}
	}

	if (!data) {
		return null;
	}

	return (
		<>
			<GoBack />
			<div className='flex items-center gap-4'>
				<Card className='flex flex-col items-center text-center space-y-4 p-5 flex-2'>
					<Image
						src={`${BASE_URL}${data?.avatarUrl}`}
						alt={data?.name}
						width={200}
						height={200}
						className='border-4 border-white'
					/>
					<div className='flex flex-col text-2xl font-bold gap-4 items-center'>
						{data?.name}
						{(currentUser?.id !== id) ? (
							<Button
								color={data?.isFollowing ? 'default' : 'primary'}
								variant='flat'
								className='gap-2'
								onClick={handleFollow}
								endContent={
									data?.isFollowing ? (
										<MdOutlinePersonAddDisabled />
									) : (
										<MdOutlinePersonAddAlt1 />
									)
								}
							>
								{data?.isFollowing ? 'Unsubscribe' : 'Subscribe'}
							</Button>
						) : (
							<Button
								endContent={<CiEdit />}
								onClick={() => onOpen()}
							>
								Edit
							</Button>
						)}
					</div>
				</Card>
				<Card className='flex flex-col space-y-4 p-5 flex-1'>
					<ProfileInfo title='Email:' info={data?.email} />
					<ProfileInfo title='Location:' info={data?.location} />
					<ProfileInfo title='Date of birth:' info={formatToClientDate(data?.dateOfBirth)} />
					<ProfileInfo title='About me:' info={data?.bio} />

					<div className='flex gap-2'>
						<CountInfo count={data?.followers.length} title='Subscribers'/>
						<CountInfo count={data?.following.length} title='Subscriptions'/>
					</div>
				</Card>
			</div>
			<EditProfile isOpen={isOpen} onClose={handleClose} user={data} />
		</>
	)
};
