import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Button, Link } from '@nextui-org/react';

import { Input } from '../../app/components/input';
import { useRegisterMutation } from '../../app/services/userApi';
import { hasErrorField } from '../../utils/has-error-field';
import { ErrorMessage } from '../../app/components/error-message';

type Register = {
	email: string;
	name: string;
	password: string;
};

type Props = {
	setSelected: (value: string) => void;
};

export const Register: React.FC<Props> = ({ setSelected }) => {
	const [register, { isLoading }] = useRegisterMutation();
	const [error, setError] = useState('');

	const { handleSubmit, control, formState: { errors } } = useForm<Register>({
		mode: 'onChange',
		reValidateMode: 'onBlur',
		defaultValues: {
			email: '',
			password: '',
			name: '',
		}
	});

	const onSubmit = async (data: Register) => {
		try {
			await register(data).unwrap();
			setSelected('login');
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
				name='name'
				label='Name'
				type='text'
				required='Required field'
			/>
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
			<ErrorMessage error={ error }/>
			<p className='text-center text-small'>
				Do you already have an account?{' '}
				<Link
					size='sm'
					className='cursor-puinter'
					onPress={() => setSelected('login')}
				>
					Sign up
				</Link>
			</p>
			<div className='flex gap-2 justify-end'>
				<Button fullWidth color='primary' type='submit' isLoading={isLoading}>
					Sign up
				</Button>
			</div>
		</form>
	)
};
