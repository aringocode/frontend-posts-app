import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@nextui-org/react';
import { User } from '../../app/components/user';
import { selectCurent } from '../../features/user/userSlice';

export const Following = () => {
	const currentUser = useSelector(selectCurent);

	if (!currentUser) {
		return null
	}

	return (currentUser.followers.length > 0) ? (
		<div className='gap-5 flex flex-col'>
			{currentUser.followers.map((user) => (
				<Link to={`/users/${user.follower.id}`} key={user.follower.id}>
					<Card>
						<CardBody className='block'>
							<User
								name={user.follower.name ?? ''}
								avatarUrl={user.follower.avatarUrl ?? ''}
								description={user.follower.email ?? ''}
							/>
						</CardBody>
					</Card>
				</Link>
			))}
		</div>
	) : (
		<h2>You have no subscribers</h2>
	)
};
