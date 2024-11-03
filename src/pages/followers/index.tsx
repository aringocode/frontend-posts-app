import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@nextui-org/react';
import { User } from '../../app/components/user';
import { selectCurent } from '../../features/user/userSlice';

export const Followers = () => {
	const currentUser = useSelector(selectCurent);

	if (!currentUser) {
		return null
	}

	return (currentUser.following.length > 0) ? (
		<div className='gap-5 flex flex-col'>
			{currentUser.following.map((user) => (
				<Link to={`/users/${user.following.id}`} key={user.following.id}>
					<Card>
						<CardBody className='block'>
							<User
								name={user.following.name ?? ''}
								avatarUrl={user.following.avatarUrl ?? ''}
								description={user.following.email ?? ''}
							/>
						</CardBody>
					</Card>
				</Link>
			))}
		</div>
	) : (
		<h2>You have no subscriptions</h2>
	)
}
