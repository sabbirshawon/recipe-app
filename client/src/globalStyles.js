import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
	body {
		background-color: ${props => 
			props.theme.mode === 'dark' ? '#111 !important' : '#EEE'
		};
		color: ${props => 
			props.theme.mode === 'dark' ? '#EEE !important' : '#111'
		};
	}
	label {
		color: ${props => props.theme.mode === 'dark' ? '#fff !important' : 'rgba(0, 0, 0, 0.54)' }
	}
	input, textarea {
		color: ${props => props.theme.mode === 'dark' ? '#fff !important' : 'rgba(0, 0, 0, 0.54)' }
	}
	.theme_btn_wrap span {
		color: ${props => 
			props.theme.mode === 'dark' ? '#111 !important' : '#EEE'
		};
	}
	.recipe_ingredients_wrap, .recipes {
		color: ${props => 
			props.theme.mode === 'dark' ? '#111 !important' : ''
		};
	}
`;