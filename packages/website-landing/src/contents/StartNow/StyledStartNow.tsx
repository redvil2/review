import styled from 'styled-components';

import Background from '../../images/boxes.svg';

export const StyledStartNow = styled.div`
  background:
    url(${Background}) no-repeat center -12rem,
    linear-gradient(
      0deg,
      rgba(83, 117, 195, 1) 0%,
      rgba(146, 179, 255, 1) 100%
    );
  background-size: cover;
  position: absolute;
  min-height: 100vh;
  width: 100vw;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .al-website__blur-box {
    backdrop-filter: blur(20px);
    box-shadow:
      -1px -1px 1px rgba(255, 255, 255, 0.3),
      1px 1px 1px rgba(0, 0, 0, 0.2);
  }

  .al-website__qr-signup {
    width: 12rem;
  }
`;
