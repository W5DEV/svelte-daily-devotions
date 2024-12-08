import BeckyAvatar from '../../assets/becky.jpg';
import ChuckAvatar from '../../assets/chuck.png';
import JohnAvatar from '../../assets/john.png';
import MandyAvatar from '../../assets/mandy.png';
import AvatarPlaceholder from '../../assets/avatar-placeholder.gif';

export default function getUserAvatar(user: string): string {
	switch (user) {
		case 'John':
			return JohnAvatar;
		case 'Chuck':
			return ChuckAvatar;
		case 'Becky':
			return BeckyAvatar;
		case 'Ashley':
			return AvatarPlaceholder;
		case 'Caleb':
			return AvatarPlaceholder;
		case 'Cameron':
			return AvatarPlaceholder;
		case 'Charlie':
			return AvatarPlaceholder;
		case 'Chrissy':
			return AvatarPlaceholder;
		case 'Duane':
			return AvatarPlaceholder;
		case 'Dustin':
			return AvatarPlaceholder;
		case 'Garrett':
			return AvatarPlaceholder;
		case 'Justin':
			return AvatarPlaceholder;
		case 'Kendall':
			return AvatarPlaceholder;
		case 'Larry':
			return AvatarPlaceholder;
		case 'Leslie':
			return AvatarPlaceholder;
		case 'Mandy':
			return MandyAvatar;
		case 'Matthew':
			return AvatarPlaceholder;
		case 'Morgan':
			return AvatarPlaceholder;
		case 'Natalie':
			return AvatarPlaceholder;
		case 'Ryan':
			return AvatarPlaceholder;
		case 'Tammy':
			return AvatarPlaceholder;
		default:
			return AvatarPlaceholder;
	}
}
