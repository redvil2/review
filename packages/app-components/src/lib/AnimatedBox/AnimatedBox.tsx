import styled from '@emotion/styled';

type AnimatedBoxProps = {
  isVisible: boolean;
};

export const AnimatedBox = styled.div<AnimatedBoxProps>`
  transition: all 0.5s ease;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transform: ${props =>
    props.isVisible ? 'translateY(0)' : 'translateY(20px)'};
  margin-top: 20px;
`;
