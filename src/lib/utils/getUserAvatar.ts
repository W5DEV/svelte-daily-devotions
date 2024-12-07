import ChuckAvatar from '../../assets/chuck.jpg';
import JohnAvatar from '../../assets/john.png';
import AvatarPlaceholder from '../../assets/avatar-placeholder.gif';

export default function getUserAvatar(user: string): string {
	switch (user) {
		case 'John':
			return JohnAvatar;
		case 'Chuck':
			return ChuckAvatar;
		default:
			return AvatarPlaceholder;
	}
}
