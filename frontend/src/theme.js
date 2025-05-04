import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6baf',
      light: '#7797e0',
      dark: '#1a4380'
    },
    secondary: {
      main: '#2a4a8a',
      light: '#5674b7',
      dark: '#00235f'
    }
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }
});

export default theme;