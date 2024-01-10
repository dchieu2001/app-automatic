import React, { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../utils/AuthProvider';
import MainTabs from './MainTabs';
import Auth from './AuthStack';

export default function () {
	const auth = useContext(AuthContext);
	const user = auth.user;
	return (
		<NavigationContainer>
			{user == false && <Auth  />}
			{user == true && <MainTabs />}
		</NavigationContainer>
	);
};
