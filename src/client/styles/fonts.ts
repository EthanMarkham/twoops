import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    @font-face {
        font-family: 'Bison Bold';
        src: local('Font Name'), local('BisonBold'),
        url(/assets/fonts/Bison-Bold.woff) format('woff');
        font-weight: 300;
        font-style: normal;
    }
`;
