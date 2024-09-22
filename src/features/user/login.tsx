import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Link } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

import { Input } from '../../app/components/input';
import { useLazyCurrentQuery, useLoginMutation } from '../../app/services/userApi';
import { ErrorMessage } from '../../app/components/error-message';
import { hasErrorField } from '../../utils/has-error-field';

type Login = {
	email: string;
	password: string;
}

type Props = {
	setSelected: (value: string) => void;
}

export const Login: React.FC<Props> = ({ setSelected }) => {
	const navigate = useNavigate();
	const [error, setError] = useState('');
	const [login, { isLoading }] = useLoginMutation();
	const [triggerCurrentQuery] = useLazyCurrentQuery();

	const { handleSubmit, control, formState: { errors } } = useForm<Login>({
		mode: 'onChange',
		reValidateMode: 'onBlur',
		defaultValues: {
			email: '',
			password: '',
		}
	});

	const onSubmit = async (data: Login) => {
		try {
			await login(data).unwrap();
			await triggerCurrentQuery().unwrap();
			navigate('/');
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error);
			}
		}
	};

	return (
		<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
			<Input
				control={control}
				name='email'
				label='Email'
				type='email'
				required='Required field'
			/>
			<Input
				control={control}
				name='password'
				label='Password'
				type='password'
				required='Required field'
			/>
			<ErrorMessage error={error} />
			<p className='text-center text-small'>
				Don't have an account?{' '}
				<Link
					size='sm'
					className='cursor-puinter'
					onPress={() => setSelected('sign-up')}
				>
					Sign-up
				</Link>
			</p>
			<div className='flex gap-2 justify-end'>
				<Button
					fullWidth
					color='primary'
					type='submit'
					isLoading={isLoading}
				>
					Login
				</Button>
			</div>
		</form>
	)
}
