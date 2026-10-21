import styled from 'styled-components';

const LogoImg = styled.img`
  height: ${(props) => props.$size}px;
  width: auto;
  object-fit: contain;
  display: inline-block;
`;

const BuyyLogo = ({ size = 28 }) => <LogoImg src="/logo-nobg.png" alt="GoMode" $size={size} />;

export default BuyyLogo;
