import { Global, css } from '@emotion/react';

const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #1a1a2e;
    color: #ffffff;
  }

  * {
    box-sizing: border-box;
  }

  .fortune-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%);
  }
`;

const GlobalStyles = () => <Global styles={globalStyles} />;

export default GlobalStyles; 